-- SQL: Create `products` table
-- Preferred: UUID primary key (requires pgcrypto or pgcrypto-equivalent)
-- Alternative: integer SERIAL primary key (commented out below)

-- Enable `pgcrypto` for `gen_random_uuid()` (no-op if already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Option A: UUID primary key (recommended)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL
);

-- Option B: Integer primary key (uncomment to use instead)
-- CREATE TABLE IF NOT EXISTS products (
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL
-- );

-- Example insert:
-- INSERT INTO products (name) VALUES ('Sample Product');

-- Verification query examples:
-- \\d products
-- SELECT * FROM products LIMIT 5;
