package com.fintechapp.fintech_api.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSchemaAutoPatch implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSchemaAutoPatch.class);

    private final JdbcTemplate jdbcTemplate;

    public DatabaseSchemaAutoPatch(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        // Safety patch for existing databases that predate monthly income support.
        // Keeps startup backward-compatible even when schema migrations were not
        // applied.
        jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_income DOUBLE PRECISION");
        jdbcTemplate.execute("UPDATE users SET monthly_income = 0 WHERE monthly_income IS NULL");
        jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN monthly_income SET DEFAULT 0");
        jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN monthly_income SET NOT NULL");

        logger.info("Database schema patch check completed for users.monthly_income");
    }
}
