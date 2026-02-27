package com.example.secure_drop.service.filestorage;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.example.secure_drop.config.EncryptionProperties;
import com.example.secure_drop.config.FileStorageProperties;
import com.example.secure_drop.exception.ResourceNotFoundException;
import com.example.secure_drop.service.encryption.EncryptionService;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class LocalFileStorageService implements FileStorageService {
  private final FileStorageProperties fileStorageProperties;
  private final EncryptionProperties encryptionProperties;
  private final EncryptionService encryptionService;

  @Override
  @PostConstruct
  public void init() {
    log.info("Initializing upload directory...");

    if (fileStorageProperties.getUploadDir() != null) {
      var uploadDirPath = Path.of(fileStorageProperties.getUploadDir());
      log.debug("Upload directory path resolved to: {}", uploadDirPath);

      try {
        Files.createDirectories(uploadDirPath);
        log.info("Upload directory created or already exists: {}", uploadDirPath);
      } catch (IOException e) {
        log.error("Failed to create upload directory: {}", uploadDirPath, e);
        throw new RuntimeException(e);
      }
    } else {
      log.warn("Upload directory is null. Skipping initialization.");
    }
  }

  @Override
  public String store(MultipartFile file) {
    log.info("Starting to store file: {}", file.getOriginalFilename());

    var originalFilename = Optional.ofNullable(file.getOriginalFilename())
        .orElseThrow(() -> new RuntimeException("Filename cannot be null."));

    var filePath = StringUtils.cleanPath(Objects.requireNonNull(originalFilename));
    log.debug("Cleaned file path: {}", filePath);

    if (filePath.contains("..")) {
      log.error("Invalid file path detected: {}", filePath);
      throw new RuntimeException("Invalid file path.");
    }

    try {
      if (file.isEmpty()) {
        log.warn("Attempted to store empty file: {}", filePath);
        throw new RuntimeException("Cannot store empty file.");
      }

      // Encrypt File
      var encrypted = encryptionService.encrypt(file.getBytes(), encryptionProperties.getSecretKey());

      var fileName = UUID.randomUUID().toString();

      log.debug("Generated unique filename: {}", fileName);

      Path destination = Path.of(fileStorageProperties.getUploadDir(), fileName);
      Files.copy(new ByteArrayInputStream(encrypted), destination, StandardCopyOption.REPLACE_EXISTING);

      log.info("File successfully stored at: {}", destination.toAbsolutePath());
      return fileName;
    } catch (IOException e) {
      log.error("Failed to store file: {}", filePath, e);
      throw new RuntimeException("File storage failed.", e);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public Resource load(Path path) {
    log.info("Loading file from {}", path);
    var resource = new FileSystemResource(path);

    if (!resource.exists()) {
      log.warn("Requested file does not exist: {}", path);
      throw new ResourceNotFoundException(path.toString());
    }

    try {
      var file = encryptionService.decrypt(resource.getContentAsByteArray(), encryptionProperties.getSecretKey());
      log.debug("Decryption successful for file {}", path);

      return new ByteArrayResource(file);
    } catch (Exception e) {
      log.error("Failed to decrypt file {}", path, e);
      throw new RuntimeException(e);
    }
  }

  @Override
  public boolean delete(Path path) {
    log.info("Attempting to delete file at {}", path);
    try {
      boolean deleted = Files.deleteIfExists(path);
      if (deleted) {
        log.info("Successfully deleted file at {}", path);
      } else {
        log.warn("File not found, nothing deleted at {}", path);
      }
      return deleted;
    } catch (IOException e) {
      log.error("Failed to delete file at {}", path, e);
      throw new RuntimeException(e);
    }
  }

  @Override
  public void deleteAll() {
    log.info("deleteAll() called - not yet implemented");
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'deleteAll'");
  }

}
