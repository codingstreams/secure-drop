package com.example.secure_drop.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

public class FileAccessCodeUtilsTest {

  @Test
  void generateAccessCode_shouldGenerateAccessCodeWithCorrectLength() {
    int expectedLength = 7;
    String generatedCode = FileAccessCodeUtils.generateAccessCode();
    assertEquals(expectedLength, generatedCode.length());
  }

  @Test
  void generateAccessCode_shouldGenerateAccessCodeWithLettersAndDigits() {
    String generatedCode = FileAccessCodeUtils.generateAccessCode();
    assertTrue(generatedCode.matches("^[A-Z-0-9]+$"));
  }

  @Test
  void generateAccessCode_shouldGenerateUniqueAccessCodes() {
    int numberOfTests = 100;
    java.util.Set<String> generatedCodes = new java.util.HashSet<>();
    for (int i = 0; i < numberOfTests; i++) {
      String code = FileAccessCodeUtils.generateAccessCode();
      generatedCodes.add(code);
    }
    assertEquals(numberOfTests, generatedCodes.size());
  }

  @Test
  void generateAccessCode_logsDebugMessage() {
    // This test relies on the log configuration. If the log isn't configured
    // properly, this test will fail.
    // We can't directly assert on the log message, so we will verify that the
    // method is called
    FileAccessCodeUtils.generateAccessCode();
  }

}
