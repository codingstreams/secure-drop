package com.example.secure_drop.service.encryption;

import java.nio.ByteBuffer;
import java.security.SecureRandom;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Service;

import com.example.secure_drop.config.EncryptionProperties;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EncryptionServiceImpl implements EncryptionService {

  private final EncryptionProperties encryptionProperties;

  private static final int TAG_LENGTH_BIT = 128;
  private static final int IV_LENGTH_BYTE = 12;

  @Override
  public byte[] encrypt(byte[] pText, String secretKey) throws Exception {
    log.debug("Starting encryption for {} bytes", pText.length);
    // 1. Generate a random IV (Unique for every file)
    byte[] iv = new byte[IV_LENGTH_BYTE];
    new SecureRandom().nextBytes(iv);

    // 2. Initialize Cipher
    Cipher cipher = Cipher.getInstance(encryptionProperties.getAlgorithm());
    SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(), "AES");
    GCMParameterSpec gcmSpec = new GCMParameterSpec(TAG_LENGTH_BIT, iv);
    cipher.init(Cipher.ENCRYPT_MODE, keySpec, gcmSpec);

    // 3. Encrypt data
    byte[] cipherText = cipher.doFinal(pText);

    // 4. Combine IV and CipherText (so we can find the IV during decryption)
    byte[] result = ByteBuffer.allocate(iv.length + cipherText.length)
        .put(iv)
        .put(cipherText)
        .array();

    log.debug("Encryption completed, output size: {} bytes", result.length);
    return result;
  }

  @Override
  public byte[] decrypt(byte[] encryptedDataWithIv, String secretKey) throws Exception {
    log.debug("Starting decryption for {} bytes", encryptedDataWithIv.length);
    // 1. Extract the IV (first 12 bytes)
    ByteBuffer bb = ByteBuffer.wrap(encryptedDataWithIv);
    byte[] iv = new byte[IV_LENGTH_BYTE];
    bb.get(iv);

    // 2. Extract the actual encrypted data
    byte[] cipherText = new byte[bb.remaining()];
    bb.get(cipherText);

    // 3. Initialize Cipher for Decryption
    Cipher cipher = Cipher.getInstance(encryptionProperties.getAlgorithm());
    SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(), "AES");
    GCMParameterSpec gcmSpec = new GCMParameterSpec(TAG_LENGTH_BIT, iv);
    cipher.init(Cipher.DECRYPT_MODE, keySpec, gcmSpec);

    // 4. Decrypt
    byte[] result = cipher.doFinal(cipherText);
    log.debug("Decryption completed, output size: {} bytes", result.length);
    return result;
  }

}
