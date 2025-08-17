@echo off
echo Starting Frontend...
echo.
echo Option 1: Simple HTTP Server (port 3000)
echo Option 2: Vite Dev Server (port 5173)
echo.
echo Press 1 for HTTP Server, 2 for Vite, or any other key to exit
set /p choice="Enter your choice: "

if "%choice%"=="1" (
    echo Starting HTTP Server on port 3000...
    echo Open http://localhost:3000/dashboard.html in your browser
    python -m http.server 3000
) else if "%choice%"=="2" (
    echo Starting Vite Dev Server...
    npm run dev
) else (
    echo Exiting...
    pause
)
