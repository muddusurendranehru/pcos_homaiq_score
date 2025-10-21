# PowerShell script to create .env file for PCOS Backend
# Run this in PowerShell: .\create-env.ps1

Write-Host "`n🔧 Creating backend/.env file...`n" -ForegroundColor Cyan

$envContent = @"
# PCOS HOMA-IQ Score Backend Environment Variables
# NEVER COMMIT THIS FILE TO GIT!

# Neon PostgreSQL Database Connection
DATABASE_URL=postgresql://neondb_owner:npg_Bl9kug4wxKzN@ep-weathered-paper-a1mbh5zv-pooler.ap-southeast-1.aws.neon.tech/pcos_homaiq_score?sslmode=require

# JWT Secret (Generate a new random string for production!)
JWT_SECRET=pcos_homaiq_score_super_secret_jwt_key_2024_secure_random_string

# Server Configuration
PORT=5000
NODE_ENV=development
"@

# Write to .env file
$envContent | Out-File -FilePath ".env" -Encoding UTF8

Write-Host "✅ Created backend/.env file successfully!`n" -ForegroundColor Green
Write-Host "📋 Contents:" -ForegroundColor Yellow
Get-Content ".env"

Write-Host "`n✅ Done! Now you can start the backend with: npm run dev`n" -ForegroundColor Green

