package com.example.secure_drop.dto.auth;

import java.time.Instant;

import com.example.secure_drop.dto.file.UserSummary;

import lombok.Data;

@Data
public class AuthResponse {
  private String accessToken;
  private String refreshToken;
  private String tokenType; // e.g., "Bearer"
  private Instant expiresAt;
  private UserSummary user;

}
