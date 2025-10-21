# 🚀 START HERE - Simple Setup Guide

## ✅ Prerequisites Done
- [x] Database verified (29 columns)
- [x] All new fields added
- [x] Phone column exists
- [x] Symptoms removed

---

## 🎯 **3 Simple Steps**

### **Step 1: Start Backend**
Open terminal in project folder:
```bash
cd backend
npm install
npm run dev
```

**Wait for:**
```
✅ Server running on port 5000
✅ Connected to Neon PostgreSQL database
```

**Keep this terminal open!**

---

### **Step 2: Test Backend Works**
Open browser, go to:
```
http://localhost:5000/health
```

**Should see:**
```json
{"success": true, "message": "PCOS HOMA-IQ Score API is running"}
```

✅ **Backend working!**

---

### **Step 3: Start Frontend**
Open **NEW terminal**, run:
```bash
cd frontend
npm install
npm start
```

**Browser will auto-open at:**
```
http://localhost:3038
```

✅ **Frontend working!**

---

## 🎨 **What You'll See**

### **Login Page**
- PCOS HOMA-IQ logo (purple)
- Email field
- Password field
- "Sign Up" link

### **Click "Sign Up"** to create account with:
- ✅ Email
- ✅ Phone (optional) - `+919876543210` or `9876543210`
- ✅ Full Name (optional)
- ✅ Password
- ✅ Confirm Password

### **After Sign Up → Dashboard**
- Stats cards
- HOMA-IR Calculator (pink box)
- "New Assessment" button
- Assessment table

---

## 📋 **Test the New Fields**

Click **"New Assessment"** and see:

**✅ Lipid Profile (NEW):**
- Total Cholesterol
- LDL Cholesterol
- HDL Cholesterol
- Triglycerides

**✅ Follicle Data (NEW):**
- Total Follicles
- Follicles 0-12mm
- Follicles 12-24mm
- Follicles 24-36mm
- Follicles Above 36mm

**✅ No Symptoms Field** (removed as requested)

---

## 🧪 **Quick Test**

Fill in:
- Fasting Glucose: `100`
- Fasting Insulin: `10`
- Triglycerides: `150`

Click **"Create Assessment"**

**✅ Should show:**
- HOMA-IR: ~2.47 (auto-calculated)
- Assessment in table
- Success message

---

## 🌐 **Ports**

| Service | Port | URL |
|---------|------|-----|
| Backend | 5000 | http://localhost:5000 |
| Frontend | 3038 | http://localhost:3038 |

---

## 🎯 **Testing Checklist**

- [ ] Backend health check works
- [ ] Frontend loads at port 3038
- [ ] Can sign up with phone number
- [ ] Can login
- [ ] Dashboard shows calculator
- [ ] New Assessment form has lipid profile fields
- [ ] New Assessment form has follicle fields
- [ ] No symptoms field
- [ ] Can create assessment
- [ ] HOMA-IR auto-calculates
- [ ] Assessment appears in table

---

## 📖 **Full Testing Guide**

For detailed browser testing without PowerShell:
→ See **`BROWSER_TESTING.md`**

---

## 🚀 **That's It!**

1. Start backend
2. Check health endpoint
3. Start frontend
4. Sign up and test!

**No curl, no PowerShell commands - just browser!** 🎉

