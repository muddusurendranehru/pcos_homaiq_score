-- ============================================
-- DATABASE SCHEMA VERIFICATION QUERIES
-- Run these in Neon SQL Editor to see actual database structure
-- ============================================

-- ============================================
-- 1. CHECK ALL TABLES IN DATABASE
-- ============================================
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected: users, pcos_assessments


-- ============================================
-- 2. CHECK USERS TABLE COLUMNS
-- ============================================
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Expected columns:
-- id, email, password_hash, full_name, phone, created_at, updated_at


-- ============================================
-- 3. CHECK PCOS_ASSESSMENTS TABLE COLUMNS
-- ============================================
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    numeric_precision,
    numeric_scale,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'pcos_assessments'
ORDER BY ordinal_position;

-- Expected NEW Rotterdam Criteria columns:
-- lh, fsh, lh_fsh_ratio, testosterone_total, dhea, dhea_s
-- ovary_volume, follicle_size
-- family_history_diabetes, family_history_hypertension, 
-- family_history_atherosclerosis, family_history_cancer
-- pcos_score, pcos_risk_level


-- ============================================
-- 4. CHECK IF ROTTERDAM CRITERIA COLUMNS EXIST
-- ============================================
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'lh') 
        THEN '✓ YES' ELSE '✗ NO' 
    END as lh_exists,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'fsh') 
        THEN '✓ YES' ELSE '✗ NO' 
    END as fsh_exists,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'lh_fsh_ratio') 
        THEN '✓ YES' ELSE '✗ NO' 
    END as lh_fsh_ratio_exists,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'testosterone_total') 
        THEN '✓ YES' ELSE '✗ NO' 
    END as testosterone_total_exists,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'dhea') 
        THEN '✓ YES' ELSE '✗ NO' 
    END as dhea_exists,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'dhea_s') 
        THEN '✓ YES' ELSE '✗ NO' 
    END as dhea_s_exists,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'ovary_volume') 
        THEN '✓ YES' ELSE '✗ NO' 
    END as ovary_volume_exists,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'follicle_size') 
        THEN '✓ YES' ELSE '✗ NO' 
    END as follicle_size_exists,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'pcos_score') 
        THEN '✓ YES' ELSE '✗ NO' 
    END as pcos_score_exists,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'pcos_risk_level') 
        THEN '✓ YES' ELSE '✗ NO' 
    END as pcos_risk_level_exists;


-- ============================================
-- 5. CHECK IF FAMILY HISTORY COLUMNS EXIST
-- ============================================
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'family_history_diabetes') 
        THEN '✓ YES' ELSE '✗ NO' 
    END as family_history_diabetes_exists,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'family_history_hypertension') 
        THEN '✓ YES' ELSE '✗ NO' 
    END as family_history_hypertension_exists,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'family_history_atherosclerosis') 
        THEN '✓ YES' ELSE '✗ NO' 
    END as family_history_atherosclerosis_exists,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'family_history_cancer') 
        THEN '✓ YES' ELSE '✗ NO' 
    END as family_history_cancer_exists;


-- ============================================
-- 6. CHECK PHONE COLUMN IN USERS TABLE
-- ============================================
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone') 
        THEN '✓ YES' ELSE '✗ NO' 
    END as phone_column_exists;


-- ============================================
-- 7. VIEW SAMPLE DATA FROM PCOS_ASSESSMENTS
-- ============================================
SELECT 
    id,
    user_id,
    assessment_date,
    bmi,
    waist_circumference,
    lh,
    fsh,
    lh_fsh_ratio,
    testosterone_total,
    dhea,
    dhea_s,
    ovary_volume,
    follicle_size,
    family_history_diabetes,
    family_history_hypertension,
    pcos_score,
    pcos_risk_level,
    created_at
FROM pcos_assessments
ORDER BY created_at DESC
LIMIT 5;


-- ============================================
-- 8. COUNT TOTAL RECORDS
-- ============================================
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM pcos_assessments) as total_assessments;


-- ============================================
-- INSTRUCTIONS:
-- ============================================
-- 1. Open Neon Console (console.neon.tech)
-- 2. Go to your pcos_homaiq_score database
-- 3. Click "SQL Editor"
-- 4. Copy and paste these queries ONE BY ONE
-- 5. Run each query and tell me the results
-- 
-- This will show us EXACTLY what columns exist
-- and what's actually in your database!
-- ============================================

