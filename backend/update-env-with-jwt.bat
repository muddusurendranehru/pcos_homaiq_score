@echo off
echo.
echo Updating backend/.env file with new JWT Secret...
echo.

(
echo # PCOS HOMA-IQ Score Backend Environment Variables
echo # NEVER COMMIT THIS FILE TO GIT!
echo.
echo # Neon PostgreSQL Database Connection
echo DATABASE_URL=postgresql://neondb_owner:npg_Bl9kug4wxKzN@ep-weathered-paper-a1mbh5zv-pooler.ap-southeast-1.aws.neon.tech/pcos_homaiq_score?sslmode=require
echo.
echo # JWT Secret (Generated with crypto.randomBytes)
echo JWT_SECRET=fc7230ab7a185a21e0512be557eadb77786e10edebc5724994b2f5b3937220c7
echo.
echo # Server Configuration
echo PORT=5000
echo NODE_ENV=development
) > .env

echo ========================================
echo Updated backend/.env file successfully!
echo ========================================
echo.
echo Database: Connected to Neon PostgreSQL
echo JWT Secret: fc7230ab7a18... (64 chars)
echo Port: 5000
echo.
echo Now restart your backend with: npm run dev
echo.
pause

