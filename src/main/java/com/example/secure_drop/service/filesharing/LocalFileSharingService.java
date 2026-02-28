package com.example.secure_drop.service.filesharing;

import java.nio.file.Path;
import java.sql.Timestamp;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.secure_drop.config.AppConfigProperties;
import com.example.secure_drop.config.FileStorageProperties;
import com.example.secure_drop.dto.FileDownloadWrapper;
import com.example.secure_drop.dto.FileUploadResponse;
import com.example.secure_drop.exception.FileExpiredException;
import com.example.secure_drop.exception.MaxDownloadsExceededException;
import com.example.secure_drop.exception.RecordNotFoundException;
import com.example.secure_drop.model.FileMetadata;
import com.example.secure_drop.repo.FileMetadataRepo;
import com.example.secure_drop.service.fileexpiry.FileExpiryService;
import com.example.secure_drop.service.filestorage.FileStorageService;
import com.example.secure_drop.util.FileAccessCodeUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class LocalFileSharingService implements FileSharingService {
  private static final int MAX_DOWNLOADS = 1;
  private static final int DEFAULT_EXPIRY_DAYS = 1;
  private final FileStorageService fileStorageService;
  private final FileMetadataRepo fileMetadataRepo;
  private final FileStorageProperties fileStorageProperties;
  private final AppConfigProperties appConfigProperties;
  private final Clock clock;
  private final FileExpiryService fileExpiryService;

  @Override
  public FileUploadResponse uploadFile(MultipartFile file) {
    log.info("Starting upload processing for file: {}", file.getOriginalFilename());
    var originalFilename = file.getOriginalFilename();
    var fileType = file.getContentType();

    log.debug("Original filename={}, contentType={}", originalFilename, fileType);
    var fileName = fileStorageService.store(file);

    log.debug("Stored file with internal name {}", fileName);
    var storagePath = Path.of(fileStorageProperties.getUploadDir(), fileName).toString();
    var accessCode = generateUniqueAccessCode();

    log.debug("Generated access code {}", accessCode);
    var downloadUrl = getDownloadUrl(accessCode);
    var expiryDate = Timestamp.valueOf(LocalDateTime.now(clock).plusDays(DEFAULT_EXPIRY_DAYS));

    var fileMetadata = FileMetadata.builder()
        .fileName(originalFilename)
        .fileType(fileType)
        .expiryDate(expiryDate)
        .storagePath(storagePath)
        .accessCode(accessCode)
        .maxDownloads(MAX_DOWNLOADS)
        .build();

    var saved = fileMetadataRepo.save(fileMetadata);

    log.info("File metadata saved with id {}", saved.getId());

    return new FileUploadResponse(
        accessCode,
        originalFilename,
        saved.getExpiryDate().toLocalDateTime(),
        downloadUrl);
  }

  @Override
  public FileDownloadWrapper getFile(String accessCode) {
    log.info("Processing download request for access code {}", accessCode);
    var fileMetadata = getFileMetadata(accessCode);

    var filePath = Path.of(fileMetadata.getStoragePath());
    log.debug("Loading file from path {}", filePath);
    var resource = fileStorageService.load(filePath);
    log.debug("File loaded successfully");

    // Update maxDownloads
    var maxDownloads = fileMetadata.getMaxDownloads();
    fileMetadata.setMaxDownloads(maxDownloads - 1);
    fileMetadataRepo.save(fileMetadata);
    log.debug("Download count decremented from {} to {}", maxDownloads, maxDownloads - 1);

    log.info("Download completed for file: {} (access code: {})", fileMetadata.getFileName(), accessCode);
    return new FileDownloadWrapper(
        resource,
        fileMetadata.getFileType(),
        fileMetadata.getFileName());
  }

  @Override
  public FileUploadResponse getFileInfo(String accessCode) {
    log.info("Retrieving file info for access code {}", accessCode);
    var fileMetadata = getFileMetadata(accessCode);
    var originalFilename = fileMetadata.getFileName();
    log.debug("File info - filename={}, expiry date={}", originalFilename, fileMetadata.getExpiryDate());
    var downloadUrl = getDownloadUrl(accessCode);

    log.info("File info retrieved successfully for {}", originalFilename);
    return new FileUploadResponse(
        accessCode,
        originalFilename,
        fileMetadata.getExpiryDate().toLocalDateTime(),
        downloadUrl);
  }

  public String generateUniqueAccessCode() {
    log.debug("Attempting to generate unique access code");
    int tryCount = 100;

    while (tryCount-- > 0) {
      String accessCode = FileAccessCodeUtils.generateAccessCode();
      if (!fileMetadataRepo.existsByAccessCode(accessCode)) {
        log.debug("Unique access code generated successfully: {}", accessCode);
        return accessCode;
      }
      log.debug("Access code collision detected, retrying (attempts remaining: {})", tryCount);
    }

    log.error("Failed to generate unique access code after 100 attempts");
    throw new IllegalStateException("Unable to generate unique access code after 100 attempts");
  }

  private FileMetadata getFileMetadata(String accessCode) {
    log.info("Retrieving file metadata for access code {}", accessCode);
    var fileMetadata = fileMetadataRepo.findByAccessCode(accessCode)
        .orElseThrow(() -> {
          log.warn("File not found for access code {}", accessCode);
          return new RecordNotFoundException(accessCode);
        });
    log.debug("File metadata found: id={}, filename={}", fileMetadata.getId(), fileMetadata.getFileName());

    var expiryDate = fileMetadata.getExpiryDate();
    if (fileExpiryService.isExpired(expiryDate)) {
      log.warn("File has expired for access code {}", accessCode);
      throw new FileExpiredException(accessCode);
    }
    log.debug("File not expired, expiry date: {}", expiryDate);

    if (fileMetadata.isConsumed()) {
      log.warn("File download limit exceeded for access code {}", accessCode);
      throw new MaxDownloadsExceededException(accessCode);
    }
    log.debug("File download limit not exceeded");
    return fileMetadata;
  }

  private String getDownloadUrl(String accessCode) {
    log.debug("Building download URL for access code {}", accessCode);

    var appBaseUrl = Optional.ofNullable(appConfigProperties.getBaseUrl())
        .orElse("");

    var url = UriComponentsBuilder.fromUriString(appBaseUrl)
        .path("/download/")
        .path(accessCode)
        .toUriString();

    log.debug("Download URL constructed: {}", url);

    return url;
  }

  @Override
  public List<FileUploadResponse> listAllFilesMetadata() {
    log.debug("Starting to fetch all files metadata");

    var filesMetadata = fileMetadataRepo.findAll();

    log.info("Fetched {} files metadata", filesMetadata.size());

    return filesMetadata.stream()
        .map(fileMetadata -> {
          var fileUploadResponse = new FileUploadResponse(fileMetadata.getAccessCode(),
              fileMetadata.getFileName(),
              fileMetadata.getExpiryDate().toLocalDateTime(), "");

          log.debug("Created FileUploadResponse for file: {}",
              fileMetadata.getFileName());

          return fileUploadResponse;
        })
        .toList();

  }

}
