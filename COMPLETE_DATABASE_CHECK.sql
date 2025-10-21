-- ============================================
-- COMPLETE DATABASE STRUCTURE AND DATA CHECK
-- Run this in Neon SQL Editor
-- ============================================

-- ====================
-- 1. LIST ALL TABLES
-- ====================
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;

-- ====================
-- 2. USERS TABLE - STRUCTURE
-- ====================
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- ====================
-- 3. USERS TABLE - DATA
-- ====================
SELECT 
    id,
    email,
    created_at
FROM users
ORDER BY created_at DESC;

-- ====================
-- 4. PCOS_ASSESSMENTS TABLE - FULL STRUCTURE
-- ====================
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'pcos_assessments'
ORDER BY ordinal_position;

-- ====================
-- 5. COUNT COLUMNS IN PCOS_ASSESSMENTS
-- ====================
SELECT COUNT(*) as total_columns
FROM information_schema.columns
WHERE table_name = 'pcos_assessments';

-- ====================
-- 6. CHECK FOR SPECIFIC REQUIRED COLUMNS
-- ====================
SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'age') THEN '✓' ELSE '✗' END as age,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'weight_kg') THEN '✓' ELSE '✗' END as weight_kg,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'height_cm') THEN '✓' ELSE '✗' END as height_cm,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'bmi') THEN '✓' ELSE '✗' END as bmi,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'fasting_insulin') THEN '✓' ELSE '✗' END as fasting_insulin,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'lh') THEN '✓' ELSE '✗' END as lh,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'fsh') THEN '✓' ELSE '✗' END as fsh,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'testosterone_total') THEN '✓' ELSE '✗' END as testosterone_total,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'dhea') THEN '✓' ELSE '✗' END as dhea,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'dhea_s') THEN '✓' ELSE '✗' END as dhea_s,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'ovary_volume') THEN '✓' ELSE '✗' END as ovary_volume,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'follicle_size') THEN '✓' ELSE '✗' END as follicle_size,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'lh_fsh_ratio') THEN '✓' ELSE '✗' END as lh_fsh_ratio,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'pcos_score') THEN '✓' ELSE '✗' END as pcos_score,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'pcos_risk_level') THEN '✓' ELSE '✗' END as pcos_risk_level,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'family_history_diabetes') THEN '✓' ELSE '✗' END as family_history_diabetes,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'family_history_hypertension') THEN '✓' ELSE '✗' END as family_history_hypertension,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'family_history_atherosclerosis') THEN '✓' ELSE '✗' END as family_history_atherosclerosis,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'family_history_cancer') THEN '✓' ELSE '✗' END as family_history_cancer;

-- ====================
-- 7. PCOS_ASSESSMENTS - RECENT DATA
-- ====================
SELECT 
    id,
    user_id,
    created_at,
    assessment_date,
    age,
    weight_kg,
    height_cm,
    bmi,
    fasting_glucose,
    fasting_insulin,
    homa_ir,
    tyg_index,
    lh,
    fsh,
    lh_fsh_ratio,
    testosterone_total,
    pcos_score,
    pcos_risk_level
FROM pcos_assessments
ORDER BY created_at DESC
LIMIT 3;

-- ====================
-- 8. DATA COMPLETENESS CHECK
-- ====================
SELECT 
    COUNT(*) as total_records,
    COUNT(age) as age_filled,
    COUNT(weight_kg) as weight_filled,
    COUNT(height_cm) as height_filled,
    COUNT(bmi) as bmi_filled,
    COUNT(fasting_insulin) as insulin_filled,
    COUNT(lh) as lh_filled,
    COUNT(fsh) as fsh_filled,
    COUNT(pcos_score) as pcos_score_filled,
    COUNT(*) - COUNT(bmi) as bmi_null_count
FROM pcos_assessments;

-- ====================
-- 9. LATEST ASSESSMENT WITH ALL ROTTERDAM CRITERIA
-- ====================
SELECT 
    created_at,
    age,
    weight_kg,
    height_cm,
    bmi,
    -- Rotterdam Hormonal
    lh,
    fsh,
    lh_fsh_ratio,
    testosterone_total,
    dhea,
    dhea_s,
    -- Scan
    ovary_volume,
    follicle_size,
    total_follicles,
    -- Family History
    family_history_diabetes,
    family_history_hypertension,
    family_history_atherosclerosis,
    family_history_cancer,
    -- Score
    pcos_score,
    pcos_risk_level
FROM pcos_assessments
ORDER BY created_at DESC
LIMIT 1;

-- ====================
-- 10. CHECK DATABASE TRIGGERS
-- ====================
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'pcos_assessments';

