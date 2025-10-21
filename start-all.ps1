# PowerShell script to start both backend and frontend

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  PCOS HOMA-IQ Score - Full Stack Startup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This will start both backend and frontend servers." -ForegroundColor Yellow
Write-Host ""

# Start backend in a new window
Write-Host "Starting backend server in new window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-File", "start-backend.ps1"
Write-Host "✓ Backend starting..." -ForegroundColor Green

# Wait a bit for backend to start
Write-Host "Waiting 5 seconds for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start frontend in a new window
Write-Host "Starting frontend application in new window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-File", "start-frontend.ps1"
Write-Host "✓ Frontend starting..." -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "  Both servers are starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "The frontend will open automatically in your browser." -ForegroundColor Yellow
Write-Host "Close the PowerShell windows to stop the servers." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

