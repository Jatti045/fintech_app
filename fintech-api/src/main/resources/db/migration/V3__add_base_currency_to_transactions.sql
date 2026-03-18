ALTER TABLE transactions
    ADD COLUMN IF NOT EXISTS base_currency VARCHAR(10);

UPDATE transactions t
SET base_currency = COALESCE(NULLIF(UPPER(t.original_currency), ''), UPPER(u.currency), 'USD')
FROM users u
WHERE t.user_id = u.id
  AND (t.base_currency IS NULL OR t.base_currency = '');

-- Fallback for any rows not joined above
UPDATE transactions
SET base_currency = 'USD'
WHERE base_currency IS NULL OR base_currency = '';

CREATE INDEX IF NOT EXISTS idx_transactions_base_currency ON transactions(base_currency);
