# 🌐 Browser Testing Guide - No PowerShell/Curl Needed!

## 🚀 **Starting the Application**

### **Step 1: Start Backend**
```bash
cd backend
npm run dev
```
**Wait for:** Server running message

---

### **Step 2: Start Frontend** (New Terminal)
```bash
cd frontend
npm start
```
**Wait for:** Browser opens automatically at http://localhost:3038

---

## 🧪 **Browser Testing - No Commands Needed!**

### **Test 1: Backend Health Check**
Open browser and go to:
```
http://localhost:5000/health
```

**You should see:**
```json
{
  "success": true,
  "message": "PCOS HOMA-IQ Score API is running",
  "timestamp": "2025-10-20T..."
}
```

✅ **Backend is working!**

---

### **Test 2: Frontend Loads**
Browser should auto-open to:
```
http://localhost:3038
```

**You should see:**
- Login page with PCOS HOMA-IQ logo
- Email and Password fields
- "Sign Up" link

✅ **Frontend is working!**

---

## 🎯 **Complete User Testing Flow**

### **Test 3: Sign Up**
1. Click **"Sign Up"** link
2. You'll see form with:
   - Email
   - Phone Number (optional) ← NEW!
   - Full Name (optional)
   - Password
   - Confirm Password

3. Fill in:
   - Email: `test@example.com`
   - Phone: `+919876543210`
   - Password: `password123`
   - Confirm: `password123`

4. Click **"Sign Up"**

**✅ Should:**
- Show success message
- Redirect to Dashboard
- See your email at top

---

### **Test 4: Create Assessment**
1. Click **"New Assessment"** button
2. Scroll through form - you should see:

**Basic Info:**
- Age
- Weight (kg)
- Height (cm)
- BMI
- Waist Circumference

**Lab Values:**
- Fasting Glucose
- Fasting Insulin

**Lipid Profile:** ← NEW!
- Total Cholesterol
- LDL Cholesterol
- HDL Cholesterol
- Triglycerides

**Follicle Data:** ← NEW!
- Total Follicles
- Follicles 0-12mm
- Follicles 12-24mm
- Follicles 24-36mm
- Follicles Above 36mm

**PCOS Indicators:**
- ☐ Irregular Periods
- ☐ Excess Androgen
- ☐ Polycystic Ovaries

**Additional:**
- Blood Pressure Systolic/Diastolic
- Diagnosis/Notes

**NO Symptoms field** ✅ (removed as requested)

3. Fill in test data:
   - Fasting Glucose: `100`
   - Fasting Insulin: `10`
   - Triglycerides: `150`
   - Total Follicles: `15`
   - Follicles 0-12mm: `12`

4. Click **"Create Assessment"**

**✅ Should:**
- Show success message
- Assessment appears in table below
- HOMA-IR shows ~2.47 (auto-calculated)

---

### **Test 5: View Assessment**
Look at the table below form:

**Columns should show:**
- Date
- Age
- BMI
- Glucose
- Insulin
- HOMA-IR
- Status (color badge)
- Actions (delete button)

**✅ Verify:**
- Your assessment is listed
- HOMA-IR calculated correctly (~2.47)
- Status badge shows (color coded)

---

### **Test 6: HOMA-IR Calculator**
Scroll up to pink calculator section:

1. Enter:
   - Glucose: `100`
   - Insulin: `10`

2. Click **"Calculate HOMA-IR"**

**✅ Should show:**
- HOMA-IR: 2.47
- Status: "Early insulin resistance" (orange)

---

### **Test 7: Logout**
1. Click **"Logout"** button (top right)

**✅ Should:**
- Redirect to login page
- Can't access dashboard anymore

---

### **Test 8: Login Again**
1. Go to http://localhost:3038/login
2. Enter:
   - Email: `test@example.com`
   - Password: `password123`
3. Click **"Log In"**

**✅ Should:**
- Redirect to dashboard
- See your previous assessment still there
- Data persisted in database

---

## 🔍 **Quick Visual Checklist**

### **Sign Up Page (http://localhost:3038/signup):**
- [ ] Email field
- [ ] Phone field (with format hint)
- [ ] Full Name field
- [ ] Password field
- [ ] Confirm Password field
- [ ] "Sign Up" button
- [ ] "Log In" link at bottom

### **Dashboard (http://localhost:3038/dashboard):**
- [ ] User email shows at top
- [ ] Logout button
- [ ] 3 stat cards (Total Assessments, Avg HOMA-IR, Avg BMI)
- [ ] Pink HOMA-IR calculator
- [ ] "New Assessment" button
- [ ] Assessment form (when clicked)
  - [ ] All basic fields
  - [ ] Lipid profile section (4 fields)
  - [ ] Follicle data section (5 fields)
  - [ ] PCOS indicators checkboxes
  - [ ] NO symptoms field
  - [ ] Diagnosis field present
- [ ] Assessments table
- [ ] Delete buttons work

---

## 🎯 **Ports Reference**

| Service | Port | URL |
|---------|------|-----|
| Backend | 5000 | http://localhost:5000 |
| Frontend | 3038 | http://localhost:3038 |
| Health Check | 5000 | http://localhost:5000/health |

---

## 🚨 **Common Issues**

### **Backend Won't Start**
- Check `.env` file exists in backend folder
- Check `DATABASE_URL` is set correctly

### **Frontend Won't Start**
- Run `npm install` in frontend folder
- Check backend is running first

### **Can't Login**
- Check backend console for errors
- Verify you signed up first
- Check browser console (F12) for errors

### **Assessment Form Missing Fields**
- Refresh page (Ctrl + F5)
- Check browser console for errors
- Verify backend is running

---

## ✅ **Success Criteria**

**All working if:**
1. ✅ Backend health check shows JSON
2. ✅ Can sign up with phone number
3. ✅ Can login
4. ✅ Dashboard loads with calculator
5. ✅ Can create assessment with all new fields
6. ✅ HOMA-IR auto-calculates
7. ✅ Assessment appears in table
8. ✅ Can logout and login again
9. ✅ Data persists

---

## 🎊 **Testing Complete!**

**If all 9 steps pass → Application is 100% ready!** 🚀

No PowerShell or curl commands needed - just use your browser!

