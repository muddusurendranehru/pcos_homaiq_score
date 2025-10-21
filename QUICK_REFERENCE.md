# PCOS HOMA-IQ Score - Quick Reference Card

## 🚀 Getting Started (3 Steps)

### Step 1: Setup Database
1. Open https://neon.tech
2. Go to SQL Editor
3. Copy and paste contents of `database/schema.sql`
4. Click "Run"
5. ✅ Done! (Connection already configured in `backend/.env`)

### Step 2: Start Backend
```powershell
.\start-backend.ps1
```
Or manually:
```bash
cd backend
npm install
npm run dev
```
✅ Backend running at http://localhost:5000

### Step 3: Start Frontend
```powershell
.\start-frontend.ps1
```
Or manually:
```bash
cd frontend
npm install
npm start
```
✅ Frontend running at http://localhost:3000

---

## 🎯 Quick Commands

| Action | Command |
|--------|---------|
| Start both servers | `.\start-all.ps1` |
| Start backend only | `.\start-backend.ps1` |
| Start frontend only | `.\start-frontend.ps1` |
| Install backend deps | `cd backend && npm install` |
| Install frontend deps | `cd frontend && npm install` |
| Run backend dev | `cd backend && npm run dev` |
| Run frontend dev | `cd frontend && npm start` |

---

## 📱 Application URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React app |
| Backend | http://localhost:5000 | Express API |
| Health Check | http://localhost:5000/health | API status |

---

## 🔑 API Endpoints Cheat Sheet

### Public (No Auth)
```
GET  /health                    - Health check
POST /api/auth/signup          - Sign up
POST /api/auth/login           - Login
POST /api/auth/logout          - Logout
GET  /api/auth/verify          - Verify token
```

### Protected (Requires Auth Header)
```
POST   /api/data                - Create assessment
GET    /api/data                - Get all assessments
GET    /api/data/:id            - Get one assessment
PUT    /api/data/:id            - Update assessment
DELETE /api/data/:id            - Delete assessment
GET    /api/data/stats/summary  - Get statistics
```

**Auth Header Format:**
```
Authorization: Bearer <your_jwt_token>
```

---

## 🧪 Testing Flow

### 1. Sign Up
- Go to http://localhost:3000
- Click "Sign Up"
- Enter email, password, confirm password
- Submit → Auto-login to dashboard

### 2. Create Assessment
- Click "New Assessment"
- Fill in the form:
  - Required: None (all optional)
  - Recommended: Age, Weight, Height, Glucose, Insulin
- Click "Create Assessment"
- HOMA-IR calculated automatically

### 3. View Data
- See assessments in table
- Check HOMA-IR score
- View color-coded status

### 4. Use Calculator
- Scroll to HOMA-IR Calculator
- Enter Glucose: 100
- Enter Insulin: 10
- Click "Calculate"
- Result: 2.47 (Early IR)

### 5. Logout & Login
- Click "Logout"
- Login with same credentials
- Data persists

---

## 📊 HOMA-IR Quick Reference

### Formula
```
HOMA-IR = (Glucose × Insulin) / 405
```

### Interpretation
| Score | Status | Badge Color |
|-------|--------|-------------|
| < 1.0 | Optimal | Green |
| 1.0-1.9 | Normal | Green |
| 2.0-2.9 | Early IR | Orange |
| ≥ 3.0 | Significant IR | Red |

---

## 🗄️ Database Tables

### Table 1: `users`
```sql
id             UUID (PK)
email          VARCHAR (UNIQUE)
password_hash  VARCHAR
full_name      VARCHAR
created_at     TIMESTAMP
updated_at     TIMESTAMP
```

### Table 2: `pcos_assessments`
```sql
id                        UUID (PK)
user_id                   UUID (FK → users.id)
age                       INTEGER
weight_kg                 DECIMAL
height_cm                 DECIMAL
bmi                       DECIMAL
irregular_periods         BOOLEAN
excess_androgen           BOOLEAN
polycystic_ovaries        BOOLEAN
fasting_glucose           DECIMAL
fasting_insulin           DECIMAL
homa_ir                   DECIMAL (AUTO-CALCULATED!)
waist_circumference       DECIMAL
blood_pressure_systolic   INTEGER
blood_pressure_diastolic  INTEGER
symptoms                  TEXT
diagnosis                 TEXT
assessment_date           DATE
created_at                TIMESTAMP
updated_at                TIMESTAMP
```

---

## 🔧 Configuration Files

### Backend `.env`
```env
DATABASE_URL=postgresql://...    # Neon connection
JWT_SECRET=your_secret          # JWT signing key
PORT=5000                       # Server port
NODE_ENV=development            # Environment
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Node.js installed
node --version

# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend won't start
```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Can't login / Token errors
```javascript
// Clear browser storage
localStorage.clear()
// Then refresh and try again
```

### Database connection fails
1. Check `backend/.env` has correct DATABASE_URL
2. Verify Neon database is active at https://neon.tech
3. Check SQL was run in Neon SQL Editor

### Port already in use
```bash
# Change port in backend/.env
PORT=5001

# Update frontend/.env
REACT_APP_API_URL=http://localhost:5001
```

---

## 📚 Documentation Links

| Document | Purpose |
|----------|---------|
| README.md | Project overview |
| SETUP_INSTRUCTIONS.md | Detailed setup |
| PROJECT_COMPLETION_SUMMARY.md | What's built |
| QUICK_REFERENCE.md | This file |
| database/README.md | Database docs |
| backend/README.md | Backend docs |
| frontend/README.md | Frontend docs |

---

## 🧪 Test with curl

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","confirmPassword":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Create Assessment (replace TOKEN)
```bash
curl -X POST http://localhost:5000/api/data \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"age":28,"fasting_glucose":100,"fasting_insulin":10}'
```

### Get Assessments (replace TOKEN)
```bash
curl http://localhost:5000/api/data \
  -H "Authorization: Bearer TOKEN"
```

---

## 🎯 Project Structure (Simplified)

```
pcos_homaiq_score/
├── database/schema.sql        ← Run this in Neon
├── backend/                   ← API Server
│   ├── .env                   ← Already configured
│   └── npm run dev            ← Start command
├── frontend/                  ← React App
│   ├── .env                   ← Already configured
│   └── npm start              ← Start command
└── start-all.ps1              ← Start everything
```

---

## ✅ Success Checklist

After setup, verify:
- [ ] Backend shows "Server running on port 5000"
- [ ] Frontend opens at http://localhost:3000
- [ ] Can sign up with new email
- [ ] Can login with created account
- [ ] Dashboard loads with stats cards
- [ ] Can create new assessment
- [ ] HOMA-IR calculated automatically
- [ ] Assessment appears in table
- [ ] Can delete assessment
- [ ] Can logout and login again

---

## 🎉 You're Ready!

**Frontend**: http://localhost:3000  
**Backend**: http://localhost:5000  

**Default Test User**:
- Email: `test@example.com`
- Password: `password123`

**Need help?** Check `SETUP_INSTRUCTIONS.md`

---

**Happy tracking! 🏥💚**

