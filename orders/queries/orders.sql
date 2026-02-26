-- name: CreateOrder :one
INSERT INTO orders(customer_id, total_price_cents, status)
VALUES ($1, $2, 'pending')
RETURNING *;

-- name: CreateItem :one
INSERT INTO items (order_id, listing_id, price_cents, quantity)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetOrder :one
SELECT * FROM orders
WHERE id = $1;

-- name: UpdateOrderStatus :one
UPDATE orders
SET status = $2
WHERE id = $1
RETURNING *;
