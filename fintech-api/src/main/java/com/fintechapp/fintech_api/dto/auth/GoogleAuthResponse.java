package com.fintechapp.fintech_api.dto.auth;

public record GoogleAuthResponse(boolean success, String message, LoginData data) {
}
