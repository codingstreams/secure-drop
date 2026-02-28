package com.example.secure_drop.service.filestorage;

import static org.mockito.Mockito.when;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;
import com.example.secure_drop.config.FileStorageProperties;
import com.example.secure_drop.exception.ResourceNotFoundException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@ExtendWith(MockitoExtension.class)
class LocalFileStorageServiceTest {

  @Mock
  private FileStorageProperties fileStorageProperties;

  @InjectMocks
  private LocalFileStorageService fileStorageService;

  @TempDir
  Path tempDir; // JUnit 5 automatically creates and cleans this up

  @BeforeEach
  void setUp() {
    // Mock the property to return our temporary directory path
    when(fileStorageProperties.getUploadDir()).thenReturn(tempDir.toString());
    // Initialize the service (manual call since we aren't using a full Spring
    // context)
    fileStorageService.init();
  }

  @Test
  void init_ShouldCreateDirectory_WhenValidPathProvided() {
    assertThat(Files.exists(tempDir)).isTrue();
  }

  @Test
  void store_ShouldSaveFile_WhenFileIsValid() throws IOException {
    // Arrange
    String content = "Hello, World!";
    String originalName = "test.txt";
    String accessCode = "USER123";
    MockMultipartFile mockFile = new MockMultipartFile(
        "file", originalName, "text/plain", content.getBytes());

    // Act
    String storedPathString = fileStorageService.store(mockFile, accessCode);
    Path storedPath = Path.of(storedPathString);

    // Assert
    assertThat(Files.exists(storedPath)).isTrue();
    assertThat(Files.readString(storedPath)).isEqualTo(content);
    assertThat(storedPath.getFileName().toString())
        .contains(accessCode)
        .contains(originalName);
  }

  @Test
  void store_ShouldThrowException_WhenFileContainsInvalidPath() {
    MockMultipartFile mockFile = new MockMultipartFile(
        "file", "../malicious.txt", "text/plain", "data".getBytes());

    assertThatThrownBy(() -> fileStorageService.store(mockFile, "ABC"))
        .isInstanceOf(RuntimeException.class)
        .hasMessageContaining("Invalid file path");
  }

  @Test
  void store_ShouldThrowException_WhenFileIsEmpty() {
    MockMultipartFile mockFile = new MockMultipartFile(
        "file", "empty.txt", "text/plain", new byte[0]);

    assertThatThrownBy(() -> fileStorageService.store(mockFile, "ABC"))
        .isInstanceOf(RuntimeException.class)
        .hasMessageContaining("Cannot store empty file");
  }

  @Test
  void load_ShouldReturnResource_WhenFileExists() throws IOException {
    // Arrange: Create a dummy file manually in tempDir
    Path filePath = tempDir.resolve("load_test.txt");
    Files.writeString(filePath, "test content");

    // Act
    Resource resource = fileStorageService.load(filePath.toString());

    // Assert
    assertThat(resource.exists()).isTrue();
    assertThat(resource.getFilename()).isEqualTo("load_test.txt");
  }

  @Test
  void load_ShouldThrowException_WhenFileDoesNotExist() {
    String nonExistentPath = tempDir.resolve("ghost.txt").toString();

    assertThatThrownBy(() -> fileStorageService.load(nonExistentPath))
        .isInstanceOf(ResourceNotFoundException.class);
  }

  @Test
  void delete_ShouldReturnTrue_WhenFileExists() throws IOException {
    Path filePath = tempDir.resolve("delete_me.txt");
    Files.createFile(filePath);

    boolean result = fileStorageService.delete(filePath.toString());

    assertThat(result).isTrue();
    assertThat(Files.exists(filePath)).isFalse();
  }

  @Test
  void deleteAll_ShouldClearDirectory() throws IOException {
    // Arrange
    Files.createFile(tempDir.resolve("file1.txt"));
    Files.createFile(tempDir.resolve("file2.txt"));

    // Act
    fileStorageService.deleteAll();

    // Assert
    // deleteAll calls init(), so the directory should still exist but be empty
    try (var stream = Files.list(tempDir)) {
      assertThat(stream.count()).isZero();
    }
  }
}