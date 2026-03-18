package com.fintechapp.fintech_api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = "app.jwt.secret-key=test-secret-key-test-secret-key-1234567890")
class FintechApiApplicationTests {

	@Test
	void contextLoads() {
	}

}
