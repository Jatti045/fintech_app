BEGIN;

-- Clear dependent rows first, then parent rows.
DELETE FROM transactions;
DELETE FROM budgets;

COMMIT;

