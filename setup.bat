@echo off
echo 🚀 YOKINA CAFE - SETUP SCRIPT (Windows)
echo =====================================
echo.

REM Check Node.js
echo Checking Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)
echo ✅ Node.js found
echo.

REM Setup Backend
echo Setting up Backend...
cd backend
echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Backend installation failed
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed

if not exist .env (
    copy .env.example .env
    echo ✅ Backend .env created ^(edit with your MySQL credentials^)
)

cd ..
echo.

REM Setup Frontend
echo Setting up Frontend...
cd frontend
echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Frontend installation failed
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed

if not exist .env (
    copy .env.example .env
    echo ✅ Frontend .env created
)

cd ..
echo.

echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Edit backend\.env with your MySQL credentials
echo 2. Create database: mysql -u root -p ^< backend\database.sql
echo 3. Run backend: cd backend ^&^& npm run dev
echo 4. Run frontend: cd frontend ^&^& npm run dev
echo.
pause
