package com.example.secure_drop.service.filestorage;

import java.nio.file.Path;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
  void init();

  String store(MultipartFile file);

  Resource load(Path path);

  boolean delete(Path path);

  void deleteAll();
}
