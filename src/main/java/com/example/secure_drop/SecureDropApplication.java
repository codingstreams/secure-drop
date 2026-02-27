package com.example.secure_drop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SecureDropApplication {

	public static void main(String[] args) {
		SpringApplication.run(SecureDropApplication.class, args);
	}

}
