@echo off
echo.
echo Creating backend/.env file...
echo.

(
echo # PCOS HOMA-IQ Score Backend Environment Variables
echo # NEVER COMMIT THIS FILE TO GIT!
echo.
echo # Neon PostgreSQL Database Connection
echo DATABASE_URL=postgresql://neondb_owner:npg_Bl9kug4wxKzN@ep-weathered-paper-a1mbh5zv-pooler.ap-southeast-1.aws.neon.tech/pcos_homaiq_score?sslmode=require
echo.
echo # JWT Secret
echo JWT_SECRET=pcos_homaiq_score_super_secret_jwt_key_2024_secure_random_string
echo.
echo # Server Configuration
echo PORT=5000
echo NODE_ENV=development
) > .env

echo Created backend/.env file successfully!
echo.
echo Now you can start the backend with: npm run dev
echo.
pause

