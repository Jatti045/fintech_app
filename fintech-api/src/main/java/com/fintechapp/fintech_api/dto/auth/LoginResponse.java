package com.fintechapp.fintech_api.dto.auth;

public record LoginResponse(boolean success, String message, LoginData data) {
}


