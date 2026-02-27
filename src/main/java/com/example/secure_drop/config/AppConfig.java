package com.example.secure_drop.config;

import java.time.Clock;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({ FileStorageProperties.class, EncryptionProperties.class, AppConfigProperties.class,
    ErrorDocsProperties.class })
public class AppConfig {
  @Bean
  Clock clock() {
    return Clock.systemDefaultZone();
  }
}
