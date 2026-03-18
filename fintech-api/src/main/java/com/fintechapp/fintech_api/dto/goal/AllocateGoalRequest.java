package com.fintechapp.fintech_api.dto.goal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record AllocateGoalRequest(
                @NotNull(message = "Amount is required") @DecimalMin(value = "0.01", inclusive = true, message = "Amount must be greater than 0") Double amount) {
}
