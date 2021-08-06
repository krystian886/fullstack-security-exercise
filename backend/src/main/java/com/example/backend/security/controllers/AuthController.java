package com.example.backend.security.controllers;

import com.example.backend.security.services.AuthControllerService;
import com.example.backend.security.payload.request.LoginRequest;
import com.example.backend.security.payload.request.RegistrationRequest;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthControllerService authControllerService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return authControllerService.authenticateUser(loginRequest);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegistrationRequest signUpRequest) {
        return authControllerService.registerUser(signUpRequest);
    }

    @GetMapping("/confirm")
    @Transactional
    @ResponseBody
    public String tokenVerification(@RequestParam("token") String token) {
        return authControllerService.tokenVerification(token);
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody String emailJSON) {
        return authControllerService.resetPassword(emailJSON);
    }
}
