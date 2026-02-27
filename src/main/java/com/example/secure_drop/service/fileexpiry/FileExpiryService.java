package com.example.secure_drop.service.fileexpiry;

import java.sql.Timestamp;

public interface FileExpiryService {
  boolean isExpired(Timestamp expiryTime);
}
