# PCOS HOMA-IQ Score - Complete Setup Instructions

## 🚀 Quick Start Guide

Follow these steps in order to get your PCOS HOMA-IQ Score application up and running.

---

## Phase 1: Database Setup (Neon PostgreSQL) ✅

### Step 1: Create Neon Database

1. Go to [neon.tech](https://neon.tech) and sign in
2. Your database is already created: **pcos_homaiq_score**
3. Connection string is already configured in `backend/.env`

### Step 2: Run Database Schema

1. Open Neon SQL Editor in your browser
2. Copy the entire contents of `database/schema.sql`
3. Paste and execute in the SQL Editor
4. Verify the tables were created:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Should show: users, pcos_assessments
```

### Step 3: Verify Database Setup

Run this query to confirm everything is working:

```sql
-- Test the auto-calculation trigger
INSERT INTO users (email, password_hash, full_name) 
VALUES ('test@example.com', 'dummy_hash', 'Test User') 
RETURNING id;

-- Use the returned UUID in the next query
INSERT INTO pcos_assessments (user_id, fasting_glucose, fasting_insulin) 
VALUES ('YOUR_USER_UUID_HERE', 100, 10) 
RETURNING id, fasting_glucose, fasting_insulin, homa_ir;

-- homa_ir should be calculated automatically as 2.47
```

✅ **Phase 1 Complete!** Your database is ready.

---

## Phase 2: Backend Setup (Node.js/Express) ✅

### Step 1: Install Node.js Dependencies

```bash
cd backend
npm install
```

This will install:
- express (web framework)
- pg (PostgreSQL client)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- dotenv (environment variables)
- cors (cross-origin requests)
- express-validator (input validation)
- nodemon (development auto-reload)

### Step 2: Configure Environment Variables

The `.env` file is already created with your Neon connection string:

```env
DATABASE_URL=postgresql://neondb_owner:npg_Bl9kug4wxKzN@ep-weathered-paper-a1mbh5zv-pooler.ap-southeast-1.aws.neon.tech/pcos_homaiq_score?sslmode=require
JWT_SECRET=pcos_homaiq_super_secret_jwt_key_2025_change_in_production
PORT=5000
NODE_ENV=development
```

### Step 3: Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# OR production mode
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════════════╗
║   🏥  PCOS HOMA-IQ Score API Server                      ║
║   📡  Server running on port 5000                        ║
║   💚  Database: pcos_homaiq_score (Neon PostgreSQL)      ║
╚═══════════════════════════════════════════════════════════╝
```

### Step 4: Test Backend Endpoints

Open a new terminal and test:

```bash
# Health check
curl http://localhost:5000/health

# Expected response:
# {"success":true,"message":"PCOS HOMA-IQ Score API is running","timestamp":"..."}
```

Or use the provided `backend/test-api.http` file with REST Client extension in VS Code.

✅ **Phase 2 Complete!** Your backend is running and connected to the database.

---

## Phase 3: Frontend Setup (React)

### Step 1: Install React Dependencies

Open a **NEW terminal** (keep backend running) and:

```bash
cd frontend
npm install
```

This will install:
- react & react-dom (UI library)
- react-router-dom (routing)
- axios (HTTP client)
- lucide-react (icons)
- react-scripts (build tools)

### Step 2: Configure Frontend Environment

The `.env` file is already created:

```env
REACT_APP_API_URL=http://localhost:5000
```

### Step 3: Start Frontend Application

```bash
npm start
```

The browser should automatically open at `http://localhost:3000`

✅ **Phase 3 Complete!** Your frontend is running.

---

## 🎯 Testing the Complete Application

### Test 1: Sign Up (Create New Account)

1. Go to `http://localhost:3000`
2. You'll be redirected to `/login`
3. Click **"Sign Up"** link
4. Fill in the form:
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
   - Full Name: `Test User` (optional)
5. Click **"Sign Up"**
6. You should be redirected to the dashboard

### Test 2: Dashboard (View Statistics)

After signing up, you should see:
- Total Assessments: 0
- Average HOMA-IR: N/A
- Average BMI: N/A

### Test 3: HOMA-IR Calculator

On the dashboard, use the calculator:
1. Fasting Glucose: `100`
2. Fasting Insulin: `10`
3. Click **"Calculate HOMA-IR"**
4. Result should show: **2.47** (Early insulin resistance)

### Test 4: Create Assessment

1. Click **"New Assessment"** button
2. Fill in the form:
   - Assessment Date: (today's date)
   - Age: `28`
   - Weight: `65.5`
   - Height: `165`
   - BMI: `24.1`
   - Fasting Glucose: `95`
   - Fasting Insulin: `12.5`
   - Waist Circumference: `82`
   - BP Systolic: `120`
   - BP Diastolic: `80`
   - Check: ☑ Irregular Periods
   - Check: ☑ Polycystic Ovaries
   - Symptoms: `Irregular periods, mild acne`
   - Diagnosis: `PCOS suspected`
3. Click **"Create Assessment"**
4. Success message should appear
5. Assessment should appear in the table below
6. HOMA-IR should be auto-calculated: **2.93** (Significant IR)

### Test 5: View Assessment Data

Check the assessments table:
- Date should match your input
- Age: 28
- BMI: 24.1
- Glucose: 95
- Insulin: 12.5
- HOMA-IR: 2.93
- Status badge: "Significant IR" (red)

### Test 6: Logout and Login

1. Click **"Logout"** button
2. You should be redirected to login page
3. Log back in with:
   - Email: `test@example.com`
   - Password: `password123`
4. You should see your dashboard with the assessment you created

### Test 7: Delete Assessment

1. Click the red trash icon on an assessment
2. Confirm deletion
3. Assessment should disappear from the table
4. Statistics should update

---

## 🔍 Verification Checklist

### Database (Neon)
- [x] Database `pcos_homaiq_score` exists
- [x] Table `users` created with UUID primary key
- [x] Table `pcos_assessments` created with UUID primary key
- [x] HOMA-IR calculation trigger working
- [x] Connection from backend successful

### Backend
- [x] Server running on port 5000
- [x] Health check endpoint working
- [x] Sign up endpoint working
- [x] Login endpoint working
- [x] JWT token generation working
- [x] Protected routes require authentication
- [x] Create assessment endpoint working
- [x] Get assessments endpoint working
- [x] Delete assessment endpoint working
- [x] HOMA-IR calculated automatically in database

### Frontend
- [x] Application running on port 3000
- [x] Sign up page working
- [x] Login page working
- [x] Dashboard accessible after login
- [x] Protected routes redirect to login
- [x] HOMA-IR calculator working
- [x] Create assessment form working
- [x] Assessments table displaying data
- [x] Delete functionality working
- [x] Logout working

---

## 📂 Project Structure Overview

```
pcos_homaiq_score/
│
├── database/
│   ├── schema.sql                    # ✅ Database schema (2 tables with UUIDs)
│   └── README.md                     # Database documentation
│
├── backend/                          # ✅ Backend API (100% complete)
│   ├── config/
│   │   └── database.js               # Neon PostgreSQL connection
│   ├── middleware/
│   │   └── auth.js                   # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js                   # Sign up, login, logout endpoints
│   │   └── data.js                   # CRUD endpoints for assessments
│   ├── server.js                     # Express server
│   ├── package.json                  # Dependencies
│   ├── .env                          # ✅ Environment variables (configured)
│   └── test-api.http                 # API testing file
│
├── frontend/                         # ✅ Frontend UI (100% complete)
│   ├── public/
│   │   └── index.html                # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── HOMAIRCalculator.js   # HOMA-IR calculator component
│   │   │   └── ProtectedRoute.js     # Route protection
│   │   ├── pages/
│   │   │   ├── SignupPage.js         # ✅ Sign up (3 fields)
│   │   │   ├── LoginPage.js          # ✅ Login (2 fields)
│   │   │   └── DashboardPage.js      # ✅ Dashboard (insert, fetch, logout)
│   │   ├── services/
│   │   │   └── api.js                # API integration
│   │   ├── App.js                    # Main app
│   │   ├── index.js                  # Entry point
│   │   └── index.css                 # Styles
│   ├── package.json                  # Dependencies
│   └── .env                          # ✅ Frontend config (configured)
│
├── .cursorrules                      # ✅ Project rules and standards
├── .gitignore                        # Git ignore rules
├── README.md                         # Main documentation
└── SETUP_INSTRUCTIONS.md             # ✅ This file
```

---

## 🚨 Troubleshooting

### Backend Won't Start

**Error: "Cannot connect to database"**
- Check your DATABASE_URL in `backend/.env`
- Verify Neon database is active (check neon.tech dashboard)
- Test connection string in Neon SQL Editor

**Error: "Port 5000 already in use"**
- Change PORT in `backend/.env` to 5001
- Update `frontend/.env` REACT_APP_API_URL accordingly
- Or kill the process using port 5000

### Frontend Won't Start

**Error: "Module not found"**
- Delete `node_modules/` and `package-lock.json`
- Run `npm install` again

**Error: "Cannot connect to backend"**
- Verify backend is running on http://localhost:5000
- Check `REACT_APP_API_URL` in `frontend/.env`
- Check browser console for CORS errors

### Authentication Issues

**Token errors or auto-logout**
- Clear browser localStorage: `localStorage.clear()`
- Log in again
- Check JWT_SECRET is set in backend `.env`

**Can't access dashboard**
- Open browser DevTools > Application tab
- Check if `auth_token` exists in localStorage
- If not, log in again

---

## 🎓 Key Features Implemented

### ✅ Database (Neon PostgreSQL)
- 2 tables with UUID primary keys
- Automatic HOMA-IR calculation via trigger
- Timestamps auto-update
- Foreign key relationships

### ✅ Backend API
- RESTful endpoints
- JWT authentication
- Password hashing (bcrypt)
- Input validation
- Protected routes
- Error handling
- CORS enabled

### ✅ Frontend React App
- Sign Up page (email, password, confirm password)
- Login page (email, password)
- Protected dashboard
- HOMA-IR calculator
- Assessment form (insert data)
- Assessment table (fetch data)
- Logout functionality
- Modern UI with gradient design
- Responsive layout

### ✅ Security
- JWT tokens (7-day expiration)
- Password hashing
- Protected routes
- Token verification
- SQL injection prevention (parameterized queries)

---

## 📱 Next Steps

1. **Test thoroughly** with multiple users and assessments
2. **Deploy** to production:
   - Backend: Vercel, Railway, or Heroku
   - Frontend: Vercel, Netlify, or GitHub Pages
   - Update environment variables for production
3. **Add features**:
   - Data visualization (charts for HOMA-IR trends)
   - Export to PDF/CSV
   - User profile management
   - Email notifications
   - Password reset functionality
   - Assessment history graphs

---

## 📞 Support

- **Database Issues**: Check `database/README.md`
- **Backend Issues**: Check `backend/README.md`
- **Frontend Issues**: Check `frontend/README.md`
- **API Testing**: Use `backend/test-api.http`

---

## 🎉 Congratulations!

You've successfully set up the complete PCOS HOMA-IQ Score application following the **Database First → Backend First → Frontend** approach!

### What You've Built:
✅ Neon PostgreSQL database with 2 tables (UUID primary keys)  
✅ Node.js/Express backend with authentication  
✅ React frontend with modern UI  
✅ Complete authentication flow  
✅ CRUD operations for PCOS assessments  
✅ Automatic HOMA-IR calculation  
✅ Protected routes and middleware  

### Technology Stack:
- **Database**: Neon PostgreSQL (serverless)
- **Backend**: Node.js, Express, JWT, bcrypt
- **Frontend**: React, React Router, Axios
- **Authentication**: JWT tokens with Bearer authorization
- **Deployment Ready**: Environment variables configured

**Enjoy your application! 🚀**

