package com.example.secure_drop.dto;

import java.time.LocalDateTime;

public record FileUploadResponse(
        String accessCode,
        String fileName,
        LocalDateTime expiresAt,
        String downloadUrl) {
}