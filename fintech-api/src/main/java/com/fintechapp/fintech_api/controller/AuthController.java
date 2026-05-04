package com.fintechapp.fintech_api.controller;
import com.fintechapp.fintech_api.dto.auth.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import com.fintechapp.fintech_api.dto.common.ApiMessageResponse;
import com.fintechapp.fintech_api.dto.user.UserDataResponse;
import com.fintechapp.fintech_api.service.AuthService;
import com.fintechapp.fintech_api.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;
	private final UserService userService;

	public AuthController(AuthService authService, UserService userService) {
		this.authService = authService;
		this.userService = userService;
	}

	@PostMapping("/google")
	public GoogleAuthResponse googleAuth(@RequestBody GoogleAuthRequest request) throws Exception {
		return authService.googleAuth(request);
	}

	@PostMapping({ "/register", "/signup" })
	@ResponseStatus(HttpStatus.CREATED)
	public UserDataResponse signup(@Valid @RequestBody SignupRequest request) {
		return authService.signup(request);
	}

	@PostMapping("/login")
	public LoginResponse login(@Valid @RequestBody LoginRequest request) {
		return authService.login(request);
	}

	@PostMapping("/forgot-password")
	public ApiMessageResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
		return authService.forgotPassword(request.email());
	}

	@PostMapping("/reset-password")
	public ApiMessageResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
		return authService.resetPassword(request);
	}

	@GetMapping("/me")
	public UserDataResponse getCurrentUser(@AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
		return userService.getCurrentUser(authenticatedUser);
	}
}
