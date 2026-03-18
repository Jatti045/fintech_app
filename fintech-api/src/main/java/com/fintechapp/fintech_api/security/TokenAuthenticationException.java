package com.fintechapp.fintech_api.security;

import org.springframework.http.HttpStatus;

public class TokenAuthenticationException extends RuntimeException {

	private final HttpStatus status;

	public TokenAuthenticationException(HttpStatus status, String message) {
		super(message);
		this.status = status;
	}

	public TokenAuthenticationException(HttpStatus status, String message, Throwable cause) {
		super(message, cause);
		this.status = status;
	}

	public HttpStatus getStatus() {
		return status;
	}
}

