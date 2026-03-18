package com.fintechapp.fintech_api.dto.common;

import java.time.Instant;
import java.util.Map;

public record ApiErrorResponse(
        boolean success,
        String message,
        Map<String, String> fieldErrors,
        Instant timestamp) {
    public ApiErrorResponse(String message) {
        this(false, message, Map.of(), Instant.now());
    }

    public ApiErrorResponse(String message, Map<String, String> fieldErrors) {
        this(false, message, fieldErrors == null ? Map.of() : Map.copyOf(fieldErrors), Instant.now());
    }
}
