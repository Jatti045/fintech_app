package com.fintechapp.fintech_api.dto.goal;

public record GoalDataResponse(
        boolean success,
        String message,
        GoalItemResponse data) {
}
