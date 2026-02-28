package com.example.secure_drop.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.secure_drop.dto.file.FileResponseDto;
import com.example.secure_drop.dto.file.UpdateFileSettingsDto;
import com.example.secure_drop.service.filesharing.FileSharingService;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = { "http://localhost:5173" })
public class UserFileController {

  private final FileSharingService fileSharingService;

  @PostMapping(value = "/upload", consumes = "multipart/form-data")
  public ResponseEntity<FileResponseDto> uploadToVault(
      @RequestParam MultipartFile file,
      @RequestParam int maxDownloads,
      @RequestParam int hours) {

    var ownerId = getCurrentUserId();
    log.info("User {} is uploading file: {} (Expiry: {}h, Max Downloads: {})",
        ownerId, file.getOriginalFilename(), hours, maxDownloads);

    var response = fileSharingService.uploadFile(file, ownerId, hours, maxDownloads);

    log.info("File uploaded successfully. Access Code: {}", response.getAccessCode());
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @PatchMapping("/{accessCode}/settings")
  public ResponseEntity<FileResponseDto> updateSettings(
      @PathVariable String accessCode,
      @RequestBody UpdateFileSettingsDto settings) {

    var ownerId = getCurrentUserId();
    log.info("User {} requesting settings update for file: {}", ownerId, accessCode);

    var updated = fileSharingService.updateFileSettings(accessCode, ownerId, settings);

    log.info("Settings updated for file: {}", accessCode);
    return ResponseEntity.ok(updated);
  }

  @PostMapping("/{accessCode}/publish")
  public ResponseEntity<FileResponseDto> moveToPublicPool(@PathVariable String accessCode) {
    var ownerId = getCurrentUserId();
    log.warn("User {} is moving file {} to the public pool", ownerId, accessCode);

    var response = fileSharingService.publishToPublicPool(accessCode, ownerId);

    log.info("File {} is now public.", accessCode);
    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{accessCode}")
  public ResponseEntity<Void> deleteFile(@PathVariable String accessCode) {
    var ownerId = getCurrentUserId();
    log.info("User {} requested deletion of file: {}", ownerId, accessCode);

    fileSharingService.deleteFile(accessCode, ownerId);

    log.info("File {} deleted successfully.", accessCode);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/")
  public ResponseEntity<Page<FileResponseDto>> listAllFiles(@ParameterObject Pageable pageable) {
    String ownerId = getCurrentUserId();
    log.debug("Fetching file list for user: {} (Page: {}, Size: {})",
        ownerId, pageable.getPageNumber(), pageable.getPageSize());

    Page<FileResponseDto> files = fileSharingService.listUserFiles(ownerId, pageable);
    return ResponseEntity.ok(files);
  }

  private String getCurrentUserId() {
    // Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    // if (auth == null || !auth.isAuthenticated()) {
    // throw new UnauthorizedAccessException("User must be authenticated.");
    // }
    // return auth.getName();

    return "ADMIN";
  }
}