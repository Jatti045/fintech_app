package com.fintechapp.fintech_api.dto.auth;

import com.fintechapp.fintech_api.dto.user.UserSummaryResponse;

public record LoginData(UserSummaryResponse user, String token) {
}


