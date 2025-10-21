-- PCOS HOMA-IQ Score Database Schema
-- Database: pcos_homaiq_score
-- Tables: users, pcos_assessments

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table 1: Users (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table 2: PCOS Assessments (main data table)
CREATE TABLE IF NOT EXISTS pcos_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Patient Information
    age INTEGER,
    weight_kg DECIMAL(5,2),
    height_cm DECIMAL(5,2),
    bmi DECIMAL(5,2),
    
    -- PCOS Indicators
    irregular_periods BOOLEAN DEFAULT FALSE,
    excess_androgen BOOLEAN DEFAULT FALSE,
    polycystic_ovaries BOOLEAN DEFAULT FALSE,
    
    -- Lab Values for HOMA-IR Score
    fasting_glucose DECIMAL(6,2), -- mg/dL
    fasting_insulin DECIMAL(6,2), -- μU/mL
    homa_ir DECIMAL(6,3), -- HOMA-IR calculated value (auto-calculated)
    
    -- Lipid Profile
    total_cholesterol DECIMAL(6,2), -- mg/dL
    ldl_cholesterol DECIMAL(6,2), -- mg/dL (Low-Density Lipoprotein)
    hdl_cholesterol DECIMAL(6,2), -- mg/dL (High-Density Lipoprotein)
    triglycerides DECIMAL(6,2), -- mg/dL
    tyg_index DECIMAL(6,3), -- TYG Index calculated value (auto-calculated)
    
    -- Follicle Data (PCOS Indicator)
    total_follicles INTEGER, -- Total number of follicles
    follicles_0_12 INTEGER, -- Follicles 0-12mm
    follicles_12_24 INTEGER, -- Follicles 12-24mm
    follicles_24_36 INTEGER, -- Follicles 24-36mm
    follicles_above_36 INTEGER, -- Follicles above 36mm
    
    -- Additional Metrics
    waist_circumference DECIMAL(5,2), -- cm
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    
    -- Assessment Notes
    diagnosis TEXT,
    
    -- Timestamps
    assessment_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_assessments_user_id ON pcos_assessments(user_id);
CREATE INDEX idx_assessments_date ON pcos_assessments(assessment_date);

-- Function to calculate HOMA-IR and TYG Index automatically
-- HOMA-IR = (Fasting Insulin × Fasting Glucose) / 405
-- TYG Index = ln[Triglycerides (mg/dL) × Fasting Glucose (mg/dL) / 2]
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

-- Trigger to automatically calculate HOMA-IR and TYG Index before insert or update
CREATE TRIGGER trigger_calculate_indices
    BEFORE INSERT OR UPDATE ON pcos_assessments
    FOR EACH ROW
    EXECUTE FUNCTION calculate_indices();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at
    BEFORE UPDATE ON pcos_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE users IS 'Stores user authentication and profile information';
COMMENT ON TABLE pcos_assessments IS 'Stores PCOS assessment data with HOMA-IR and TYG Index calculations';
COMMENT ON COLUMN pcos_assessments.homa_ir IS 'HOMA-IR = (Fasting Insulin × Fasting Glucose) / 405 - Auto-calculated';
COMMENT ON COLUMN pcos_assessments.tyg_index IS 'TYG Index = ln[Triglycerides × Fasting Glucose / 2] - Auto-calculated';
COMMENT ON COLUMN pcos_assessments.total_follicles IS 'Total number of follicles observed';
COMMENT ON COLUMN pcos_assessments.follicles_0_12 IS 'Number of follicles in 0-12mm range';
COMMENT ON COLUMN pcos_assessments.follicles_12_24 IS 'Number of follicles in 12-24mm range';
COMMENT ON COLUMN pcos_assessments.follicles_24_36 IS 'Number of follicles in 24-36mm range';
COMMENT ON COLUMN pcos_assessments.follicles_above_36 IS 'Number of follicles above 36mm';

