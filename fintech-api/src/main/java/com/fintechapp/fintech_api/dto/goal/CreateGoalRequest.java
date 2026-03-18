package com.fintechapp.fintech_api.dto.goal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateGoalRequest(
                @NotBlank(message = "Goal name is required") @Size(max = 100, message = "Goal name is too long") String name,

                @NotNull(message = "Target is required") @DecimalMin(value = "0.01", inclusive = true, message = "Target must be greater than 0") Double target,
                @Size(max = 64, message = "Icon value is too long") String icon) {
}
