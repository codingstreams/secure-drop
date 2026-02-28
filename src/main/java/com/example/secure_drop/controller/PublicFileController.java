package com.example.secure_drop.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.secure_drop.dto.file.FileResponseDto;
import com.example.secure_drop.service.filesharing.FileSharingService;

@RestController
@RequestMapping("/public/files")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = { "http://localhost:5173" })
public class PublicFileController {

  private final FileSharingService fileSharingService;

  @PostMapping(value = "/upload", consumes = "multipart/form-data")
  public ResponseEntity<FileResponseDto> uploadAnonymous(
      @RequestParam MultipartFile file,
      @RequestParam(defaultValue = "24") int hours) {

    log.debug("Received upload request for file: {}",
        file.getOriginalFilename());

    var response = fileSharingService.uploadFile(file, null,
        hours, 0);
    log.info("File uploaded successfully: {}",
        response.getAccessCode());
    return ResponseEntity.status(HttpStatus.CREATED).body(response);

  }

  @GetMapping("/{accessCode}/download")
  public ResponseEntity<Resource> downloadFile(@PathVariable String accessCode) {
    log.debug("Received download request for access code: {}",
        accessCode);

    var resource = fileSharingService.downloadFile(accessCode);
    var metadata = fileSharingService.getFileMetadata(accessCode);
    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(metadata.getMimeType()))
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=\"" + metadata.getFileName() + "\"")
        .body(resource);

  }

  @GetMapping("/{accessCode}/meta")
  public ResponseEntity<FileResponseDto> getFileMetadata(@PathVariable String accessCode) {
    log.debug("Received metadata request for access code: {}",
        accessCode);
    FileResponseDto metadata = fileSharingService.getFileMetadata(accessCode);
    return ResponseEntity.ok(metadata);
  }
}
