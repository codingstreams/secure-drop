package com.example.secure_drop.service.fileexpiry;

import java.sql.Timestamp;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LocalFileExpiryService implements FileExpiryService {
  private final Clock clock;

  @Override
  public boolean isExpired(Timestamp expiryTime) {
    var timestamp = Optional.ofNullable(expiryTime)
        .orElseThrow(() -> new RuntimeException("expiryTime is Null."));

    return LocalDateTime.now(clock).isAfter(timestamp.toLocalDateTime());
  }
}
