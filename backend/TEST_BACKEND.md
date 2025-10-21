# 🧪 Backend Testing Guide - Test EVERYTHING Before Frontend

## Step 1: Start Backend Only

```bash
cd backend
npm install
npm run dev
```

Wait for: `Server running on port 5000`

---

## Step 2: Test Health Check

```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "PCOS HOMA-IQ Score API is running",
  "timestamp": "2025-10-20T..."
}
```

✅ **Pass** if you see success: true

---

## Step 3: Test Signup (with phone)

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"confirmPassword\":\"password123\",\"fullName\":\"Test User\",\"phone\":\"+919876543210\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "fullName": "Test User",
    "phone": "+919876543210",
    "createdAt": "..."
  }
}
```

**✅ MUST CHECK:**
- [ ] success: true
- [ ] token exists
- [ ] user.phone exists and shows "+919876543210"

**❌ If Error:** Check database has phone column

---

## Step 4: Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "fullName": "Test User",
    "phone": "+919876543210"
  }
}
```

**✅ Copy the token for next tests**

---

## Step 5: Test Token Verification

```bash
# Replace TOKEN with your actual token from Step 4
curl http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer TOKEN"
```

**Expected:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "test@example.com",
    "fullName": "Test User",
    "phone": "+919876543210"
  }
}
```

✅ **Pass** if phone field is returned

---

## Step 6: Test Create Assessment (ALL FIELDS)

```bash
# Replace TOKEN with your token
curl -X POST http://localhost:5000/api/data \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "age": 28,
    "weight_kg": 65.5,
    "height_cm": 165,
    "bmi": 24.1,
    "irregular_periods": true,
    "excess_androgen": false,
    "polycystic_ovaries": true,
    "fasting_glucose": 100,
    "fasting_insulin": 10,
    "total_cholesterol": 200,
    "ldl_cholesterol": 100,
    "hdl_cholesterol": 50,
    "triglycerides": 150,
    "total_follicles": 15,
    "follicles_0_12": 12,
    "follicles_12_24": 2,
    "follicles_24_36": 1,
    "follicles_above_36": 0,
    "waist_circumference": 82,
    "blood_pressure_systolic": 120,
    "blood_pressure_diastolic": 80,
    "diagnosis": "PCOS suspected"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Assessment created successfully",
  "data": {
    "id": "uuid-here",
    "age": 28,
    "fasting_glucose": 100,
    "fasting_insulin": 10,
    "homa_ir": "2.469",           // ← AUTO-CALCULATED
    "total_cholesterol": 200,
    "ldl_cholesterol": 100,
    "hdl_cholesterol": 50,
    "triglycerides": 150,
    "tyg_index": "8.643",          // ← AUTO-CALCULATED
    "total_follicles": 15,
    "follicles_0_12": 12,
    "follicles_12_24": 2,
    "follicles_24_36": 1,
    "follicles_above_36": 0,
    "diagnosis": "PCOS suspected",
    ...
  }
}
```

**✅ MUST CHECK:**
- [ ] success: true
- [ ] homa_ir exists and is ~2.47
- [ ] tyg_index exists and is ~8.64
- [ ] All lipid profile fields present
- [ ] All follicle fields present
- [ ] NO symptoms field (should not exist)

---

## Step 7: Test Get All Assessments

```bash
curl http://localhost:5000/api/data \
  -H "Authorization: Bearer TOKEN"
```

**Expected:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "...",
      "age": 28,
      "homa_ir": "2.469",
      "tyg_index": "8.643",
      "total_cholesterol": 200,
      ...
    }
  ]
}
```

✅ **Pass** if all fields are returned

---

## Step 8: Test Statistics

```bash
curl http://localhost:5000/api/data/stats/summary \
  -H "Authorization: Bearer TOKEN"
```

**Expected:**
```json
{
  "success": true,
  "data": {
    "total_assessments": "1",
    "avg_homa_ir": "2.469",
    "min_homa_ir": "2.469",
    "max_homa_ir": "2.469",
    "avg_bmi": "24.1"
  }
}
```

---

## ✅ Backend Testing Checklist

### Database:
- [ ] users table has 7 columns
- [ ] phone column exists
- [ ] pcos_assessments has 29 columns
- [ ] Lipid profile columns exist (5)
- [ ] Follicle columns exist (5)
- [ ] symptoms column REMOVED
- [ ] Triggers exist (3 total)
- [ ] Functions exist (2 total)

### Signup:
- [ ] Can create user with phone
- [ ] Returns token
- [ ] Returns user with phone field

### Login:
- [ ] Can login with correct password
- [ ] Returns token
- [ ] Returns user with phone field

### Auth Verify:
- [ ] Token verification works
- [ ] Returns user data with phone

### Create Assessment:
- [ ] Can create with all fields
- [ ] HOMA-IR auto-calculates (~2.47 for glucose 100, insulin 10)
- [ ] TYG Index auto-calculates (~8.64 for triglycerides 150, glucose 100)
- [ ] All lipid fields save
- [ ] All follicle fields save
- [ ] No symptoms field in response

### Get Assessments:
- [ ] Returns all user assessments
- [ ] All fields present
- [ ] Auto-calculated fields correct

### Statistics:
- [ ] Returns summary stats
- [ ] avg_homa_ir calculated

---

## 🚨 **STOP HERE IF ANY TEST FAILS**

### If Backend Tests Fail:

1. **Check Database First:**
   - Run `database/VERIFY_EVERYTHING.sql`
   - Fix issues with `database/FIX_ALL_ISSUES.sql`

2. **Check Backend Code:**
   - Verify `backend/routes/auth.js` has phone field
   - Verify `backend/routes/data.js` has all new fields

3. **Check Environment:**
   - `.env` file has correct DATABASE_URL
   - `.env` file has JWT_SECRET

4. **Restart Backend:**
   ```bash
   cd backend
   npm run dev
   ```

---

## ✅ **ALL BACKEND TESTS PASS?**

**ONLY THEN:**
1. Start frontend
2. Test UI matches backend
3. All forms work correctly

---

**Testing Order:**
1. ✅ Database structure verified
2. ✅ Backend API tested
3. ✅ All endpoints working
4. ✅ Auto-calculations working
5. → NOW safe to build/test frontend

