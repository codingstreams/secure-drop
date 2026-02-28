package com.example.secure_drop.service.filestorage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.Optional;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.example.secure_drop.config.FileStorageProperties;
import com.example.secure_drop.exception.ResourceNotFoundException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class LocalFileStorageService implements FileStorageService {
  private final FileStorageProperties fileStorageProperties;

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
  public void deleteAll() {
    log.warn("DELETING ALL FILES in root storage: {}", fileStorageProperties.getUploadDir());
    try {
      // Recursively delete everything in the 'uploads' folder
      FileSystemUtils.deleteRecursively(getRootPath());

      // Re-initialize the directory so it's ready for new uploads
      this.init();
      log.info("Storage re-initialized successfully.");
    } catch (IOException e) {
      log.error("Failed to delete all files: {}", e.getMessage());
      throw new RuntimeException("Could not delete storage contents", e);
    }
  }

  @Override
  public String store(MultipartFile file, String accessCode) {
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

      String physicalFilename = accessCode + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

      log.debug("Generated unique filename: {}", physicalFilename);

      var destination = getRootPath()
          .resolve(Paths.get(physicalFilename))
          .normalize()
          .toAbsolutePath();

      Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

      log.info("File successfully stored at: {}", destination.toAbsolutePath());
      return destination.toString();
    } catch (IOException e) {
      log.error("Failed to store file: {}", filePath, e);
      throw new RuntimeException("File storage failed.", e);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public Resource load(String storagePath) {
    log.info("Loading file from {}", storagePath);
    var resource = new FileSystemResource(storagePath);

    if (!resource.exists()) {
      log.warn("Requested file does not exist: {}", storagePath);
      throw new ResourceNotFoundException(storagePath);
    }

    return resource;
  }

  @Override
  public boolean delete(String storagePath) {
    log.info("Attempting to delete file at {}", storagePath);
    try {
      boolean deleted = Files.deleteIfExists(Path.of(storagePath));
      if (deleted) {
        log.info("Successfully deleted file at {}", storagePath);
      } else {
        log.warn("File not found, nothing deleted at {}", storagePath);
      }
      return deleted;
    } catch (IOException e) {
      log.error("Failed to delete file at {}", storagePath, e);
      throw new RuntimeException(e);
    }
  }

  @Override
  public Path getRootPath() {
    return Path.of(fileStorageProperties.getUploadDir());
  }

}
