package com.example.secure_drop.exception;

public class DownloadLimitExceededException extends RuntimeException {
  public DownloadLimitExceededException(String accessCode) {
    super("Max downloads exhausted for access code: " + accessCode + ". File will be deleted shortly.");
  }
}
