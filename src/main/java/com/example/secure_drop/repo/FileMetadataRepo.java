package com.example.secure_drop.repo;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.secure_drop.model.FileMetadata;

public interface FileMetadataRepo extends JpaRepository<FileMetadata, Long> {

  boolean existsByAccessCode(String accessCode);

  Optional<FileMetadata> findByAccessCode(String accessCode);

  List<FileMetadata> findByMaxDownloadsEqualsOrExpiresAtBefore(Integer maxDownloads, Instant now);

  Page<FileMetadata> findAllByOwnerId(String ownerId, Pageable pageable);
}
