package com.example.secure_drop.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.jspecify.annotations.NonNull;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.secure_drop.dto.FileUploadResponse;
import com.example.secure_drop.service.filesharing.FileSharingService;
import com.example.secure_drop.service.filesharing.model.CustomMultipartFile;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Slf4j
public class FileSharingController {
  private final FileSharingService fileSharingService;

  @PostMapping("/upload")
  public ResponseEntity<@NonNull FileUploadResponse> uploadFile(@RequestParam MultipartFile file) {
    log.info("Received upload request for file: {}", file.getOriginalFilename());
    var uploadedMultipartFile = new CustomMultipartFile(file);
    var response = fileSharingService.uploadFile(uploadedMultipartFile);
    log.info("Upload completed for file: {} with access code {}", file.getOriginalFilename(), response.accessCode());
    return ResponseEntity.ok(response);
  }

  @GetMapping("/download/{accessCode}")
  public ResponseEntity<@NonNull Resource> downloadFile(@PathVariable String accessCode) {
    log.info("Download request received for access code {}", accessCode);
    var wrapper = fileSharingService.getFile(accessCode);
    log.info("File retrieved: {} (type={})", wrapper.originalFileName(), wrapper.contentType());

    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + wrapper.originalFileName() + "\"")
        .contentType(MediaType.parseMediaType(wrapper.contentType()))
        .body(wrapper.resource());
  }

  @GetMapping("/")
  public ResponseEntity<List<FileUploadResponse>> getAllFilesMetadata() {
    log.debug("Received request to fetch all files metadata");

    var filesMetadata = fileSharingService.listAllFilesMetadata();

    log.info("Fetched {} files metadata", filesMetadata.size());

    return ResponseEntity.ok(filesMetadata);
  }

  @GetMapping("/{accessCode}/info")
  public ResponseEntity<@NonNull FileUploadResponse> getFileInfo(@PathVariable String accessCode) {
    log.info("Info request for access code {}", accessCode);
    var info = fileSharingService.getFileInfo(accessCode);
    log.debug("Info retrieved: {}", info);
    return ResponseEntity.ok(info);
  }
}