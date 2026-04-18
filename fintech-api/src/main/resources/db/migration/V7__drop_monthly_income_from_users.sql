DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
          AND column_name = 'monthly_income'
    ) THEN
        INSERT INTO user_monthly_incomes (id, user_id, month_start, income)
        SELECT
            SUBSTRING(MD5(RANDOM()::text || CLOCK_TIMESTAMP()::text), 1, 32),
            u.id,
            DATE_TRUNC('month', NOW() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC',
            u.monthly_income
        FROM users u
        ON CONFLICT (user_id, month_start)
        DO NOTHING;

        ALTER TABLE users
            DROP COLUMN IF EXISTS monthly_income;
    END IF;
END $$;


