package com.example.secure_drop.dto.auth;

import lombok.Data;

@Data
public class OtpRequest {
  private String identifier;
  private String channel; // "EMAIL" or "SMS"
}
