package com.example.secure_drop.util;

import java.security.SecureRandom;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FileAccessCodeUtils {
  private static final String LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private static final String DIGITS = "0123456789";
  private static final SecureRandom RANDOM = new SecureRandom();

  private FileAccessCodeUtils() {
    throw new UnsupportedOperationException("Utility class");
  }

  public static String generateAccessCode() {
    var sb = new StringBuilder(7); // 3 letters + dash + 3 digits

    // Generate 3 random letters
    for (int i = 0; i < 3; i++) {
      sb.append(LETTERS.charAt(RANDOM.nextInt(LETTERS.length())));
    }

    // Add dash
    sb.append('-');

    // Generate 3 random digits
    for (int i = 0; i < 3; i++) {
      sb.append(DIGITS.charAt(RANDOM.nextInt(DIGITS.length())));
    }

    var accessCode = sb.toString();
    log.debug("Generated access code: {}", accessCode);

    return accessCode;
  }

}
