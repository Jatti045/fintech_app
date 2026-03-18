ALTER TABLE users
    ADD COLUMN IF NOT EXISTS monthly_income DOUBLE PRECISION;

UPDATE users
SET monthly_income = 0
WHERE monthly_income IS NULL;

ALTER TABLE users
    ALTER COLUMN monthly_income SET DEFAULT 0,
    ALTER COLUMN monthly_income SET NOT NULL;
