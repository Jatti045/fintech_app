package com.fintechapp.fintech_api.dto.budget;

import java.util.List;

public record BudgetsResponse(boolean success, String message, List<BudgetItemResponse> data) {
}


