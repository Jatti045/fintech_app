CREATE TABLE goal_allocations (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    goal_id VARCHAR(36),
    amount DOUBLE PRECISION NOT NULL,
    allocated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_goal_allocations_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_goal_allocations_goal
        FOREIGN KEY (goal_id) REFERENCES goals(id)
);

CREATE INDEX idx_goal_allocations_user_id ON goal_allocations(user_id);
CREATE INDEX idx_goal_allocations_goal_id ON goal_allocations(goal_id);
CREATE INDEX idx_goal_allocations_allocated_at ON goal_allocations(allocated_at);
