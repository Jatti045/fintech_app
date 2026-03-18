package com.fintechapp.fintech_api.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
                @NotBlank(message = "Current password is required") @Size(min = 6, max = 128, message = "Current password must be between 6 and 128 characters") String currentPassword,

                @NotBlank(message = "New password is required") @Size(min = 6, max = 128, message = "New password must be between 6 and 128 characters") String newPassword,

                @NotBlank(message = "Confirm password is required") @Size(min = 6, max = 128, message = "Confirm password must be between 6 and 128 characters") String confirmPassword) {
}
