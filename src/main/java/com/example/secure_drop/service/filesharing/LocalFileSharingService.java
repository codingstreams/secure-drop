package com.example.secure_drop.service.filesharing;

import java.time.Clock;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Objects;
import java.util.Optional;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.example.secure_drop.config.AppConfigProperties;
import com.example.secure_drop.dto.file.FileResponseDto;
import com.example.secure_drop.dto.file.UpdateFileSettingsDto;
import com.example.secure_drop.exception.FileExpiredException;
import com.example.secure_drop.exception.DownloadLimitExceededException;
import com.example.secure_drop.exception.ResourceNotFoundException;
import com.example.secure_drop.exception.StorageException;
import com.example.secure_drop.exception.UnauthorizedAccessException;
import com.example.secure_drop.model.FileMetadata;
import com.example.secure_drop.model.FileStatus;
import com.example.secure_drop.model.StorageMode;
import com.example.secure_drop.repo.FileMetadataRepo;
import com.example.secure_drop.service.filestorage.FileStorageService;
import com.example.secure_drop.util.FileAccessCodeUtils;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class LocalFileSharingService implements FileSharingService {
  private static final int DEFAULT_MAX_DOWNLOADS = 1;
  private static final int DEFAULT_EXPIRY_DAYS = 1;
  private final FileStorageService fileStorageService;
  private final FileMetadataRepo fileMetadataRepo;
  private final AppConfigProperties appConfigProperties;
  private final Clock clock;

  @Override
  public FileResponseDto uploadFile(MultipartFile file, String ownerId, int hours, int maxDownloads) {
    if (file.isEmpty()) {
      throw new RuntimeException("Failed to store empty file.");
    }

    String accessCode = FileAccessCodeUtils.generateAccessCode();

    String storedPath = fileStorageService.store(file, accessCode);

    int expiryHours = (hours <= 0) ? (DEFAULT_EXPIRY_DAYS * 24) : hours;
    int limit = (maxDownloads <= 0) ? DEFAULT_MAX_DOWNLOADS : maxDownloads;

    Instant now = clock.instant();
    Instant expiryDate = now.plus(expiryHours, ChronoUnit.HOURS);

    FileMetadata metadata = FileMetadata.builder()
        .accessCode(accessCode)
        .fileName(file.getOriginalFilename())
        .storagePath(storedPath)
        .ownerId(ownerId)
        .contentType(Optional.ofNullable(file.getContentType()).orElse("application/octect-stream"))
        .size(file.getSize())
        .createAt(now)
        .expiresAt(expiryDate)
        .maxDownloads(limit)
        .downloadCount(0)
        .mode(Objects.isNull(ownerId) ? StorageMode.PUBLIC_POOL : StorageMode.PRIVATE_VAULT)
        .build();

    fileMetadataRepo.save(metadata);

    return mapToResponseDto(metadata);
  }

  @Override
  public FileResponseDto getFileMetadata(String accessCode) {
    FileMetadata metadata = fileMetadataRepo.findByAccessCode(accessCode)
        .orElseThrow(() -> new ResourceNotFoundException("File not found with code: " + accessCode));

    Instant now = clock.instant();
    if (metadata.getExpiresAt().isBefore(now)) {
      throw new FileExpiredException("This file has expired.");
    }

    return mapToResponseDto(metadata);
  }

  @Override
  public Resource downloadFile(String accessCode) {
    FileMetadata metadata = fileMetadataRepo.findByAccessCode(accessCode)
        .orElseThrow(() -> new ResourceNotFoundException("File not found with code: " + accessCode));

    Instant now = clock.instant();

    if (metadata.getExpiresAt().isBefore(now)) {
      metadata.setStatus(FileStatus.EXPIRED);
      fileMetadataRepo.save(metadata);
      throw new FileExpiredException("This file link has expired.");
    }

    if (metadata.getDownloadCount() >= metadata.getMaxDownloads()) {
      throw new DownloadLimitExceededException("Maximum download limit reached.");
    }

    metadata.setDownloadCount(metadata.getDownloadCount() + 1);

    if (metadata.getDownloadCount() >= metadata.getMaxDownloads()) {
      metadata.setStatus(FileStatus.INACTIVE);
    }

    fileMetadataRepo.save(metadata);

    Resource resource = fileStorageService.load(metadata.getStoragePath());

    if (!resource.exists() || !resource.isReadable()) {
      throw new StorageException("Could not read the file from disk: " + metadata.getFileName());
    }

    return resource;
  }

  @Override
  public Page<FileResponseDto> listUserFiles(String ownerId, Pageable pageable) {
    Page<FileMetadata> metadataPage = fileMetadataRepo.findAllByOwnerId(ownerId, pageable);
    return metadataPage.map(this::mapToResponseDto);
  }

  @Override
  public FileResponseDto updateFileSettings(String accessCode, String ownerId, UpdateFileSettingsDto settings) {
    FileMetadata metadata = fileMetadataRepo.findByAccessCode(accessCode)
        .orElseThrow(() -> new ResourceNotFoundException("File not found with code: " + accessCode));

    if (!metadata.getOwnerId().equals(ownerId)) {
      throw new UnauthorizedAccessException("You do not have permission to update this file.");
    }

    if (settings.getExpiresInHours() > 0) {
      Instant newExpiry = clock.instant().plus(settings.getExpiresInHours(), ChronoUnit.HOURS);
      metadata.setExpiresAt(newExpiry);
    }

    if (settings.getMaxDownloads() > 0) {
      if (settings.getMaxDownloads() < metadata.getDownloadCount()) {
        throw new IllegalArgumentException("New max downloads cannot be less than current downloads.");
      }
      metadata.setMaxDownloads(settings.getMaxDownloads());
    }

    if (settings.getMode() != null) {
      metadata.setMode(settings.getMode());
    }

    var updatedMetadata = fileMetadataRepo.save(metadata);

    return mapToResponseDto(updatedMetadata);
  }

  @Override
  public FileResponseDto publishToPublicPool(String accessCode, String ownerId) {
    FileMetadata metadata = fileMetadataRepo.findByAccessCode(accessCode)
        .orElseThrow(() -> new ResourceNotFoundException("File not found: " + accessCode));

    if (!metadata.getOwnerId().equals(ownerId)) {
      throw new UnauthorizedAccessException("You are not authorized to publish this file.");
    }

    metadata.setOwnerId(null); // Becomes "Anonymous/Public"
    metadata.setMode(StorageMode.PUBLIC_POOL);

    var updated = fileMetadataRepo.save(metadata);

    return mapToResponseDto(updated);
  }

  @Override
  @Transactional
  public void deleteFile(String accessCode, String ownerId) {
    FileMetadata metadata = fileMetadataRepo.findByAccessCode(accessCode)
        .orElseThrow(() -> new ResourceNotFoundException("File not found: " + accessCode));

    if (!metadata.getOwnerId().equals(ownerId)) {
      throw new UnauthorizedAccessException("Unauthorized deletion attempt.");
    }

    try {
      fileStorageService.delete(metadata.getStoragePath());
    } catch (Exception e) {

      log.error("Failed to delete physical file at {}: {}", metadata.getStoragePath(), e.getMessage());
    }

    fileMetadataRepo.delete(metadata);
  }

  private FileResponseDto mapToResponseDto(FileMetadata metadata) {
    return FileResponseDto.builder()
        .accessCode(metadata.getAccessCode())
        .fileName(metadata.getFileName())
        .fileSize(metadata.getSize())
        .mimeType(metadata.getContentType())
        .mode(metadata.getMode())
        .shareUrl(
            Optional.ofNullable(appConfigProperties.getBaseUrl()).orElse("") + metadata.getAccessCode() + "/download")
        .expiresAt(metadata.getExpiresAt().toString())
        .maxDownloads(metadata.getMaxDownloads())
        .currentDownloads(metadata.getDownloadCount())
        .ownerId(metadata.getOwnerId())
        .build();
  }

}
