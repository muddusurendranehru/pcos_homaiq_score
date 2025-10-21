# Database Setup Instructions

## Neon PostgreSQL Setup

1. **Create a Neon Account**
   - Visit [neon.tech](https://neon.tech)
   - Sign up for a free account

2. **Create Database**
   - Create a new project
   - Database name: `pcos_homaiq_score`
   - Copy your connection string

3. **Run Schema**
   - Connect to your Neon database using their SQL editor or any PostgreSQL client
   - Execute the SQL from `schema.sql` file
   - This will create:
     - 2 tables: `users` and `pcos_assessments`
     - UUID primary keys
     - Automatic HOMA-IR calculation trigger
     - Indexes for performance
     - Auto-update timestamps

4. **Configure Backend**
   - Copy your Neon connection string
   - Add it to `backend/.env` file:
     ```
     DATABASE_URL=your_neon_connection_string_here
     ```

## Database Schema Overview

### Table 1: users
Stores user authentication and profile information.

**Columns:**
- `id` (UUID) - Primary key
- `email` (VARCHAR) - Unique user email
- `password_hash` (VARCHAR) - Hashed password
- `full_name` (VARCHAR) - User's full name
- `created_at` (TIMESTAMP) - Account creation time
- `updated_at` (TIMESTAMP) - Last update time

### Table 2: pcos_assessments
Stores PCOS assessment data and HOMA-IR calculations.

**Columns:**
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users table
- `age` (INTEGER) - Patient age
- `weight_kg` (DECIMAL) - Weight in kilograms
- `height_cm` (DECIMAL) - Height in centimeters
- `bmi` (DECIMAL) - Body Mass Index
- `irregular_periods` (BOOLEAN) - PCOS symptom indicator
- `excess_androgen` (BOOLEAN) - PCOS symptom indicator
- `polycystic_ovaries` (BOOLEAN) - PCOS symptom indicator
- `fasting_glucose` (DECIMAL) - Fasting glucose level (mg/dL)
- `fasting_insulin` (DECIMAL) - Fasting insulin level (μU/mL)
- `homa_ir` (DECIMAL) - **Auto-calculated** HOMA-IR score
- `waist_circumference` (DECIMAL) - Waist measurement (cm)
- `blood_pressure_systolic` (INTEGER) - Systolic BP
- `blood_pressure_diastolic` (INTEGER) - Diastolic BP
- `symptoms` (TEXT) - Patient symptoms description
- `diagnosis` (TEXT) - Medical diagnosis notes
- `assessment_date` (DATE) - Date of assessment
- `created_at` (TIMESTAMP) - Record creation time
- `updated_at` (TIMESTAMP) - Last update time

## HOMA-IR Calculation

The HOMA-IR (Homeostatic Model Assessment for Insulin Resistance) is automatically calculated using the formula:

```
HOMA-IR = (Fasting Insulin × Fasting Glucose) / 405
```

This calculation happens automatically via a database trigger whenever a record is inserted or updated.

**Interpretation:**
- HOMA-IR < 1.0: Optimal insulin sensitivity
- HOMA-IR 1.0 - 1.9: Normal insulin sensitivity
- HOMA-IR 2.0 - 2.9: Early insulin resistance
- HOMA-IR ≥ 3.0: Significant insulin resistance

## Verification

After running the schema, verify the tables were created:

```sql
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check users table structure
\d users

-- Check pcos_assessments table structure
\d pcos_assessments

-- Test HOMA-IR calculation
INSERT INTO users (email, password_hash, full_name) 
VALUES ('test@example.com', 'hash', 'Test User') 
RETURNING id;

INSERT INTO pcos_assessments (user_id, fasting_glucose, fasting_insulin) 
VALUES ('user-uuid-here', 100, 10) 
RETURNING id, fasting_glucose, fasting_insulin, homa_ir;
```

## Maintenance

- The `updated_at` column is automatically updated on any record modification
- The `homa_ir` is recalculated automatically when `fasting_glucose` or `fasting_insulin` changes
- UUIDs are generated automatically for new records

