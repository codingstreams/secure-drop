package com.example.secure_drop.model;

import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Column(unique = true, nullable = false)
  private String email;

  private String password; // Nullable if using only OAuth/Passkeys

  @Column(unique = true)
  private String username;

  // IMPORTANT: The Master Public Key for file encryption
  @Column(columnDefinition = "TEXT")
  private String publicKey;

  @Enumerated(EnumType.STRING)
  private AuthProvider provider; // LOCAL, GOOGLE, GITHUB

  private boolean enabled = true;

  @ElementCollection(fetch = FetchType.EAGER)
  private Set<String> roles; // ROLE_USER, ROLE_ADMIN
}

enum AuthProvider {
  LOCAL, GOOGLE, GITHUB
}
