package com.fintechapp.fintech_api.dto.goal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

public record UpdateGoalRequest(
                @Size(max = 100, message = "Goal name is too long") String name,
                @DecimalMin(value = "0.01", inclusive = true, message = "Target must be greater than 0") Double target,
                @Size(max = 64, message = "Icon value is too long") String icon) {
}
