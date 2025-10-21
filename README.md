# PCOS HOMA-IQ Score Application 🏥

A comprehensive full-stack application for PCOS (Polycystic Ovary Syndrome) assessment and HOMA-IR (Homeostatic Model Assessment for Insulin Resistance) score calculation.

[![Database](https://img.shields.io/badge/Database-Neon_PostgreSQL-green)](https://neon.tech)
[![Backend](https://img.shields.io/badge/Backend-Node.js_Express-blue)](https://expressjs.com)
[![Frontend](https://img.shields.io/badge/Frontend-React-61dafb)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 Project Overview

This application helps healthcare professionals and patients track PCOS assessments and automatically calculate HOMA-IR scores for insulin resistance monitoring. Built following industry best practices with a **Database First → Backend First → Frontend** approach.

### Key Features ✨

- ✅ **User Authentication** - Secure sign up, login, and JWT-based session management
- ✅ **PCOS Assessment Tracking** - Record comprehensive patient data including:
  - Physical metrics (age, weight, height, BMI, waist circumference)
  - Vital signs (blood pressure)
  - Lab values (fasting glucose, fasting insulin)
  - PCOS indicators (irregular periods, excess androgen, polycystic ovaries)
- ✅ **Automatic HOMA-IR Calculation** - Database-level trigger calculates insulin resistance
- ✅ **Interactive Calculator** - Real-time HOMA-IR calculator with interpretation
- ✅ **Data Visualization** - View all assessments in an organized table format
- ✅ **Statistics Dashboard** - Track average HOMA-IR, BMI, and total assessments
- ✅ **Protected Routes** - Middleware-based authentication for secure data access
- ✅ **UUID Primary Keys** - Enhanced security with universally unique identifiers

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

Run all servers with one command:

```powershell
.\start-all.ps1
```

This will open two PowerShell windows:
- **Backend** running on http://localhost:5000
- **Frontend** running on http://localhost:3000

### Option 2: Manual Setup

1. **Setup Database** (see `SETUP_INSTRUCTIONS.md`)
   - Already configured with your Neon PostgreSQL connection
   - Run `database/schema.sql` in Neon SQL Editor

2. **Start Backend**
   ```powershell
   .\start-backend.ps1
   ```
   Or manually:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Start Frontend**
   ```powershell
   .\start-frontend.ps1
   ```
   Or manually:
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Open Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

📖 **For detailed setup instructions, see [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)**

## 📂 Project Structure

```
pcos_homaiq_score/
│
├── 📁 database/                      # Database schema and docs
│   ├── schema.sql                    # PostgreSQL schema (2 tables with UUIDs)
│   └── README.md                     # Database documentation
│
├── 📁 backend/                       # Node.js/Express API
│   ├── config/
│   │   └── database.js               # Neon PostgreSQL connection
│   ├── middleware/
│   │   └── auth.js                   # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js                   # Authentication endpoints
│   │   └── data.js                   # CRUD endpoints for assessments
│   ├── server.js                     # Express server entry point
│   ├── package.json
│   ├── .env                          # Environment variables (configured)
│   └── README.md
│
├── 📁 frontend/                      # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── HOMAIRCalculator.js   # HOMA-IR calculator
│   │   │   └── ProtectedRoute.js     # Route protection
│   │   ├── pages/
│   │   │   ├── SignupPage.js         # Sign up (3 fields)
│   │   │   ├── LoginPage.js          # Login (2 fields)
│   │   │   └── DashboardPage.js      # Main dashboard
│   │   ├── services/
│   │   │   └── api.js                # API integration layer
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── .env                          # Frontend config (configured)
│   └── README.md
│
├── .cursorrules                      # Project coding standards
├── .gitignore
├── README.md                         # This file
├── SETUP_INSTRUCTIONS.md             # Detailed setup guide
├── start-backend.ps1                 # Backend startup script
├── start-frontend.ps1                # Frontend startup script
└── start-all.ps1                     # Start both servers
```

## 🗄️ Database Schema

### Table 1: `users` (Authentication)
- `id` - UUID (Primary Key, auto-generated)
- `email` - Unique email address
- `password_hash` - Bcrypt hashed password
- `full_name` - User's full name
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### Table 2: `pcos_assessments` (Assessment Data)
- `id` - UUID (Primary Key, auto-generated)
- `user_id` - UUID (Foreign Key → users.id)
- `age` - Patient age
- `weight_kg` - Weight in kilograms
- `height_cm` - Height in centimeters
- `bmi` - Body Mass Index
- `irregular_periods` - Boolean indicator
- `excess_androgen` - Boolean indicator
- `polycystic_ovaries` - Boolean indicator
- `fasting_glucose` - Fasting glucose (mg/dL)
- `fasting_insulin` - Fasting insulin (μU/mL)
- `homa_ir` - **Auto-calculated** HOMA-IR score
- `waist_circumference` - Waist measurement (cm)
- `blood_pressure_systolic` - Systolic BP
- `blood_pressure_diastolic` - Diastolic BP
- `symptoms` - Patient symptoms (text)
- `diagnosis` - Medical diagnosis notes (text)
- `assessment_date` - Date of assessment
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

**Special Features:**
- ✅ HOMA-IR calculated automatically via database trigger
- ✅ Formula: `(Fasting Insulin × Fasting Glucose) / 405`
- ✅ Timestamps auto-update on changes
- ✅ UUID v4 for enhanced security

## 🔧 Tech Stack

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.x
- **Database**: Neon PostgreSQL (Serverless)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: cors middleware

### Frontend
- **Library**: React 18
- **Routing**: React Router DOM 6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Create React App

### Database
- **Provider**: Neon (Serverless PostgreSQL)
- **Features**: UUID primary keys, triggers, functions
- **Connection**: SSL-enabled connection pooling

## 🔐 Security Features

- ✅ JWT token-based authentication (7-day expiration)
- ✅ Bcrypt password hashing (10 salt rounds)
- ✅ Protected API routes with middleware
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configuration
- ✅ Input validation on both frontend and backend
- ✅ UUID primary keys (non-sequential IDs)
- ✅ Password confirmation matching
- ✅ Token verification on protected routes

## 📊 HOMA-IR Calculation

### Formula
```
HOMA-IR = (Fasting Insulin × Fasting Glucose) / 405
```

### Interpretation
| HOMA-IR Value | Interpretation |
|---------------|----------------|
| < 1.0 | Optimal insulin sensitivity |
| 1.0 - 1.9 | Normal insulin sensitivity |
| 2.0 - 2.9 | Early insulin resistance |
| ≥ 3.0 | Significant insulin resistance |

The calculation is performed **automatically in the database** using a PostgreSQL trigger whenever assessment data is inserted or updated.

## 🎨 User Interface

### Sign Up Page
- Email input with validation
- Password input (min 6 characters)
- Confirm password input with matching validation
- Optional full name field
- Real-time error display

### Login Page
- Email input
- Password input
- Auto-redirect to dashboard on success
- Error handling and display

### Dashboard
- **Statistics Cards**: Total assessments, average HOMA-IR, average BMI
- **HOMA-IR Calculator**: Interactive calculator with real-time results
- **Assessment Form**: Comprehensive data entry form with all fields
- **Assessments Table**: View all assessments with color-coded status badges
- **Actions**: Delete assessments, logout functionality

## 🧪 Testing

### Backend API Testing

Use the provided `backend/test-api.http` file with REST Client extension:

```http
### Health Check
GET http://localhost:5000/health

### Sign Up
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

### Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### Manual Testing Checklist

- [ ] Sign up with new email
- [ ] Login with created account
- [ ] Access dashboard (should show empty state)
- [ ] Use HOMA-IR calculator
- [ ] Create new assessment
- [ ] View assessment in table
- [ ] Check HOMA-IR auto-calculation
- [ ] Delete assessment
- [ ] Logout and login again
- [ ] Verify data persists

## 📈 API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify` - Verify JWT token

### Protected Endpoints (Require Authentication)
- `POST /api/data` - Create assessment
- `GET /api/data` - Get all user assessments
- `GET /api/data/:id` - Get single assessment
- `PUT /api/data/:id` - Update assessment
- `DELETE /api/data/:id` - Delete assessment
- `GET /api/data/stats/summary` - Get statistics

**All protected endpoints require:**
```
Authorization: Bearer <jwt_token>
```

## 🚀 Deployment

### Backend Deployment (Railway/Heroku/Vercel)
1. Set environment variables:
   - `DATABASE_URL` - Your Neon connection string
   - `JWT_SECRET` - Strong secret key
   - `NODE_ENV=production`
2. Deploy backend code
3. Note the backend URL

### Frontend Deployment (Vercel/Netlify)
1. Update `REACT_APP_API_URL` to backend URL
2. Build: `npm run build`
3. Deploy `build/` folder
4. Update CORS settings on backend

## 🤝 Contributing

This project follows specific coding standards defined in `.cursorrules`:
- Database First approach
- Backend completed before frontend
- UUID primary keys only
- Comprehensive error handling
- Input validation on both ends

## 📄 License

MIT License - feel free to use this project for your needs.

## 👨‍⚕️ Medical Disclaimer

This application is for educational and tracking purposes only. Always consult with healthcare professionals for medical diagnosis and treatment decisions.

## 📞 Support

- **Setup Issues**: See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)
- **Database Help**: See `database/README.md`
- **Backend Help**: See `backend/README.md`
- **Frontend Help**: See `frontend/README.md`

---

**Built with ❤️ for PCOS awareness and health tracking**

GitHub: https://github.com/muddusurendranehru/pcos_homaiq_score

