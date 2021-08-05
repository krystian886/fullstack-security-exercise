package com.example.backend.security.payload.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter @Setter
public class JwtResponse {
	private String token;
	private String type = "Bearer";
	private Long id;
	private String username;
	private String email;
	private boolean enabled;
	private final List<String> roles;

	public JwtResponse(String accessToken,
					   Long id,
					   String username,
					   String email,
					   boolean enabled,
					   List<String> roles) {
		this.token = accessToken;
		this.id = id;
		this.username = username;
		this.email = email;
		this.enabled = enabled;
		this.roles = roles;
	}
}
