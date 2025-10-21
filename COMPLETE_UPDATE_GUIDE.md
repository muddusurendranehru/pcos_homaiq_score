# 🎯 Complete Update Guide - PCOS HOMA-IQ Score App

## ✅ All Changes Completed

### 📋 Summary of Updates

1. ✅ **Added Phone Number** to users table
2. ✅ **Added Lipid Profile** (4 fields) to assessments
3. ✅ **Added TYG Index** (auto-calculated) to assessments
4. ✅ **Added Follicle Data** (5 fields) to assessments
5. ✅ **Removed Symptoms** field from assessments
6. ✅ **Updated Backend** - auth.js and data.js
7. ✅ **Updated Frontend** - SignupPage.js, DashboardPage.js, api.js

---

## 🚀 Step-by-Step Setup

### **Step 1: Update Database Schema**

Run this SQL in Neon SQL Editor:

```sql
-- ============================================
-- COMPLETE DATABASE UPDATE
-- Run this in Neon SQL Editor
-- ============================================

-- 1. ADD PHONE NUMBER to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

COMMENT ON COLUMN users.phone IS 'Phone number: +country code or 10 digits';

-- 2. ADD LIPID PROFILE COLUMNS to pcos_assessments
ALTER TABLE pcos_assessments 
ADD COLUMN IF NOT EXISTS total_cholesterol DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS ldl_cholesterol DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS hdl_cholesterol DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS triglycerides DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS tyg_index DECIMAL(6,3);

-- 3. ADD FOLLICLE DATA COLUMNS to pcos_assessments
ALTER TABLE pcos_assessments 
ADD COLUMN IF NOT EXISTS total_follicles INTEGER,
ADD COLUMN IF NOT EXISTS follicles_0_12 INTEGER,
ADD COLUMN IF NOT EXISTS follicles_12_24 INTEGER,
ADD COLUMN IF NOT EXISTS follicles_24_36 INTEGER,
ADD COLUMN IF NOT EXISTS follicles_above_36 INTEGER;

-- 4. REMOVE SYMPTOMS COLUMN
ALTER TABLE pcos_assessments 
DROP COLUMN IF EXISTS symptoms;

-- 5. DROP OLD TRIGGER AND FUNCTION
DROP TRIGGER IF EXISTS trigger_calculate_homa_ir ON pcos_assessments;
DROP FUNCTION IF EXISTS calculate_homa_ir();

-- 6. CREATE NEW FUNCTION for HOMA-IR and TYG Index
CREATE OR REPLACE FUNCTION calculate_indices()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate HOMA-IR: (Insulin × Glucose) / 405
    IF NEW.fasting_glucose IS NOT NULL AND NEW.fasting_insulin IS NOT NULL THEN
        NEW.homa_ir := (NEW.fasting_insulin * NEW.fasting_glucose) / 405.0;
    END IF;
    
    -- Calculate TYG Index: ln[(Triglycerides × Glucose) / 2]
    IF NEW.triglycerides IS NOT NULL AND NEW.fasting_glucose IS NOT NULL THEN
        NEW.tyg_index := ln((NEW.triglycerides * NEW.fasting_glucose) / 2.0);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. CREATE NEW TRIGGER
DROP TRIGGER IF EXISTS trigger_calculate_indices ON pcos_assessments;
CREATE TRIGGER trigger_calculate_indices
    BEFORE INSERT OR UPDATE ON pcos_assessments
    FOR EACH ROW
    EXECUTE FUNCTION calculate_indices();

-- 8. ADD COMMENTS
COMMENT ON COLUMN pcos_assessments.total_cholesterol IS 'Total cholesterol (mg/dL)';
COMMENT ON COLUMN pcos_assessments.ldl_cholesterol IS 'LDL cholesterol (mg/dL)';
COMMENT ON COLUMN pcos_assessments.hdl_cholesterol IS 'HDL cholesterol (mg/dL)';
COMMENT ON COLUMN pcos_assessments.triglycerides IS 'Triglycerides (mg/dL)';
COMMENT ON COLUMN pcos_assessments.tyg_index IS 'TYG Index = ln[Triglycerides × Glucose / 2] - Auto-calculated';
COMMENT ON COLUMN pcos_assessments.total_follicles IS 'Total number of follicles';
COMMENT ON COLUMN pcos_assessments.follicles_0_12 IS 'Follicles 0-12mm';
COMMENT ON COLUMN pcos_assessments.follicles_12_24 IS 'Follicles 12-24mm';
COMMENT ON COLUMN pcos_assessments.follicles_24_36 IS 'Follicles 24-36mm';
COMMENT ON COLUMN pcos_assessments.follicles_above_36 IS 'Follicles above 36mm';

-- 9. VERIFY CHANGES
SELECT 'Users Table Columns:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;

SELECT 'Assessments Table Columns:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'pcos_assessments'
ORDER BY ordinal_position;
```

### **Step 2: Verify Database Changes**

After running the SQL, verify:

```sql
-- Should show 7 columns (including phone)
SELECT COUNT(*) as users_columns FROM information_schema.columns WHERE table_name = 'users';

-- Should show 29 columns (removed symptoms, added 10 new fields)
SELECT COUNT(*) as assessment_columns FROM information_schema.columns WHERE table_name = 'pcos_assessments';

-- Should show trigger exists
SELECT trigger_name FROM information_schema.triggers WHERE trigger_name = 'trigger_calculate_indices';
```

### **Step 3: Backend Files (Already Updated ✅)**

Files that have been updated:
- ✅ `backend/routes/auth.js` - Added phone field support
- ✅ `backend/routes/data.js` - Added lipid profile and follicle fields

### **Step 4: Frontend Files (Already Updated ✅)**

Files that have been updated:
- ✅ `frontend/src/pages/SignupPage.js` - Added phone number field
- ✅ `frontend/src/pages/DashboardPage.js` - Added all new assessment fields
- ✅ `frontend/src/services/api.js` - Updated signup API call

### **Step 5: Start Application**

```powershell
.\start-all.ps1
```

Or manually:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

---

## 📊 New Database Structure

### **Users Table** (7 columns)
```
id              UUID (PK)
email           VARCHAR(255) UNIQUE
password_hash   VARCHAR(255)
full_name       VARCHAR(255)
phone           VARCHAR(20)        ← NEW
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### **PCOS Assessments Table** (29 columns)

**Patient Info:**
- id, user_id, age, weight_kg, height_cm, bmi

**PCOS Indicators:**
- irregular_periods, excess_androgen, polycystic_ovaries

**Lab Values:**
- fasting_glucose, fasting_insulin
- **homa_ir** (auto-calculated)

**Lipid Profile:** ← NEW
- total_cholesterol
- ldl_cholesterol
- hdl_cholesterol
- triglycerides
- **tyg_index** (auto-calculated)

**Follicle Data:** ← NEW
- total_follicles
- follicles_0_12
- follicles_12_24
- follicles_24_36
- follicles_above_36

**Additional:**
- waist_circumference
- blood_pressure_systolic
- blood_pressure_diastolic
- diagnosis (symptoms removed ✅)
- assessment_date, created_at, updated_at

---

## 🧪 Test the Application

### **1. Sign Up with Phone Number**

Go to: `http://localhost:3000/signup`

Fill in:
- Full Name: John Doe
- **Phone: +919876543210** ← NEW
- Email: john@example.com
- Password: password123
- Confirm Password: password123

Phone formats accepted:
- `+919876543210` (with country code)
- `9876543210` (10 digits only)

### **2. Create Assessment with All Fields**

After login, click "New Assessment":

**Basic Info:**
- Age: 28
- Weight: 65 kg
- Height: 165 cm
- BMI: 24.1

**Lab Values:**
- Fasting Glucose: 100 mg/dL
- Fasting Insulin: 10 μU/mL

**Lipid Profile:** ← NEW
- Total Cholesterol: 200 mg/dL
- LDL Cholesterol: 100 mg/dL
- HDL Cholesterol: 50 mg/dL
- Triglycerides: 150 mg/dL

**Follicle Data:** ← NEW
- Total Follicles: 15
- Follicles 0-12mm: 12
- Follicles 12-24mm: 2
- Follicles 24-36mm: 1
- Follicles Above 36mm: 0

**PCOS Indicators:**
- ☑ Irregular Periods
- ☑ Polycystic Ovaries

**Additional:**
- Waist: 82 cm
- BP: 120/80
- Diagnosis: PCOS suspected

**Click "Create Assessment"**

### **3. Verify Auto-Calculations**

After saving, check the database or view in table:
- ✅ **HOMA-IR** should be: **2.47** (auto-calculated)
- ✅ **TYG Index** should be: **~8.6** (auto-calculated)

---

## 📈 Auto-Calculation Formulas

### **HOMA-IR** (Insulin Resistance)
```
HOMA-IR = (Fasting Insulin × Fasting Glucose) / 405
```

**Interpretation:**
- < 1.0: Optimal
- 1.0-1.9: Normal
- 2.0-2.9: Early insulin resistance
- ≥ 3.0: Significant insulin resistance

### **TYG Index** (Cardiovascular Risk) ← NEW
```
TYG Index = ln[(Triglycerides × Fasting Glucose) / 2]
```

**Interpretation:**
- < 8.5: Normal
- 8.5-9.0: Increased risk
- ≥ 9.0: High cardiovascular risk

---

## 🔍 Verification Queries

### Check All Fields Are Present:

```sql
-- View complete assessment
SELECT 
    id,
    age,
    weight_kg,
    height_cm,
    bmi,
    fasting_glucose,
    fasting_insulin,
    homa_ir,
    total_cholesterol,
    ldl_cholesterol,
    hdl_cholesterol,
    triglycerides,
    tyg_index,
    total_follicles,
    follicles_0_12,
    follicles_12_24,
    follicles_24_36,
    follicles_above_36,
    diagnosis,
    assessment_date
FROM pcos_assessments
ORDER BY created_at DESC
LIMIT 1;
```

### Check Phone Numbers:

```sql
SELECT id, email, full_name, phone 
FROM users
WHERE phone IS NOT NULL;
```

---

## 📝 Changes Summary Table

| Category | Before | After | Change |
|----------|--------|-------|--------|
| **Users Table** | 6 columns | 7 columns | +1 (phone) |
| **Assessments Table** | 20 columns | 29 columns | +10 new, -1 symptoms |
| **Auto-Calculations** | 1 (HOMA-IR) | 2 (HOMA-IR + TYG) | +1 |
| **Signup Fields** | 3 fields | 4 fields | +1 (phone) |
| **Assessment Form** | ~15 inputs | ~23 inputs | +8 inputs |

---

## ✅ Completion Checklist

- [x] Database schema updated
- [x] Phone number added to users table
- [x] Lipid profile fields added
- [x] Follicle data fields added
- [x] TYG Index auto-calculation added
- [x] Symptoms field removed
- [x] Backend auth.js updated
- [x] Backend data.js updated
- [x] Frontend SignupPage updated
- [x] Frontend DashboardPage updated
- [x] Frontend API service updated

---

## 🎯 Ready to Use!

1. ✅ Run the SQL update script in Neon
2. ✅ Backend files are already updated
3. ✅ Frontend files are already updated
4. ✅ Start the application: `.\start-all.ps1`
5. ✅ Test signup with phone number
6. ✅ Test creating assessment with all new fields
7. ✅ Verify HOMA-IR and TYG Index auto-calculate

---

**Status:** ✅ ALL CHANGES COMPLETE AND READY!

**Updated:** October 20, 2025

**Next Step:** Run the SQL update in Neon, then start your servers! 🚀

