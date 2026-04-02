#!/usr/bin/env pwsh

Write-Host "🚀 YOKINA CAFE - SETUP SCRIPT (PowerShell)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Blue
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 16+ first." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Setup Backend
Write-Host "Setting up Backend..." -ForegroundColor Blue
Set-Location backend
Write-Host "Installing dependencies..."
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "✅ Backend .env created (please edit with your MySQL credentials)" -ForegroundColor Green
}

Set-Location ..
Write-Host ""

# Setup Frontend
Write-Host "Setting up Frontend..." -ForegroundColor Blue
Set-Location frontend
Write-Host "Installing dependencies..."
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "✅ Frontend .env created" -ForegroundColor Green
}

Set-Location ..
Write-Host ""

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit backend\.env with your MySQL credentials"
Write-Host "2. Create database: mysql -u root -p < backend\database.sql"
Write-Host "3. Run backend: cd backend && npm run dev"
Write-Host "4. Run frontend: cd frontend && npm run dev"
