package com.fintechapp.fintech_api.dto.user;

import java.time.Instant;

public record ProfilePictureUserResponse(
        String id,
        String username,
        String email,
        String profilePic,
        Instant createdAt,
        Instant updatedAt
) {
}


