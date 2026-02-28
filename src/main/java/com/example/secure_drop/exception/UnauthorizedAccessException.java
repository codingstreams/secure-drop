package com.example.secure_drop.exception;

public class UnauthorizedAccessException extends RuntimeException {

  public UnauthorizedAccessException(String string) {
    super(string);
  }

}
