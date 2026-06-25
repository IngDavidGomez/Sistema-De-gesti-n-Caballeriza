ALTER TABLE horse ADD COLUMN IF NOT EXISTS photo_content_type VARCHAR(80);
ALTER TABLE horse ADD COLUMN IF NOT EXISTS photo_file_name VARCHAR(255);
ALTER TABLE horse ADD COLUMN IF NOT EXISTS photo_updated_at TIMESTAMP;
ALTER TABLE horse ADD COLUMN IF NOT EXISTS photo_data BYTEA;

CREATE INDEX IF NOT EXISTS idx_horse_photo_updated_at ON horse(photo_updated_at);
