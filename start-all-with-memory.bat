@echo off
echo ========================================
echo Dubai Real Estate - Full Stack Launcher
echo ========================================
echo.
echo This script will start all services:
echo - React Frontend (Port 3000)
echo - Django Backend (Port 8000) 
echo - Java Memory LLM (Port 8080)
echo - PostgreSQL Database (Port 5432)
echo.

REM Проверяем Docker
echo Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed!
    echo Please install Docker Desktop first.
    pause
    exit /b 1
)

echo Docker is available.
echo.

REM Запускаем Java Memory LLM
echo [1/4] Starting Java Memory LLM Service...
cd Java_Memory_LLM-master
call start-memory-service.bat
if %errorlevel% neq 0 (
    echo ERROR: Failed to start Memory LLM service!
    pause
    exit /b 1
)
cd ..

echo.
echo [2/4] Starting Django Backend...
cd realty-main
docker-compose up -d --build
if %errorlevel% neq 0 (
    echo ERROR: Failed to start Django backend!
    pause
    exit /b 1
)
cd ..

echo.
echo [3/4] Starting React Frontend...
cd DXB-frontend-develop
start "React Frontend" cmd /k "npm run dev"
cd ..

echo.
echo [4/4] Starting HTTP Server...
cd pfimport-main
start "HTTP Server" cmd /k "python -m http.server 3001"
cd ..

echo.
echo ========================================
echo All services are starting...
echo ========================================
echo.
echo Services will be available at:
echo - Frontend: http://localhost:3000
echo - Backend: http://localhost:8000
echo - Memory LLM: http://localhost:8080
echo - HTTP Server: http://localhost:3001
echo.
echo Please wait a few minutes for all services to fully start.
echo.
echo Press any key to open the main frontend...
pause >nul

start http://localhost:3000

echo.
echo Launch complete! Check the browser for the frontend.
echo.
echo To stop all services:
echo - Close the command windows
echo - Run: docker-compose down (in each project directory)
echo.
pause
