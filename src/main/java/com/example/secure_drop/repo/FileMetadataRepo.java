package com.example.secure_drop.repo;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.secure_drop.model.FileMetadata;

public interface FileMetadataRepo extends JpaRepository<FileMetadata, Long> {

  boolean existsByAccessCode(String accessCode);

  Optional<FileMetadata> findByAccessCode(String accessCode);

  List<FileMetadata> findByMaxDownloadsEqualsOrExpiryDateBefore(Integer maxDownloads, Timestamp now);
}
