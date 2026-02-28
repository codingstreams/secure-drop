package com.example.secure_drop.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.secure_drop.model.FileMetadata;
import com.example.secure_drop.repo.FileMetadataRepo;
import com.example.secure_drop.service.filestorage.FileStorageService;

import java.sql.Timestamp;
import java.time.Clock;
import java.time.LocalDateTime;

@Component
@Slf4j
@RequiredArgsConstructor
public class FileCleanupScheduler {
  private final FileMetadataRepo fileMetadataRepo;
  private final FileStorageService fileStorageService;
  private final Clock clock;

  @Scheduled(fixedDelay = 3600000)
  public void cleanupConsumedOrExpiredFiles() {
    var expiredOrConsumedFiles = fileMetadataRepo
        .findByMaxDownloadsEqualsOrExpiresAtBefore(0, clock.instant());

    if (expiredOrConsumedFiles.isEmpty()) {
      log.debug("No consumed or expired files found for cleanup.");
      return;
    }

    for (FileMetadata file : expiredOrConsumedFiles) {
      var filePath = file.getStoragePath();
      try {
        boolean deleted = fileStorageService.delete(filePath);

        if (deleted) {
          log.info("Deleted file '{}' at path {}", file.getFileName(), filePath);
        } else {
          log.warn("File '{}' not found at path {}", file.getFileName(), filePath);
        }

        fileMetadataRepo.delete(file);
        log.debug("Deleted metadata record for file '{}'", file.getFileName());

      } catch (Exception e) {
        log.error("Failed to delete file '{}' at path {}", file.getFileName(), filePath, e);
      }
    }
  }
}
