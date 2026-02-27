package com.example.secure_drop.exception;

public class MaxDownloadsExceededException extends RuntimeException {
  public MaxDownloadsExceededException(String accessCode) {
    super("Max downloads exhausted for access code: " + accessCode + ". File will be deleted shortly.");
  }
}
