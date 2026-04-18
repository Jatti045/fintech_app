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
);

CREATE INDEX IF NOT EXISTS idx_user_monthly_incomes_user_month
    ON user_monthly_incomes(user_id, month_start);

