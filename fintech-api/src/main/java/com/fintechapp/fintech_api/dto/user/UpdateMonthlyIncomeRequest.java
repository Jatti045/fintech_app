package com.fintechapp.fintech_api.dto.user;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record UpdateMonthlyIncomeRequest(
                @NotNull(message = "Monthly income is required") @DecimalMin(value = "0.0", inclusive = true, message = "Monthly income cannot be negative") Double monthlyIncome) {
}
