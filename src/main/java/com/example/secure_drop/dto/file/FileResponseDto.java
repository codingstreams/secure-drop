package com.example.secure_drop.dto.file;

import com.example.secure_drop.model.StorageMode;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FileResponseDto {
  private String accessCode;
  private String fileName;
  private Long fileSize;
  private String mimeType;
  private StorageMode mode;
  private String shareUrl;
  private String expiresAt; // ISO String
  private int maxDownloads;
  private int currentDownloads;
  private String ownerId; // Optional for anonymous uploads
}
