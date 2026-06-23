CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY, name VARCHAR(150) NOT NULL, email VARCHAR(180) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL, role VARCHAR(30) NOT NULL, active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS horse (
  id BIGSERIAL PRIMARY KEY, code VARCHAR(60) NOT NULL UNIQUE, name VARCHAR(120) NOT NULL,
  birth_date DATE, breed VARCHAR(120) NOT NULL, sex VARCHAR(20) NOT NULL, weight DOUBLE PRECISION,
  photo_url VARCHAR(500), active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS employee (
  id BIGSERIAL PRIMARY KEY, name VARCHAR(150) NOT NULL, role VARCHAR(40) NOT NULL,
  contact VARCHAR(180) NOT NULL, shift VARCHAR(100), tasks TEXT, active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS medical_record (
  id BIGSERIAL PRIMARY KEY, horse_id BIGINT NOT NULL REFERENCES horse(id), date DATE NOT NULL,
  type VARCHAR(50) NOT NULL, description TEXT NOT NULL, responsible VARCHAR(150) NOT NULL,
  next_due_date DATE, observations TEXT
);
CREATE TABLE IF NOT EXISTS reservation (
  id BIGSERIAL PRIMARY KEY, horse_id BIGINT NOT NULL REFERENCES horse(id), start_at TIMESTAMP NOT NULL,
  end_at TIMESTAMP NOT NULL, activity_type VARCHAR(50) NOT NULL, responsible VARCHAR(150) NOT NULL,
  status VARCHAR(30) NOT NULL, observations TEXT, capacity INTEGER NOT NULL DEFAULT 1,
  participants INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT reservation_valid_interval CHECK (end_at > start_at)
  ,CONSTRAINT reservation_valid_capacity CHECK (capacity >= 1 AND participants >= 1 AND participants <= capacity)
);
CREATE TABLE IF NOT EXISTS inventory_item (
  id BIGSERIAL PRIMARY KEY, name VARCHAR(150) NOT NULL UNIQUE, category VARCHAR(80) NOT NULL,
  quantity DOUBLE PRECISION NOT NULL CHECK (quantity >= 0), minimum_stock DOUBLE PRECISION NOT NULL CHECK (minimum_stock >= 0),
  unit VARCHAR(40) NOT NULL
);
CREATE TABLE IF NOT EXISTS feeding_plan (
  id BIGSERIAL PRIMARY KEY, horse_id BIGINT NOT NULL REFERENCES horse(id), feed_type VARCHAR(120) NOT NULL,
  quantity DOUBLE PRECISION NOT NULL CHECK (quantity > 0), unit VARCHAR(40) NOT NULL,
  schedule_time TIME NOT NULL, notes TEXT
);
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
CREATE TABLE IF NOT EXISTS password_reset_token (
  id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) NOT NULL UNIQUE, expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP, created_at TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_medical_record_horse ON medical_record(horse_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_reservation_horse_time ON reservation(horse_id, start_at, end_at);
CREATE INDEX IF NOT EXISTS idx_feeding_plan_horse ON feeding_plan(horse_id);
CREATE INDEX IF NOT EXISTS idx_supply_record_date ON supply_record(date DESC);
CREATE INDEX IF NOT EXISTS idx_password_reset_user ON password_reset_token(user_id, expires_at);
