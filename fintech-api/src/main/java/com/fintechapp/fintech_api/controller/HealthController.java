package com.fintechapp.fintech_api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fintechapp.fintech_api.dto.common.ApiMessageResponse;

@RestController
@RequestMapping("/api/health")
public class HealthController {

	@GetMapping
	public ApiMessageResponse getHealth() {
		return new ApiMessageResponse(true, "API is healthy.");
	}
}

