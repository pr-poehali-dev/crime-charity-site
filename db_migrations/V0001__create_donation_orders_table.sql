CREATE TABLE IF NOT EXISTS donation_orders (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(255) NOT NULL,
    package_name VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_donation_orders_created_at ON donation_orders(created_at DESC);
CREATE INDEX idx_donation_orders_status ON donation_orders(status);