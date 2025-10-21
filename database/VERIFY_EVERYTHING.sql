-- ============================================
-- COMPLETE DATABASE VERIFICATION
-- Run this FIRST to check everything
-- ============================================

-- 1. CHECK IF TABLES EXIST
SELECT 
    'Tables Check' as test_name,
    COUNT(*) as result,
    'Should be 2' as expected
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'pcos_assessments');

-- 2. CHECK USERS TABLE STRUCTURE
SELECT 
    'Users Table Columns' as info,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Expected columns: id, email, password_hash, full_name, phone, created_at, updated_at

-- 3. CHECK PCOS_ASSESSMENTS TABLE STRUCTURE  
SELECT 
    'Assessments Table Columns' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'pcos_assessments'
ORDER BY ordinal_position;

-- Expected: 29 columns including lipid profile, follicle data, NO symptoms

-- 4. VERIFY PHONE COLUMN EXISTS
SELECT 
    'Phone Column Check' as test_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'phone'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING - Run ALTER TABLE users ADD COLUMN phone VARCHAR(20)'
    END as result;

-- 5. VERIFY LIPID PROFILE COLUMNS EXIST
SELECT 
    'Lipid Profile Check' as test_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'pcos_assessments' 
            AND column_name IN ('total_cholesterol', 'ldl_cholesterol', 'hdl_cholesterol', 'triglycerides', 'tyg_index')
            GROUP BY table_name
            HAVING COUNT(*) = 5
        ) THEN '✅ ALL 5 COLUMNS EXIST'
        ELSE '❌ MISSING - Run lipid profile ALTER statements'
    END as result;

-- 6. VERIFY FOLLICLE COLUMNS EXIST
SELECT 
    'Follicle Data Check' as test_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'pcos_assessments' 
            AND column_name IN ('total_follicles', 'follicles_0_12', 'follicles_12_24', 'follicles_24_36', 'follicles_above_36')
            GROUP BY table_name
            HAVING COUNT(*) = 5
        ) THEN '✅ ALL 5 COLUMNS EXIST'
        ELSE '❌ MISSING - Run follicle data ALTER statements'
    END as result;

-- 7. VERIFY SYMPTOMS COLUMN IS REMOVED
SELECT 
    'Symptoms Column Check' as test_name,
    CASE 
        WHEN NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'pcos_assessments' AND column_name = 'symptoms'
        ) THEN '✅ REMOVED (correct)'
        ELSE '❌ STILL EXISTS - Run DROP COLUMN symptoms'
    END as result;

-- 8. CHECK TRIGGERS EXIST
SELECT 
    'Triggers Check' as info,
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY trigger_name;

-- Expected: trigger_calculate_indices, update_users_updated_at, update_assessments_updated_at

-- 9. CHECK FUNCTIONS EXIST
SELECT 
    'Functions Check' as info,
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- Expected: calculate_indices, update_updated_at_column

-- 10. CHECK FOREIGN KEY
SELECT
    'Foreign Key Check' as info,
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name = 'pcos_assessments';

-- Expected: user_id references users(id)

-- 11. COUNT TOTAL COLUMNS
SELECT 
    'users' as table_name,
    COUNT(*) as column_count,
    '7 expected' as note
FROM information_schema.columns
WHERE table_name = 'users'
UNION ALL
SELECT 
    'pcos_assessments' as table_name,
    COUNT(*) as column_count,
    '29 expected' as note
FROM information_schema.columns
WHERE table_name = 'pcos_assessments';

-- 12. LIST ALL COLUMN NAMES (for manual check)
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;

SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'pcos_assessments'
ORDER BY ordinal_position;

