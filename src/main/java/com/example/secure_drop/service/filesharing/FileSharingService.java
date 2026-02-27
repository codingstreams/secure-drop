package com.example.secure_drop.service.filesharing;

import org.springframework.web.multipart.MultipartFile;

import com.example.secure_drop.dto.FileDownloadWrapper;
import com.example.secure_drop.dto.FileUploadResponse;

public interface FileSharingService {

  FileUploadResponse uploadFile(MultipartFile file);

  FileDownloadWrapper getFile(String accessCode);

  FileUploadResponse getFileInfo(String accessCode);

}
