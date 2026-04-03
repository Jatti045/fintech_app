package com.fintechapp.fintech_api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fintechapp.fintech_api.dto.common.ApiMessageResponse;
import com.fintechapp.fintech_api.repository.UserRepository;

@RestController
@RequestMapping("/api/health")
public class HealthController {

	@Autowired
	private UserRepository userRepository;

	@GetMapping
	public ApiMessageResponse getHealth() {
		try {
			// Test database connectivity with a simple query
			userRepository.count();
			return new ApiMessageResponse(true, "API is healthy. Database connection is functional.");
		} catch (Exception e) {
			return new ApiMessageResponse(false, "API is running but database connection failed: " + e.getMessage());
		}
	}
}

