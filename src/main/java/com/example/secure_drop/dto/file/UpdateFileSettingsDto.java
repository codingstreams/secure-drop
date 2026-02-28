package com.example.secure_drop.dto.file;

import com.example.secure_drop.model.StorageMode;

import lombok.Data;

@Data
public class UpdateFileSettingsDto {
  private StorageMode mode;
  private int expiresInHours; // Number of hours before the upload expires
  private int maxDownloads; // Maximum number of downloads allowed for the uploaded file

}