-- +goose Up
ALTER TABLE orders ADD COLUMN email TEXT NOT NULL DEFAULT '';

-- +goose Down
ALTER TABLE orders DROP COLUMN email;
