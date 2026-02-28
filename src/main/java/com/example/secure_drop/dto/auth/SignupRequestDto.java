package com.example.secure_drop.dto.auth;

import lombok.Data;

@Data
public class SignupRequestDto {
  private String fullName;
  private String email;
  private String password;
  private String publicKey;
}
