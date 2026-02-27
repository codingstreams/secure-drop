package com.example.secure_drop.model;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
  private String fileType;

  @Column(nullable = false)
  private String storagePath;

  @Column(nullable = false, unique = true)
  private String accessCode;

  @Builder.Default
  @Column(nullable = false, updatable = false)
  private Timestamp uploadDate = new Timestamp(System.currentTimeMillis());

  @Column(nullable = false)
  private Timestamp expiryDate;

  @Builder.Default
  @Column(nullable = false)
  private Integer maxDownloads = -1;

  public boolean isConsumed() {
    return maxDownloads <= 0;
  }
}
