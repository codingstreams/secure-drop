package com.example.secure_drop.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.secure_drop.config.ErrorDocsProperties;

import java.net.URI;
import java.time.Instant;

@ControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class GlobalExceptionHandler {
  private final ErrorDocsProperties errorDocsProperties;

  @ExceptionHandler(Exception.class)
  public ResponseEntity<@NonNull ProblemDetail> exceptionHandler(Exception e, HttpServletRequest request) {
    log.error("Unhandled exception occurred", e);
    ProblemDetail problemDetail = buildProblemDetail(HttpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error",
        "Something went wrong. Please try again.",
        "internal-server-error",
        request);
    problemDetail.setProperty("exception", e.getClass().getSimpleName());
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(problemDetail);
  }

  @ExceptionHandler(InvalidMultipartFileException.class)
  public ResponseEntity<@NonNull ProblemDetail> handleInvalidMultipartFile(InvalidMultipartFileException ex,
      HttpServletRequest request) {
    log.warn("Invalid multipart file: {}", ex.getMessage());
    ProblemDetail problem = buildProblemDetail(HttpStatus.BAD_REQUEST,
        "Invalid Multipart File",
        ex.getMessage(),
        "invalid-multipart-file",
        request);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problem);
  }

  @ExceptionHandler(MaxDownloadsExceededException.class)
  public ResponseEntity<@NonNull ProblemDetail> handleMaxDownloads(MaxDownloadsExceededException ex,
      HttpServletRequest request) {
    log.warn("Max downloads exceeded: {}", ex.getMessage());
    ProblemDetail problem = buildProblemDetail(HttpStatus.TOO_MANY_REQUESTS,
        "Max downloads exceeded",
        ex.getMessage(),
        "max-downloads",
        request);
    return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(problem);
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<@NonNull ProblemDetail> handleResourceNotFound(ResourceNotFoundException ex,
      HttpServletRequest request) {
    log.warn("Resource not found: {}", ex.getMessage());
    ProblemDetail problem = buildProblemDetail(HttpStatus.NOT_FOUND,
        "File not found",
        ex.getMessage(),
        "file-not-found",
        request);
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problem);
  }

  @ExceptionHandler(RecordNotFoundException.class)
  public ResponseEntity<@NonNull ProblemDetail> handleRecordNotFound(RecordNotFoundException ex,
      HttpServletRequest request) {
    log.warn("Record not found: {}", ex.getMessage());
    ProblemDetail problem = buildProblemDetail(HttpStatus.NOT_FOUND,
        "Record not found",
        ex.getMessage(),
        "record-not-found",
        request);
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problem);
  }

  @ExceptionHandler(FileExpiredException.class)
  public ResponseEntity<@NonNull ProblemDetail> handleFileExpired(FileExpiredException ex,
      HttpServletRequest request) {
    log.warn("File expired: {}", ex.getMessage());
    ProblemDetail problem = buildProblemDetail(HttpStatus.GONE,
        "File expired",
        ex.getMessage(),
        "file-expired",
        request);
    return ResponseEntity.status(HttpStatus.GONE).body(problem);
  }

  private ProblemDetail buildProblemDetail(HttpStatus status, String title, String detail,
      String errorPath, HttpServletRequest request) {
    ProblemDetail problem = ProblemDetail.forStatus(status);
    problem.setTitle(title);
    problem.setDetail(detail);
    problem.setType(getUri(errorPath));
    problem.setProperty("instance", request.getRequestURI());
    problem.setProperty("timestamp", Instant.now());
    return problem;
  }

  private URI getUri(String path) {
    return UriComponentsBuilder
        .fromUriString(errorDocsProperties.getUrl())
        .pathSegment(path)
        .build()
        .toUri();
  }

}
