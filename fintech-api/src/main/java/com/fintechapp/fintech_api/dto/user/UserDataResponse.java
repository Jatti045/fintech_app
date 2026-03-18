package com.fintechapp.fintech_api.dto.user;

public record UserDataResponse(boolean success, String message, UserSummaryResponse data) {
}


