-- Aplicar únicamente sobre instalaciones PostgreSQL creadas antes de la versión 2.
ALTER TABLE reservation ADD COLUMN IF NOT EXISTS capacity INTEGER NOT NULL DEFAULT 1;
ALTER TABLE reservation ADD COLUMN IF NOT EXISTS participants INTEGER NOT NULL DEFAULT 1;

CREATE TABLE IF NOT EXISTS supply_record (
  id BIGSERIAL PRIMARY KEY, item_id BIGINT NOT NULL REFERENCES inventory_item(id), date TIMESTAMP NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('IN','OUT')), quantity DOUBLE PRECISION NOT NULL CHECK (quantity > 0),
  responsible VARCHAR(150) NOT NULL, notes TEXT
);

CREATE TABLE IF NOT EXISTS notification_alert (
  id BIGSERIAL PRIMARY KEY, reference_key VARCHAR(180) NOT NULL UNIQUE, category VARCHAR(40) NOT NULL,
  title VARCHAR(180) NOT NULL, message VARCHAR(700) NOT NULL, created_at TIMESTAMP NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE, active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_supply_record_date ON supply_record(date DESC);
