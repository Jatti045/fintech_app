package com.fintechapp.fintech_api.dto.budget;

public record BudgetDataResponse(boolean success, String message, BudgetItemResponse data) {
}


