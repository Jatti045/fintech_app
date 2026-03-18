package com.fintechapp.fintech_api.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

class JwtServiceTest {

	@Test
	void throwsServerConfigurationErrorWhenSecretIsMissing() {
		JwtService jwtService = new JwtService();

		TokenAuthenticationException exception = assertThrows(
				TokenAuthenticationException.class,
				() -> jwtService.authenticate("any-token")
		);

		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatus());
		assertEquals("Server configuration error.", exception.getMessage());
	}
}

