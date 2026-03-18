package com.fintechapp.fintech_api.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(
                @NotBlank(message = "Username is required") @Size(min = 2, max = 50, message = "Username must be between 2 and 50 characters") String username,

                @NotBlank(message = "Email is required") @Email(message = "Email must be valid") String email,

                @NotBlank(message = "Password is required") @Size(min = 6, max = 128, message = "Password must be between 6 and 128 characters") String password,

                @NotBlank(message = "Confirm password is required") @Size(min = 6, max = 128, message = "Confirm password must be between 6 and 128 characters") String confirmPassword) {
}
