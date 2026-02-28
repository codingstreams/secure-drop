package com.example.secure_drop.service.filestorage;

import java.nio.file.Path;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

  void init();

  String store(MultipartFile file, String accessCode);

  Resource load(String storagePath);

  boolean delete(String storagePath);

  Path getRootPath();

  public void deleteAll();
}
