package com.example.secure_drop.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@ConfigurationProperties(prefix = "encryption")
@Getter
@Setter
public class EncryptionProperties {
  private String algorithm;
  private String secretKey;
}
