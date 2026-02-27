package com.example.secure_drop.dto;

import org.springframework.core.io.Resource;

public record FileDownloadWrapper(
        Resource resource,
        String contentType,
        String originalFileName) {
}