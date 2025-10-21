# PCOS HOMA-IQ Score - Frontend

React frontend application for PCOS assessment and HOMA-IR score tracking.

## Prerequisites

- Node.js 16+ installed
- Backend server running on http://localhost:5000
- npm or yarn package manager

## Installation

1. Navigate to frontend directory:
```bash
cd frontend
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

4. Edit `.env` file if your backend runs on a different URL:
```env
REACT_APP_API_URL=http://localhost:5000
```

## Running the Application

### Development mode:
```bash
npm start
```

The application will open at `http://localhost:3000`

### Production build:
```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Features

### 1. Authentication
- **Sign Up Page** (`/signup`)
  - Email field
  - Password field (minimum 6 characters)
  - Confirm Password field
  - Optional Full Name field
  - Email validation
  - Password matching validation
  - Auto-redirect to dashboard on success

- **Login Page** (`/login`)
  - Email field
  - Password field
  - Form validation
  - JWT token storage
  - Auto-redirect to dashboard on success

### 2. Dashboard (`/dashboard`)
Protected route that requires authentication. Features include:

#### HOMA-IR Calculator
- Interactive calculator for HOMA-IR score
- Formula: (Fasting Glucose × Fasting Insulin) / 405
- Real-time calculation
- Interpretation of results:
  - < 1.0: Optimal insulin sensitivity
  - 1.0-1.9: Normal insulin sensitivity
  - 2.0-2.9: Early insulin resistance
  - ≥ 3.0: Significant insulin resistance

#### Assessment Management
- **Create Assessment**: Add new PCOS assessment with:
  - Personal metrics (age, weight, height, BMI, waist)
  - Blood pressure (systolic/diastolic)
  - Lab values (fasting glucose, fasting insulin)
  - PCOS indicators (irregular periods, excess androgen, polycystic ovaries)
  - Symptoms and diagnosis notes
  - Assessment date
  
- **View Assessments**: Table view with:
  - Date of assessment
  - Key metrics (age, BMI, glucose, insulin)
  - Auto-calculated HOMA-IR score
  - Interpretation badge (color-coded)
  - Delete functionality

- **Statistics Summary**:
  - Total assessments count
  - Average HOMA-IR score
  - Average BMI

#### User Features
- Display user email
- Logout functionality
- Success/error notifications
- Loading states

### 3. Protected Routes
- Automatic token verification
- Redirect to login if unauthenticated
- Token stored in localStorage
- Automatic logout on token expiration

## Project Structure

```
frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/
│   │   ├── HOMAIRCalculator.js    # HOMA-IR calculator component
│   │   └── ProtectedRoute.js      # Route protection wrapper
│   ├── pages/
│   │   ├── SignupPage.js          # Sign up page
│   │   ├── LoginPage.js           # Login page
│   │   └── DashboardPage.js       # Main dashboard
│   ├── services/
│   │   └── api.js                 # API service layer
│   ├── App.js                     # Main app component
│   ├── index.js                   # Entry point
│   └── index.css                  # Global styles
├── package.json
├── .env                           # Environment variables
└── README.md                      # This file
```

## API Integration

The frontend communicates with the backend API using axios. All API calls are centralized in `src/services/api.js`.

### Authentication Flow
1. User signs up or logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in all subsequent API requests
5. Token verified on protected routes
6. Auto-logout on token expiration

### API Endpoints Used

**Auth:**
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/verify`

**Data:**
- `POST /api/data` - Create assessment
- `GET /api/data` - Get all assessments
- `GET /api/data/:id` - Get single assessment
- `PUT /api/data/:id` - Update assessment
- `DELETE /api/data/:id` - Delete assessment
- `GET /api/data/stats/summary` - Get statistics

## Styling

The application uses a custom CSS design system with:
- Gradient backgrounds
- Card-based layouts
- Responsive grid system
- Utility classes
- Color-coded badges
- Modern button styles
- Form validation styles

Colors:
- Primary: Purple gradient (#667eea to #764ba2)
- Success: Green
- Warning: Orange
- Danger: Red
- Info: Blue

## State Management

Uses React hooks for state management:
- `useState` for component state
- `useEffect` for side effects
- `useNavigate` for routing
- localStorage for token persistence

## Form Validation

Client-side validation includes:
- Email format validation
- Password length (minimum 6 characters)
- Password confirmation matching
- Required field validation
- Number range validation for metrics
- Real-time error display

## Security Features

- JWT token-based authentication
- Protected routes
- Automatic token expiration handling
- Password fields (not visible)
- CORS support
- Input validation

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API URL | http://localhost:5000 |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Cannot connect to backend
- Verify backend is running on http://localhost:5000
- Check REACT_APP_API_URL in `.env`
- Check CORS is enabled on backend

### Login not working
- Clear browser localStorage
- Check network tab for API errors
- Verify credentials are correct

### Protected routes redirecting to login
- Check if token exists in localStorage
- Verify token is valid (check backend logs)
- Token may have expired (7 days)

## Development Tips

1. **Hot Reload**: Changes auto-refresh in development
2. **Console Logging**: Errors logged to browser console
3. **Network Tab**: Use browser DevTools to debug API calls
4. **localStorage**: View stored tokens in Application tab

## Deployment

1. Build production version:
```bash
npm run build
```

2. Serve the `build/` folder using any static file server

3. Update `REACT_APP_API_URL` to production backend URL

4. Configure CORS on backend to allow your domain

## Next Steps

After frontend is working:
- Test all authentication flows
- Test CRUD operations
- Verify HOMA-IR calculations match database
- Test responsive design on mobile
- Test with multiple users
- Add loading animations
- Add data visualization (charts)
- Add export functionality (PDF/CSV)

## Support

For issues or questions, refer to the main README.md in the project root.

