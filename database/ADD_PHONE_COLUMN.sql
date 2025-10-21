-- Add phone column to users table
-- Column name: phone (simple and consistent)
-- Format: +country code OR just 10 digits

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

COMMENT ON COLUMN users.phone IS 'Phone: +91xxxxxxxxxx or 10 digits like 9876543210';

-- Verify
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'users';

