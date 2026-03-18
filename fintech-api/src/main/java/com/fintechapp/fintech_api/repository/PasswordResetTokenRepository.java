package com.fintechapp.fintech_api.repository;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fintechapp.fintech_api.model.PasswordResetToken;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, String> {

    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findFirstByUser_IdOrderByCreatedAtDesc(String userId);

    void deleteByExpiresAtBefore(Instant instant);

    long deleteByUser_Id(String userId);
}

