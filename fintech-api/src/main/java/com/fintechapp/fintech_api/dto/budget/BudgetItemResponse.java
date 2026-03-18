package com.fintechapp.fintech_api.dto.budget;

import java.time.Instant;

public record BudgetItemResponse(
        String id,
        String userId,
        Instant date,
        String category,
        double limit,
        double spent,
        String icon,
        Instant createdAt,
        Instant updatedAt
) {
}


