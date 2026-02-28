package com.example.secure_drop.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.secure_drop.dto.auth.AuthRequest;
import com.example.secure_drop.dto.auth.AuthResponse;
import com.example.secure_drop.dto.auth.OtpRequest;
import com.example.secure_drop.dto.auth.SignupRequestDto;

@RestController
@RequestMapping("/auth")
public class AuthController {
  @PostMapping("/signup")
  ResponseEntity<AuthResponse> signup(@RequestBody SignupRequestDto request) {
    return null;
  }

  @PostMapping("/login")
  ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request) {
    return null;
  }

  @PostMapping("/passwordless/init")
  ResponseEntity<Void> initPasswordless(@RequestBody OtpRequest request) {
    return null;
  }

  @GetMapping("/passkey/register/options")
  ResponseEntity<String> getPasskeyRegistrationOptions(@RequestParam String email) {
    return null;
  }

  @PostMapping("/passkey/register/verify")
  ResponseEntity<Void> verifyPasskeyRegistration(@RequestBody String webAuthnResponse) {
    return null;
  }

  @PostMapping("/refresh")
  ResponseEntity<AuthResponse> refreshToken(@RequestParam String refreshToken) {
    return null;
  }

  @PostMapping("/logout")
  ResponseEntity<Void> logout() {
    return null;
  }
}
