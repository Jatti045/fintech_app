package com.fintechapp.fintech_api.dto.goal;

import java.time.Instant;

public record GoalItemResponse(
        String id,
        String userId,
        String name,
        double target,
        double progress,
        double remaining,
        boolean achieved,
        String icon,
        Instant createdAt,
        Instant updatedAt) {
}
