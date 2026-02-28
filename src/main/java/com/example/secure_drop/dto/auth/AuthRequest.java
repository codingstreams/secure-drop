package com.example.secure_drop.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {

  private String identifier;
  private String password;
  private String otpCode;
  private PasskeyAuthData passkeyData;
  private String oauthProvider;
  private String providerToken;
}