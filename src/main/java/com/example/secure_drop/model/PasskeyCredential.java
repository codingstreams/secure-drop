package com.example.secure_drop.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasskeyCredential {
  @Id
  private String credentialId; // Provided by the browser/authenticator

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  @Column(columnDefinition = "TEXT")
  private String publicKey; // The specific public key for THIS passkey device

  private Long signCount;
  private String deviceType; // e.g., "iPhone", "Chrome on Windows"
}
