package com.fintechapp.fintech_api.dto.goal;

import java.util.List;

public record GoalsResponse(
        boolean success,
        String message,
        List<GoalItemResponse> data) {
}
