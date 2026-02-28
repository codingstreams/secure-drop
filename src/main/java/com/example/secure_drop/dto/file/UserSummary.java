package com.example.secure_drop.dto.file;

import java.util.List;

import lombok.Data;

@Data
public class UserSummary {
  private String username;
  private String email;
  private String publicKey; // Required for your File Sharing encryption
  private List<String> roles;
}
