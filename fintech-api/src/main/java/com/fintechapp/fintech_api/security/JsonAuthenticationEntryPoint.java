package com.fintechapp.fintech_api.security;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import tools.jackson.databind.ObjectMapper;
import com.fintechapp.fintech_api.dto.common.ApiErrorResponse;

import jakarta.servlet.http.HttpServletResponse;

@Component
public class JsonAuthenticationEntryPoint {

	private final ObjectMapper objectMapper;

	public JsonAuthenticationEntryPoint(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	public void writeResponse(HttpServletResponse response, HttpStatus status, String message) throws IOException {
		response.setStatus(status.value());
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		objectMapper.writeValue(response.getWriter(), new ApiErrorResponse(message));
	}
}
