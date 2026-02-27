package com.example.secure_drop.service.encryption;

public interface EncryptionService {
  byte[] encrypt(byte[] pText, String secretKey) throws Exception;

  byte[] decrypt(byte[] encryptedDataWithIv, String secretKey) throws Exception;
}
