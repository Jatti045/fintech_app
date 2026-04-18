package com.fintechapp.fintech_api.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.lang.NonNull;

@Component
@SuppressWarnings("SqlNoDataSourceInspection")
public class DatabaseSchemaAutoPatch implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSchemaAutoPatch.class);

    private final JdbcTemplate jdbcTemplate;

    public DatabaseSchemaAutoPatch(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(@NonNull ApplicationArguments args) {
        // Safety patch for month-scoped user income persistence.
        jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS user_monthly_incomes (
                    id VARCHAR(36) PRIMARY KEY,
                    user_id VARCHAR(36) NOT NULL,
                    month_start TIMESTAMP WITH TIME ZONE NOT NULL,
                    income DOUBLE PRECISION NOT NULL DEFAULT 0,
                    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                    CONSTRAINT fk_user_monthly_incomes_user
                        FOREIGN KEY (user_id) REFERENCES users(id),
                    CONSTRAINT uq_user_monthly_incomes_user_month
                        UNIQUE (user_id, month_start)
                )
                """);
        jdbcTemplate.execute("""
                CREATE INDEX IF NOT EXISTS idx_user_monthly_incomes_user_month
                ON user_monthly_incomes(user_id, month_start)
                """);

        logger.info("Database schema patch check completed for user_monthly_incomes");
    }
}
