package com.example.secure_drop.model;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileMetadata {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String fileName;

  @Column(nullable = false)
  private String storagePath;

  @Column(nullable = false)
  private String contentType;

  @Column(nullable = false, unique = true)
  private String accessCode; // Format: ABC-123

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private StorageMode mode; // PUBLIC_POOL or PRIVATE_VAULT

  @Column(nullable = false)
  private long size;

  @Column(name = "owner_id")
  private String ownerId; // Null for anonymous uploads

  @Column(nullable = false, updatable = false)
  private Instant createAt;

  @Column(nullable = false)
  private Instant expiresAt;

  @Builder.Default
  @Column(nullable = false)
  private Integer maxDownloads = 1; // 1 for public, custom for private

  @Builder.Default
  @Column(nullable = false)
  private Integer downloadCount = 0;

  @Builder.Default
  @Column(nullable = false)
  private FileStatus status = FileStatus.ACTIVE;

  public boolean isExpired() {
    return Instant.now().isAfter(this.expiresAt);
  }

  public boolean isLimitReached() {
    return maxDownloads > 0 && downloadCount >= maxDownloads;
  }
}
