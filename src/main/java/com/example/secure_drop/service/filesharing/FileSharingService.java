package com.example.secure_drop.service.filesharing;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.example.secure_drop.dto.file.FileResponseDto;
import com.example.secure_drop.dto.file.UpdateFileSettingsDto;

public interface FileSharingService {

  FileResponseDto uploadFile(MultipartFile file, String ownerId, int hours, int maxDownloads);

  FileResponseDto getFileMetadata(String accessCode);

  Resource downloadFile(String accessCode);

  Page<FileResponseDto> listUserFiles(String ownerId, Pageable pageable);

  FileResponseDto updateFileSettings(String accessCode, String ownerId, UpdateFileSettingsDto settings);

  FileResponseDto publishToPublicPool(String accessCode, String ownerId);

  void deleteFile(String accessCode, String ownerId);
}
