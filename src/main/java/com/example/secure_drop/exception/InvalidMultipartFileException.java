package com.example.secure_drop.exception;

public class InvalidMultipartFileException extends RuntimeException {
  public InvalidMultipartFileException(String message) {
    super(message);
  }
}
