-- ============================================
-- FIX ALL DATABASE ISSUES AT ONCE
-- Run this if VERIFY_EVERYTHING.sql shows errors
-- ============================================

-- 1. ADD PHONE COLUMN (if missing)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- 2. ADD LIPID PROFILE COLUMNS (if missing)
ALTER TABLE pcos_assessments 
ADD COLUMN IF NOT EXISTS total_cholesterol DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS ldl_cholesterol DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS hdl_cholesterol DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS triglycerides DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS tyg_index DECIMAL(6,3);

-- 3. ADD FOLLICLE DATA COLUMNS (if missing)
ALTER TABLE pcos_assessments 
ADD COLUMN IF NOT EXISTS total_follicles INTEGER,
ADD COLUMN IF NOT EXISTS follicles_0_12 INTEGER,
ADD COLUMN IF NOT EXISTS follicles_12_24 INTEGER,
ADD COLUMN IF NOT EXISTS follicles_24_36 INTEGER,
ADD COLUMN IF NOT EXISTS follicles_above_36 INTEGER;

-- 4. REMOVE SYMPTOMS COLUMN (if exists)
ALTER TABLE pcos_assessments 
DROP COLUMN IF EXISTS symptoms;

-- 5. DROP OLD TRIGGER AND FUNCTION
DROP TRIGGER IF EXISTS trigger_calculate_homa_ir ON pcos_assessments;
DROP FUNCTION IF EXISTS calculate_homa_ir();

-- 6. CREATE NEW FUNCTION FOR BOTH CALCULATIONS
CREATE OR REPLACE FUNCTION calculate_indices()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate HOMA-IR
    IF NEW.fasting_glucose IS NOT NULL AND NEW.fasting_insulin IS NOT NULL THEN
        NEW.homa_ir := (NEW.fasting_insulin * NEW.fasting_glucose) / 405.0;
    END IF;
    
    -- Calculate TYG Index
    IF NEW.triglycerides IS NOT NULL AND NEW.fasting_glucose IS NOT NULL THEN
        NEW.tyg_index := ln((NEW.triglycerides * NEW.fasting_glucose) / 2.0);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. CREATE TRIGGER
DROP TRIGGER IF EXISTS trigger_calculate_indices ON pcos_assessments;
CREATE TRIGGER trigger_calculate_indices
    BEFORE INSERT OR UPDATE ON pcos_assessments
    FOR EACH ROW
    EXECUTE FUNCTION calculate_indices();

-- 8. ADD COMMENTS
COMMENT ON COLUMN users.phone IS 'Phone: +91xxxxxxxxxx or 10 digits';
COMMENT ON COLUMN pcos_assessments.total_cholesterol IS 'Total cholesterol (mg/dL)';
COMMENT ON COLUMN pcos_assessments.ldl_cholesterol IS 'LDL cholesterol (mg/dL)';
COMMENT ON COLUMN pcos_assessments.hdl_cholesterol IS 'HDL cholesterol (mg/dL)';
COMMENT ON COLUMN pcos_assessments.triglycerides IS 'Triglycerides (mg/dL)';
COMMENT ON COLUMN pcos_assessments.tyg_index IS 'TYG Index - Auto-calculated';
COMMENT ON COLUMN pcos_assessments.total_follicles IS 'Total follicles';
COMMENT ON COLUMN pcos_assessments.follicles_0_12 IS 'Follicles 0-12mm';
COMMENT ON COLUMN pcos_assessments.follicles_12_24 IS 'Follicles 12-24mm';
COMMENT ON COLUMN pcos_assessments.follicles_24_36 IS 'Follicles 24-36mm';
COMMENT ON COLUMN pcos_assessments.follicles_above_36 IS 'Follicles above 36mm';

-- 9. VERIFY FIX
SELECT 'Database Fix Complete - Run VERIFY_EVERYTHING.sql again' as message;

