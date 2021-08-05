package com.example.backend.security.controllers;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.transaction.Transactional;
import javax.validation.Valid;

import com.example.backend.security.services.EmailSender;
import com.example.backend.security.repositories.EmailTokenRepository;
import org.apache.tomcat.util.codec.binary.Base64;
import com.example.backend.security.models.EmailToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.keygen.BytesKeyGenerator;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.backend.security.models.ERole;
import com.example.backend.security.models.Role;
import com.example.backend.security.models.User;
import com.example.backend.security.payload.request.LoginRequest;
import com.example.backend.security.payload.request.RegistrationRequest;
import com.example.backend.security.payload.response.JwtResponse;
import com.example.backend.security.payload.response.MessageResponse;
import com.example.backend.security.repositories.RoleRepository;
import com.example.backend.security.repositories.UserRepository;
import com.example.backend.security.jwt.JwtUtils;
import com.example.backend.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${example.com.emailTokenExpirationMs}")
    private int emailTokenExpirationMs;

    @Value("${example.com.apiAddress}")
    private String apiAddress;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    EmailTokenRepository emailTokenRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    EmailSender emailSender;

    private static final BytesKeyGenerator DEFAULT_TOKEN_GENERATOR = KeyGenerators.secureRandom(15);
    private static final Charset US_ASCII = StandardCharsets.US_ASCII;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        if(!userDetails.isEnabled())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.isEnabled(),
                roles));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegistrationRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                if ("admin".equals(role)) {
                    Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(adminRole);
                } else {
                    Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);
        String token = createEmailToken(user);
        emailSender.send(user.getEmail(), apiAddress.replace("\"", "") + "token/" + token);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @GetMapping("/token/{token}")
    @Transactional
    @ResponseBody
    public String tokenVerification(@PathVariable String token) {
        if(emailTokenRepository.findByToken(token).isEmpty())
            return "<p>Error! Token not valid.</p>";

        EmailToken emailToken = emailTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

        if(emailToken.getExpireAt().isBefore(LocalDateTime.now())) {
            User user = emailToken.getUser();
            emailTokenRepository.removeByToken(token);
            userRepository.delete(user);
            return "<p>Error! Token already expired.<br>" +
                    "Your account has been deleted, register again!</p>";
        }

        emailToken.getUser().setAccountVerified(true);
        emailTokenRepository.removeByToken(token);
        return "<p>Success! Your account has been verified</p>";
    }

    public String createEmailToken(User user) {
        String tokenValue = new String(Base64.encodeBase64URLSafe(DEFAULT_TOKEN_GENERATOR.generateKey()), US_ASCII);
        while(emailTokenRepository.findByToken(tokenValue).isPresent())
            tokenValue = new String(Base64.encodeBase64URLSafe(DEFAULT_TOKEN_GENERATOR.generateKey()), US_ASCII);

        EmailToken emailToken = new EmailToken(
                tokenValue,
                LocalDateTime.now(),
                LocalDateTime.now().plusSeconds(emailTokenExpirationMs),
                user
        );

        emailTokenRepository.save(emailToken);
        return tokenValue;
    }
}
