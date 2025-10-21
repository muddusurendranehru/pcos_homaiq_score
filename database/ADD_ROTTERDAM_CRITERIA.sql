-- Add Rotterdam Criteria and Additional PCOS Assessment Columns
-- Run this in your Neon PostgreSQL database console

-- Add Rotterdam Criteria - Hormonal Markers
ALTER TABLE pcos_assessments 
ADD COLUMN IF NOT EXISTS lh DECIMAL(6,2), -- Luteinizing Hormone (mIU/mL)
ADD COLUMN IF NOT EXISTS fsh DECIMAL(6,2), -- Follicle Stimulating Hormone (mIU/mL)
ADD COLUMN IF NOT EXISTS lh_fsh_ratio DECIMAL(6,2), -- LH/FSH Ratio (auto-calculated)
ADD COLUMN IF NOT EXISTS testosterone_total DECIMAL(6,2), -- Total Testosterone (ng/dL)
ADD COLUMN IF NOT EXISTS dhea DECIMAL(6,2), -- DHEA (μg/dL)
ADD COLUMN IF NOT EXISTS dhea_s DECIMAL(6,2); -- DHEA-S (μg/dL)

-- Add Ultrasound Scan Parameters
ALTER TABLE pcos_assessments
ADD COLUMN IF NOT EXISTS ovary_volume DECIMAL(5,2), -- Ovary Volume (cm³)
ADD COLUMN IF NOT EXISTS follicle_size DECIMAL(5,2); -- Average Follicle Size (mm)

-- Add Family History Risk Factors
ALTER TABLE pcos_assessments
ADD COLUMN IF NOT EXISTS family_history_diabetes BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS family_history_hypertension BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS family_history_atherosclerosis BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS family_history_cancer BOOLEAN DEFAULT FALSE;

-- Add PCOS Score
ADD COLUMN IF NOT EXISTS pcos_score INTEGER, -- Total PCOS Score (0-100)
ADD COLUMN IF NOT EXISTS pcos_risk_level VARCHAR(50); -- Low Risk, Mild, Moderate, High, Very High

-- Add Phone Number (if not already added)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Update function to calculate LH/FSH ratio
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
    
    -- Calculate LH/FSH Ratio
    IF NEW.lh IS NOT NULL AND NEW.fsh IS NOT NULL AND NEW.fsh > 0 THEN
        NEW.lh_fsh_ratio := NEW.lh / NEW.fsh;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add comments for new columns
COMMENT ON COLUMN pcos_assessments.lh IS 'Luteinizing Hormone (mIU/mL) - Rotterdam Criteria';
COMMENT ON COLUMN pcos_assessments.fsh IS 'Follicle Stimulating Hormone (mIU/mL) - Rotterdam Criteria';
COMMENT ON COLUMN pcos_assessments.lh_fsh_ratio IS 'LH/FSH Ratio - Auto-calculated, PCOS marker ≥2:1';
COMMENT ON COLUMN pcos_assessments.testosterone_total IS 'Total Testosterone (ng/dL) - Hyperandrogenism marker';
COMMENT ON COLUMN pcos_assessments.dhea IS 'DHEA (μg/dL) - Androgen marker';
COMMENT ON COLUMN pcos_assessments.dhea_s IS 'DHEA-S (μg/dL) - Adrenal androgen marker';
COMMENT ON COLUMN pcos_assessments.ovary_volume IS 'Ovary Volume (cm³) - PCOS criteria >10cm³';
COMMENT ON COLUMN pcos_assessments.follicle_size IS 'Average Follicle Size (mm) - PCOS criteria 2-9mm';
COMMENT ON COLUMN pcos_assessments.family_history_diabetes IS 'Family history of diabetes';
COMMENT ON COLUMN pcos_assessments.family_history_hypertension IS 'Family history of hypertension';
COMMENT ON COLUMN pcos_assessments.family_history_atherosclerosis IS 'Family history of atherosclerosis';
COMMENT ON COLUMN pcos_assessments.family_history_cancer IS 'Family history of cancer';
COMMENT ON COLUMN pcos_assessments.pcos_score IS 'Total PCOS Score (0-100 scale)';
COMMENT ON COLUMN pcos_assessments.pcos_risk_level IS 'PCOS Risk Level: Low Risk, Mild, Moderate, High, Very High';

-- Create index for PCOS score queries
CREATE INDEX IF NOT EXISTS idx_assessments_pcos_score ON pcos_assessments(pcos_score);
CREATE INDEX IF NOT EXISTS idx_assessments_risk_level ON pcos_assessments(pcos_risk_level);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Rotterdam Criteria columns added successfully!';
    RAISE NOTICE '✅ Family history columns added successfully!';
    RAISE NOTICE '✅ PCOS Score columns added successfully!';
    RAISE NOTICE '✅ LH/FSH ratio auto-calculation enabled!';
END $$;

