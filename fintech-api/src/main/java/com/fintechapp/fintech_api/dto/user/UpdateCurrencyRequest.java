package com.fintechapp.fintech_api.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UpdateCurrencyRequest(
                @NotBlank(message = "Currency is required") @Pattern(regexp = "^[A-Za-z]{3}$", message = "Currency must be a 3-letter ISO code") String currency) {
}
