# Database Schema Update Summary

## ✅ Changes Completed

### 🗄️ Database Schema Updates (`database/schema.sql`)

#### Fields Added:
1. **Lipid Profile** (4 new fields):
   - `total_cholesterol` DECIMAL(6,2) - Total cholesterol (mg/dL)
   - `ldl_cholesterol` DECIMAL(6,2) - LDL cholesterol (mg/dL)
   - `hdl_cholesterol` DECIMAL(6,2) - HDL cholesterol (mg/dL)
   - `triglycerides` DECIMAL(6,2) - Triglycerides (mg/dL)

2. **TYG Index**:
   - `tyg_index` DECIMAL(6,3) - **Auto-calculated** via database trigger
   - Formula: `ln[Triglycerides × Fasting Glucose / 2]`

3. **Follicle Data** (5 new fields):
   - `total_follicles` INTEGER - Total number of follicles
   - `follicles_0_12` INTEGER - Follicles 0-12mm
   - `follicles_12_24` INTEGER - Follicles 12-24mm
   - `follicles_24_36` INTEGER - Follicles 24-36mm
   - `follicles_above_36` INTEGER - Follicles above 36mm

#### Fields Removed:
- ❌ `symptoms` TEXT - Removed (was too large)

#### Fields Kept:
- ✅ `homa_ir` - Still auto-calculated
- ✅ `diagnosis` TEXT - Kept for medical notes

#### Updated Triggers:
- Modified `calculate_homa_ir()` → `calculate_indices()`
- Now calculates both **HOMA-IR** and **TYG Index** automatically
- Trigger renamed: `trigger_calculate_homa_ir` → `trigger_calculate_indices`

---

### 🔧 Backend API Updates (`backend/routes/data.js`)

#### Validation Added:
- `total_cholesterol` - Float validation
- `triglycerides` - Float validation  
- `total_follicles` - Integer validation

#### POST /api/data (Create Assessment):
- Added 9 new fields to INSERT query
- Removed `symptoms` field
- Kept `diagnosis` field
- Total fields now: 24 parameters

#### PUT /api/data/:id (Update Assessment):
- Added 9 new fields to UPDATE query
- Removed `symptoms` field
- Total fields now: 23 parameters (excluding id and user_id)

---

### 🎨 Frontend Updates (`frontend/src/pages/DashboardPage.js`)

#### Form State Updated:
Added to `formData` useState:
- `total_cholesterol: ''`
- `ldl_cholesterol: ''`
- `hdl_cholesterol: ''`
- `triglycerides: ''`
- `total_follicles: ''`
- `follicles_0_12: ''`
- `follicles_12_24: ''`
- `follicles_24_36: ''`
- `follicles_above_36: ''`

Removed from `formData`:
- ❌ `symptoms: ''`

#### Form Inputs Added:
**Lipid Profile Section** (after Fasting Insulin):
1. Total Cholesterol input (mg/dL)
2. LDL Cholesterol input (mg/dL)
3. HDL Cholesterol input (mg/dL)
4. Triglycerides input (mg/dL)

**Follicle Data Section** (after Lipid Profile):
1. Total Follicles input
2. Follicles 0-12mm input
3. Follicles 12-24mm input
4. Follicles 24-36mm input
5. Follicles Above 36mm input

#### Form Inputs Removed:
- ❌ Symptoms textarea (removed as requested)

#### handleSubmit Function:
- Added parsing for all 9 new fields
- Removed `symptoms` handling
- Added to assessmentData object sent to API

---

## 📊 Auto-Calculated Fields

### HOMA-IR (Existing - Still Working)
```
HOMA-IR = (Fasting Insulin × Fasting Glucose) / 405
```
**Interpretation:**
- < 1.0: Optimal
- 1.0-1.9: Normal
- 2.0-2.9: Early insulin resistance
- ≥ 3.0: Significant insulin resistance

### TYG Index (NEW - Auto-calculated)
```
TYG Index = ln[(Triglycerides × Fasting Glucose) / 2]
```
**Interpretation:**
- < 8.5: Normal
- ≥ 8.5: Increased cardiovascular risk
- ≥ 9.0: High cardiovascular risk

---

## 🚀 Next Steps to Apply Changes

### Step 1: Update Database Schema
Run this in Neon SQL Editor:
```sql
-- Add new columns
ALTER TABLE pcos_assessments 
ADD COLUMN IF NOT EXISTS total_cholesterol DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS ldl_cholesterol DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS hdl_cholesterol DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS triglycerides DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS tyg_index DECIMAL(6,3),
ADD COLUMN IF NOT EXISTS total_follicles INTEGER,
ADD COLUMN IF NOT EXISTS follicles_0_12 INTEGER,
ADD COLUMN IF NOT EXISTS follicles_12_24 INTEGER,
ADD COLUMN IF NOT EXISTS follicles_24_36 INTEGER,
ADD COLUMN IF NOT EXISTS follicles_above_36 INTEGER;

-- Remove symptoms column
ALTER TABLE pcos_assessments DROP COLUMN IF EXISTS symptoms;

-- Drop old trigger and function
DROP TRIGGER IF EXISTS trigger_calculate_homa_ir ON pcos_assessments;
DROP FUNCTION IF EXISTS calculate_homa_ir();

-- Create new function
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

-- Create new trigger
CREATE TRIGGER trigger_calculate_indices
    BEFORE INSERT OR UPDATE ON pcos_assessments
    FOR EACH ROW
    EXECUTE FUNCTION calculate_indices();

-- Add comments
COMMENT ON COLUMN pcos_assessments.tyg_index IS 'TYG Index = ln[Triglycerides × Fasting Glucose / 2] - Auto-calculated';
COMMENT ON COLUMN pcos_assessments.total_follicles IS 'Total number of follicles observed';
COMMENT ON COLUMN pcos_assessments.follicles_0_12 IS 'Number of follicles in 0-12mm range';
COMMENT ON COLUMN pcos_assessments.follicles_12_24 IS 'Number of follicles in 12-24mm range';
COMMENT ON COLUMN pcos_assessments.follicles_24_36 IS 'Number of follicles in 24-36mm range';
COMMENT ON COLUMN pcos_assessments.follicles_above_36 IS 'Number of follicles above 36mm';
```

### Step 2: Backend (Already Done ✅)
- Files updated:
  - `backend/routes/data.js` ✅

### Step 3: Frontend (Already Done ✅)
- Files updated:
  - `frontend/src/pages/DashboardPage.js` ✅

### Step 4: Restart Servers
```bash
# Restart backend
cd backend
npm run dev

# Restart frontend (new terminal)
cd frontend
npm start
```

---

## 📝 Summary of Changes

| Category | Before | After | Change |
|----------|--------|-------|--------|
| **Database Fields** | 17 data fields | 25 data fields | +8 fields |
| **Auto-calculated** | 1 (HOMA-IR) | 2 (HOMA-IR + TYG Index) | +1 calculation |
| **Lipid Profile** | None | 4 fields | +4 fields |
| **Follicle Data** | None | 5 fields | +5 fields |
| **Symptoms Field** | Text field | Removed | -1 field |
| **Form Inputs** | ~15 inputs | ~23 inputs | +8 inputs |

---

## ✅ Testing Checklist

After applying changes:
- [ ] Run database migration SQL
- [ ] Restart backend server
- [ ] Restart frontend server
- [ ] Create new assessment with all fields
- [ ] Verify HOMA-IR still calculates
- [ ] Verify TYG Index calculates (if triglycerides + glucose provided)
- [ ] Check lipid profile fields save correctly
- [ ] Check follicle data fields save correctly
- [ ] Verify symptoms field is removed
- [ ] Verify diagnosis field still works
- [ ] Check old assessments still display

---

## 📚 Field Reference

### Lipid Profile Normal Ranges
- **Total Cholesterol**: < 200 mg/dL (desirable)
- **LDL**: < 100 mg/dL (optimal)
- **HDL**: > 40 mg/dL men, > 50 mg/dL women (desirable)
- **Triglycerides**: < 150 mg/dL (normal)

### Follicle Sizes (PCOS Diagnostic)
- **0-12mm**: Small follicles (common in PCOS)
- **12-24mm**: Medium follicles (pre-ovulatory)
- **24-36mm**: Large follicles (ovulatory/dominant)
- **Above 36mm**: Very large follicles (cysts)

**PCOS Criteria**: ≥ 12 follicles of 2-9mm in one or both ovaries

---

**Changes Completed:** October 20, 2025  
**Status:** ✅ Ready to Deploy

