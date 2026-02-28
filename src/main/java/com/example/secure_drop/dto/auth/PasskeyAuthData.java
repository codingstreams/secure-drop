package com.example.secure_drop.dto.auth;

import lombok.Data;

@Data
public class PasskeyAuthData {
  private String id; // Credential ID
  private String rawId; // Base64 encoded ID
  private String clientDataJSON; // Challenge context
  private String authenticatorData;
  private String signature; // The cryptographic proof
  private String userHandle;
}
