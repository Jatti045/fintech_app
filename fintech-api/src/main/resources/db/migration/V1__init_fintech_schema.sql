CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    profile_pic VARCHAR(255),
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE password_reset_tokens (
    id VARCHAR(36) PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id VARCHAR(36) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_password_reset_token_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE budgets (
    id VARCHAR(36) PRIMARY KEY,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    category VARCHAR(100) NOT NULL,
    budget_limit DOUBLE PRECISION NOT NULL,
    spent DOUBLE PRECISION NOT NULL DEFAULT 0,
    icon VARCHAR(255),
    user_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_budget_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE goals (
    id VARCHAR(36) PRIMARY KEY,
    target DOUBLE PRECISION NOT NULL,
    progress DOUBLE PRECISION NOT NULL DEFAULT 0,
    icon VARCHAR(255),
    user_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_goal_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE transactions (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    category VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    original_amount DOUBLE PRECISION,
    original_currency VARCHAR(10),
    icon VARCHAR(255),
    description TEXT,
    user_id VARCHAR(36) NOT NULL,
    budget_id VARCHAR(36) NOT NULL,
    goal_id VARCHAR(36),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_transaction_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_transaction_budget
        FOREIGN KEY (budget_id) REFERENCES budgets(id),
    CONSTRAINT fk_transaction_goal
        FOREIGN KEY (goal_id) REFERENCES goals(id),
    CONSTRAINT chk_transaction_type
        CHECK (type IN ('INCOME', 'EXPENSE'))
);

CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_budget_id ON transactions(budget_id);
CREATE INDEX idx_transactions_goal_id ON transactions(goal_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);


