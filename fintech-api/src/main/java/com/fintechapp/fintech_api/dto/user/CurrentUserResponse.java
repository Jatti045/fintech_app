package com.fintechapp.fintech_api.dto.user;

import com.fintechapp.fintech_api.dto.auth.AuthenticatedUser;

public record CurrentUserResponse(boolean success, AuthenticatedUser user) {
}


