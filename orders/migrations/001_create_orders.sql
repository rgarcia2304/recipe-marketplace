-- +goose Up
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'fulfilled', 'cancelled');

CREATE TABLE orders(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    total_price_cents INTEGER NOT NULL,
    status order_status
);

CREATE TABLE items(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    listing_id UUID NOT NULL,
    price_cents INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    CONSTRAINT fk_orders FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- +goose Down
DROP TABLE items;
DROP TABLE orders;
DROP TYPE order_status;
