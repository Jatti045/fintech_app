package com.fintechapp.fintech_api.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank(message = "Email is required") @Email(message = "Email must be valid") String email,

        @NotBlank(message = "OTP is required") @Size(min = 4, max = 12, message = "OTP length is invalid") String otp,

        @Size(max = 128, message = "New password is too long") String newPassword,

        @Size(max = 128, message = "Confirm password is too long") String confirmPassword,
        Boolean verifyOnly) {
    public boolean isVerifyOnly() {
        return Boolean.TRUE.equals(verifyOnly);
    }
}
