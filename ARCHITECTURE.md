# 🏗️ PCOS HOMA-IQ Score - System Architecture

## 📊 **High-Level Architecture**

```
┌───────────────────────────────────────────────────────────────────────┐
│                           USER BROWSER                                 │
│  React App (SPA) - http://localhost:3038 or Render Static Site       │
│                                                                        │
│  Components:                                                           │
│  ├── SignupPage     → Create account                                 │
│  ├── LoginPage      → Authenticate                                   │
│  ├── DashboardPage  → Main app interface                            │
│  │   ├── HOMAIRCalculator                                            │
│  │   ├── BMICalculator                                               │
│  │   ├── TyGCalculator                                               │
│  │   └── PCOSScoreAnalyzer (100-point scoring system)               │
│  └── ProtectedRoute → JWT validation                                │
└───────────────────────┬───────────────────────────────────────────────┘
                        │
                        │ HTTP/HTTPS Requests
                        │ (Axios with JWT Bearer Token)
                        │
                        ↓
┌───────────────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS BACKEND SERVER                          │
│  Node.js + Express - http://localhost:5000 or Render Web Service     │
│                                                                        │
│  Middleware Stack:                                                     │
│  ├── CORS Middleware     → Cross-origin requests                     │
│  ├── JSON Body Parser    → Parse request bodies                      │
│  ├── Auth Middleware     → JWT token verification                    │
│  └── Error Handler       → Centralized error handling                │
│                                                                        │
│  Routes:                                                               │
│  ├── /api/auth/signup    → User registration (bcrypt hash)           │
│  ├── /api/auth/login     → User authentication (JWT generation)      │
│  ├── /api/auth/logout    → Session termination                       │
│  ├── /api/auth/verify    → Token validation                          │
│  ├── /api/data           → CRUD for PCOS assessments (protected)     │
│  └── /health             → Server health check                       │
│                                                                        │
│  Database Module (pg):                                                │
│  └── Connection Pool     → Reuse DB connections (max 10)             │
└───────────────────────┬───────────────────────────────────────────────┘
                        │
                        │ SQL Queries
                        │ (Parameterized to prevent SQL injection)
                        │
                        ↓
┌───────────────────────────────────────────────────────────────────────┐
│                    NEON POSTGRESQL DATABASE                           │
│  Serverless PostgreSQL - Neon.tech                                   │
│                                                                        │
│  Tables:                                                               │
│  ├── users (7 columns)                                                │
│  │   ├── id (UUID, PK)                                               │
│  │   ├── email (VARCHAR, UNIQUE)                                     │
│  │   ├── password (VARCHAR, bcrypt hashed)                          │
│  │   ├── full_name (VARCHAR)                                         │
│  │   ├── phone (VARCHAR)                                             │
│  │   ├── created_at (TIMESTAMP)                                      │
│  │   └── updated_at (TIMESTAMP)                                      │
│  │                                                                    │
│  └── pcos_assessments (43 columns)                                   │
│      ├── id (UUID, PK)                                               │
│      ├── user_id (UUID, FK → users.id)                              │
│      ├── age, weight_kg, height_cm, bmi                             │
│      ├── fasting_glucose, fasting_insulin                           │
│      ├── homa_ir (auto-calculated by trigger) ✨                    │
│      ├── tyg_index (auto-calculated by trigger) ✨                  │
│      ├── lh, fsh, lh_fsh_ratio (auto-calculated) ✨                │
│      ├── testosterone_total, dhea, dhea_s                           │
│      ├── ovary_volume, follicle_size, total_follicles              │
│      ├── family_history_* (4 boolean columns)                       │
│      ├── pcos_score, pcos_risk_level                                │
│      ├── diagnosis (TEXT)                                            │
│      ├── created_at, updated_at (TIMESTAMP)                         │
│      └── ...and more                                                 │
│                                                                        │
│  Triggers:                                                             │
│  └── calculate_indices() → Auto-calculate on INSERT/UPDATE          │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 **Request Flow: User Saves PCOS Assessment**

```
┌─────────────┐
│   Browser   │
│  (React)    │
└──────┬──────┘
       │
       │ 1. User fills form and clicks "Save"
       │
       ↓
┌─────────────────────────────────────────────────────────────────┐
│  React Component (PCOSScoreAnalyzer.js)                         │
│  ─────────────────────────────────────────────────────────────  │
│  • Validates form data (age, weight, height, etc.)             │
│  • Auto-calculates BMI: weight / (height/100)²                 │
│  • Calculates PCOS Score (100-point system)                    │
│  • Formats data as JSON                                         │
│  • Adds JWT token from localStorage                            │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ 2. HTTP POST request
                      │    URL: /api/data
                      │    Headers: { Authorization: "Bearer <JWT>" }
                      │    Body: { age: 30, weight_kg: 65, ... }
                      │
                      ↓
┌─────────────────────────────────────────────────────────────────┐
│  Express Backend (routes/data.js)                               │
│  ─────────────────────────────────────────────────────────────  │
│  • STEP 1: Auth Middleware checks JWT token                    │
│    ├─ Valid? → Continue                                         │
│    └─ Invalid? → Return 401 Unauthorized                       │
│                                                                  │
│  • STEP 2: express-validator validates data                    │
│    ├─ age: between 1-120                                        │
│    ├─ weight_kg: positive number                               │
│    └─ fasting_glucose: positive number                         │
│                                                                  │
│  • STEP 3: Extract user ID from JWT                            │
│    const userId = req.user.id                                   │
│                                                                  │
│  • STEP 4: Build SQL INSERT query                              │
│    INSERT INTO pcos_assessments (                               │
│      user_id, age, weight_kg, ..., pcos_score                  │
│    ) VALUES ($1, $2, $3, ..., $37)                             │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ 3. Execute SQL query
                      │
                      ↓
┌─────────────────────────────────────────────────────────────────┐
│  PostgreSQL (Neon)                                              │
│  ─────────────────────────────────────────────────────────────  │
│  • STEP 1: Insert data into pcos_assessments                   │
│                                                                  │
│  • STEP 2: TRIGGER calculate_indices() fires automatically     │
│    ├─ HOMA-IR = (insulin × glucose) / 405                     │
│    ├─ TyG Index = ln((triglycerides × glucose) / 2)          │
│    └─ LH/FSH Ratio = lh / fsh                                 │
│                                                                  │
│  • STEP 3: Return inserted row with calculated values          │
│    RETURNING *                                                  │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ 4. Return success response
                      │    { success: true, data: {...} }
                      │
                      ↓
┌─────────────────────────────────────────────────────────────────┐
│  React Component                                                │
│  ─────────────────────────────────────────────────────────────  │
│  • Receives success response                                    │
│  • Shows green success message: ✅ "Assessment saved!"        │
│  • Optionally refreshes assessment list                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 **Authentication Flow**

```
┌──────────────────────────────────────────────────────────────┐
│  SIGNUP FLOW                                                  │
└──────────────────────────────────────────────────────────────┘

User enters:
  • email: test@example.com
  • password: mypassword123
  • confirmPassword: mypassword123
         ↓
Frontend validates: password === confirmPassword
         ↓
POST /api/auth/signup
         ↓
Backend:
  1. Check if email already exists
  2. Hash password with bcrypt (10 salt rounds)
     Original: "mypassword123"
     Hashed:   "$2b$10$X9h7.6k..."  (60 chars)
  3. INSERT INTO users (email, password)
  4. Return success
         ↓
Frontend: Redirect to Login page

┌──────────────────────────────────────────────────────────────┐
│  LOGIN FLOW                                                   │
└──────────────────────────────────────────────────────────────┘

User enters:
  • email: test@example.com
  • password: mypassword123
         ↓
POST /api/auth/login
         ↓
Backend:
  1. Find user by email
  2. Compare password: bcrypt.compare(input, stored_hash)
  3. Generate JWT token:
     {
       id: "uuid-here",
       email: "test@example.com",
       exp: 7 days from now
     }
     Signed with JWT_SECRET
  4. Return: { token: "eyJhbGciOiJIUzI1..." }
         ↓
Frontend:
  1. Store token in localStorage
     localStorage.setItem('token', token)
  2. Redirect to Dashboard
  3. Include token in all future requests:
     Headers: { Authorization: "Bearer <token>" }

┌──────────────────────────────────────────────────────────────┐
│  PROTECTED ROUTE ACCESS                                       │
└──────────────────────────────────────────────────────────────┘

User visits Dashboard
         ↓
React ProtectedRoute checks:
  token = localStorage.getItem('token')
  token exists? 
    ├─ Yes → GET /api/auth/verify
    │         Backend verifies JWT signature
    │         ├─ Valid → Allow access
    │         └─ Invalid → Redirect to Login
    └─ No → Redirect to Login
```

---

## 📦 **Technology Stack Details**

### **Frontend Dependencies**

```json
{
  "react": "^18.2.0",              // UI library
  "react-dom": "^18.2.0",          // DOM rendering
  "react-router-dom": "^6.20.0",   // Client-side routing
  "axios": "^1.6.2",               // HTTP client
  "lucide-react": "^0.294.0"       // Icon library
}
```

### **Backend Dependencies**

```json
{
  "express": "^4.18.2",            // Web framework
  "pg": "^8.11.3",                 // PostgreSQL driver
  "bcryptjs": "^2.4.3",            // Password hashing
  "jsonwebtoken": "^9.0.2",        // JWT authentication
  "express-validator": "^7.0.1",   // Input validation
  "cors": "^2.8.5",                // CORS middleware
  "dotenv": "^16.3.1",             // Environment variables
  "nodemon": "^3.0.2"              // Dev auto-reload
}
```

---

## 🚀 **Build & Deployment Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│  DEVELOPMENT (Local)                                         │
├─────────────────────────────────────────────────────────────┤
│  Frontend: localhost:3038    Backend: localhost:5000        │
│  ├─ npm start                 ├─ npm run dev                 │
│  ├─ React Dev Server          ├─ nodemon (auto-restart)     │
│  └─ Hot Module Reload         └─ Live debugging             │
└─────────────────────────────────────────────────────────────┘
                        │
                        │ git push origin main
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  GITHUB REPOSITORY                                           │
│  https://github.com/muddusurendranehru/pcos_homaiq_score   │
└─────────────────────────────────────────────────────────────┘
                        │
                        │ Webhook triggers
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  RENDER BUILD SYSTEM                                         │
├─────────────────────────────────────────────────────────────┤
│  BACKEND BUILD:                FRONTEND BUILD:               │
│  ├─ Clone repo                 ├─ Clone repo                │
│  ├─ cd backend                 ├─ cd frontend               │
│  ├─ npm install                ├─ npm install               │
│  ├─ Set env vars               ├─ Set env vars              │
│  └─ npm start                  ├─ npm run build             │
│                                 └─ Deploy to CDN             │
└─────────────────────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  PRODUCTION                                                  │
├─────────────────────────────────────────────────────────────┤
│  Frontend:                     Backend:                      │
│  pcos-frontend.onrender.com   pcos-backend-xxxx.onrender.com│
│  ├─ Static files on CDN       ├─ Node.js process           │
│  ├─ HTTPS enabled             ├─ HTTPS enabled             │
│  ├─ Auto-scaling              ├─ Health checks             │
│  └─ Global distribution       └─ Auto-restart on crash     │
│                                                              │
│  Database:                                                   │
│  ep-xxxx-yyyy.aws.neon.tech                                │
│  ├─ PostgreSQL 15                                           │
│  ├─ Serverless auto-scaling                                │
│  ├─ Connection pooling                                      │
│  └─ Daily backups                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 **Data Models**

### **User Model**
```typescript
interface User {
  id: string;              // UUID
  email: string;           // UNIQUE, NOT NULL
  password: string;        // bcrypt hashed
  full_name: string;       // nullable
  phone: string;           // nullable
  created_at: Date;
  updated_at: Date;
}
```

### **PCOS Assessment Model**
```typescript
interface PCOSAssessment {
  id: string;              // UUID
  user_id: string;         // FK → users.id
  
  // Basic Info
  age: number;
  weight_kg: number;
  height_cm: number;
  bmi: number;
  
  // Lab Values
  fasting_glucose: number;
  fasting_insulin: number;
  homa_ir: number;         // Auto-calculated
  tyg_index: number;       // Auto-calculated
  
  // Lipid Profile
  total_cholesterol: number;
  ldl_cholesterol: number;
  hdl_cholesterol: number;
  triglycerides: number;
  
  // Rotterdam Criteria
  lh: number;
  fsh: number;
  lh_fsh_ratio: number;    // Auto-calculated
  testosterone_total: number;
  dhea: number;
  dhea_s: number;
  
  // Ultrasound
  ovary_volume: number;
  follicle_size: number;
  total_follicles: number;
  
  // Family History
  family_history_diabetes: boolean;
  family_history_hypertension: boolean;
  family_history_atherosclerosis: boolean;
  family_history_cancer: boolean;
  
  // PCOS Score
  pcos_score: number;      // 0-100
  pcos_risk_level: string; // Low/Mild/Moderate/High/Very High
  
  // Metadata
  diagnosis: string;       // Full assessment text
  assessment_date: Date;
  created_at: Date;
  updated_at: Date;
}
```

---

## 🔒 **Security Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│  SECURITY LAYERS                                             │
├─────────────────────────────────────────────────────────────┤
│  1. HTTPS/TLS Encryption                                    │
│     └─ All traffic encrypted (Render provides free SSL)     │
│                                                              │
│  2. Password Hashing                                        │
│     └─ bcrypt with 10 salt rounds                          │
│        Never store plain text passwords                     │
│                                                              │
│  3. JWT Authentication                                       │
│     ├─ Token expires after 7 days                          │
│     ├─ Signed with secret key                              │
│     └─ Verified on every protected route                   │
│                                                              │
│  4. SQL Injection Prevention                                │
│     └─ Parameterized queries ($1, $2, ...)                │
│        Never concatenate user input in SQL                  │
│                                                              │
│  5. Input Validation                                        │
│     ├─ Frontend: React form validation                     │
│     └─ Backend: express-validator                          │
│                                                              │
│  6. CORS Protection                                         │
│     └─ Only allow requests from frontend domain            │
│                                                              │
│  7. Environment Variables                                    │
│     └─ Secrets never committed to git                      │
│                                                              │
│  8. Database SSL                                            │
│     └─ Neon enforces SSL connections                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📈 **Performance Optimizations**

### **Frontend:**
- Code splitting (lazy loading)
- Minified JavaScript & CSS
- Gzip compression
- Browser caching
- CDN delivery

### **Backend:**
- Connection pooling (10 connections)
- Stateless JWT (no session storage)
- Async/await (non-blocking I/O)
- Response compression

### **Database:**
- Indexed primary keys (UUID)
- Indexed foreign keys (user_id)
- Indexed timestamps (created_at)
- Database-level calculations (triggers)
- Connection pooling

---

## 🎓 **Summary**

This is a **modern, production-ready web application** using:
- **React** for a fast, responsive UI
- **Node.js + Express** for a scalable backend
- **PostgreSQL** for reliable data storage
- **JWT** for secure authentication
- **Render** for easy deployment

All components work together to provide a complete PCOS assessment and scoring system! 🚀

