# 📋 DATABASE CHECK INSTRUCTIONS

## 🎯 **What to Do:**

### **Step 1: Open Neon Console**
1. Go to: https://console.neon.tech/
2. Select your project: `pcos_homaiq_score`
3. Click on **SQL Editor**

---

### **Step 2: Copy & Run the SQL Script**

**Open the file:** `COMPLETE_DATABASE_CHECK.sql`

**Copy ALL the SQL code** and paste it into Neon SQL Editor.

Click **"Run"** button.

---

### **Step 3: Review the Results**

The script will show you **10 different checks:**

1. ✅ **List of all tables** (should show: `users`, `pcos_assessments`)
2. ✅ **Users table structure**
3. ✅ **Users data** (your test users)
4. ✅ **PCOS Assessments table structure** (all columns)
5. ✅ **Total column count** (should be ~40-45 columns)
6. ✅ **Required columns check** (✓ or ✗ for each column)
7. ✅ **Recent assessment data**
8. ✅ **Data completeness** (how many fields are filled vs null)
9. ✅ **Latest assessment with Rotterdam criteria**
10. ✅ **Database triggers** (auto-calculation functions)

---

### **Step 4: Copy Results Back to Me**

**I need to see these specific results:**

#### **From Query #6 (Required Columns Check):**
```
Copy the row showing ✓ or ✗ for each column
```

#### **From Query #5 (Total Columns):**
```
total_columns: [number]
```

#### **From Query #7 (Recent Data):**
```
Paste the most recent row
```

#### **From Query #8 (Data Completeness):**
```
total_records: X
bmi_null_count: X
```

---

### **Step 5: Backend Port Issue**

After checking the database, we need to:
1. **Kill the stuck backend process** on port 5000
2. **Restart backend** with updated code
3. **Test save function** again

---

## 🚀 **Quick Version:**

If you just want to see the essentials, run these 3 queries only:

```sql
-- 1. Check columns exist (should show 14 ✓ marks)
SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'lh') THEN '✓' ELSE '✗' END as lh,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'fsh') THEN '✓' ELSE '✗' END as fsh,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'pcos_score') THEN '✓' ELSE '✗' END as pcos_score,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pcos_assessments' AND column_name = 'family_history_diabetes') THEN '✓' ELSE '✗' END as family_history;

-- 2. Count total columns (should be 40+)
SELECT COUNT(*) as total_columns
FROM information_schema.columns
WHERE table_name = 'pcos_assessments';

-- 3. Show latest data
SELECT id, created_at, age, bmi, lh, fsh, pcos_score
FROM pcos_assessments
ORDER BY created_at DESC
LIMIT 1;
```

---

**Run the SQL now and paste the results!** 🔍

