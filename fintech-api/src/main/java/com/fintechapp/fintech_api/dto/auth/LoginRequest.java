package com.fintechapp.fintech_api.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
                @NotBlank(message = "Email is required") @Email(message = "Email must be valid") String email,

                @NotBlank(message = "Password is required") @Size(min = 6, max = 128, message = "Password must be between 6 and 128 characters") String password) {
}
