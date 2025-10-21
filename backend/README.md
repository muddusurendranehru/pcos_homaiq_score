# PCOS HOMA-IQ Score - Backend API

Node.js/Express backend API for PCOS assessment and HOMA-IR score calculation.

## Prerequisites

- Node.js 16+ installed
- Neon PostgreSQL database set up (see `../database/README.md`)
- npm or yarn package manager

## Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
# Copy from example
cp .env.example .env
```

4. Edit `.env` file with your credentials:
```env
DATABASE_URL=postgresql://username:password@host/pcos_homaiq_score?sslmode=require
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Health Check
```
GET /health
```
Returns server status.

#### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "fullName": "John Doe" (optional)
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Returns JWT token for authenticated requests.

#### Logout
```
POST /api/auth/logout
```
Client should remove token from storage.

#### Verify Token
```
GET /api/auth/verify
Authorization: Bearer <token>
```

### Protected Endpoints (Authentication Required)

All protected endpoints require the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

#### Create Assessment
```
POST /api/data
Content-Type: application/json

{
  "age": 28,
  "weight_kg": 65.5,
  "height_cm": 165,
  "bmi": 24.1,
  "irregular_periods": true,
  "excess_androgen": false,
  "polycystic_ovaries": true,
  "fasting_glucose": 95.0,
  "fasting_insulin": 12.5,
  "waist_circumference": 82.0,
  "blood_pressure_systolic": 120,
  "blood_pressure_diastolic": 80,
  "symptoms": "Irregular periods, mild acne",
  "diagnosis": "PCOS suspected",
  "assessment_date": "2025-10-20"
}
```

#### Get All Assessments
```
GET /api/data
```

#### Get Single Assessment
```
GET /api/data/:id
```

#### Update Assessment
```
PUT /api/data/:id
Content-Type: application/json

{
  "symptoms": "Updated symptoms",
  "diagnosis": "Confirmed PCOS"
}
```

#### Delete Assessment
```
DELETE /api/data/:id
```

#### Get Statistics Summary
```
GET /api/data/stats/summary
```

## Testing

Use the provided `test-api.http` file with REST Client extension in VS Code, or use tools like Postman, Insomnia, or curl.

### Example with curl:

```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","confirmPassword":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get assessments (replace TOKEN with actual token from login)
curl http://localhost:5000/api/data \
  -H "Authorization: Bearer TOKEN"
```

## Project Structure

```
backend/
├── config/
│   └── database.js       # Database connection and helpers
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── routes/
│   ├── auth.js          # Authentication endpoints
│   └── data.js          # Data CRUD endpoints
├── server.js            # Main server entry point
├── package.json         # Dependencies
├── .env.example         # Environment variables template
└── README.md           # This file
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: 7-day expiration
- **Input Validation**: express-validator
- **SQL Injection Protection**: Parameterized queries
- **CORS**: Enabled for frontend communication
- **UUID Primary Keys**: Enhanced security

## Error Handling

All endpoints return consistent JSON responses:

### Success Response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] (optional validation errors)
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | Neon PostgreSQL connection string | Yes |
| JWT_SECRET | Secret key for JWT token signing | Yes |
| PORT | Server port (default: 5000) | No |
| NODE_ENV | Environment (development/production) | No |

## Database

Uses Neon PostgreSQL with 2 tables:
- `users` - Authentication and user profiles
- `pcos_assessments` - PCOS assessment data with auto-calculated HOMA-IR

See `../database/README.md` for database setup instructions.

## Troubleshooting

### Cannot connect to database
- Verify DATABASE_URL in `.env`
- Check Neon database is active
- Ensure SSL mode is set correctly

### JWT token errors
- Verify JWT_SECRET is set in `.env`
- Check token expiration (7 days)
- Ensure Authorization header format: `Bearer <token>`

### Port already in use
- Change PORT in `.env`
- Or kill process using port 5000

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET
3. Enable HTTPS
4. Set up proper CORS origins
5. Use environment variables for all secrets
6. Enable rate limiting (recommended)
7. Set up logging and monitoring

## Support

For issues or questions, refer to the main README.md in the project root.

