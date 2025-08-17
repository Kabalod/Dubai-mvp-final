@echo off
chcp 65001 >nul
echo 🚀 Запуск MCP сервера для Cursor...

REM Проверяем Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker не установлен!
    pause
    exit /b 1
)

REM Проверяем, запущен ли Docker
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker не запущен!
    pause
    exit /b 1
)

echo ✅ Docker доступен

REM Собираем образ
echo 🔨 Сборка Docker образа...
docker build -t memory-mcp-server .
if %errorlevel% neq 0 (
    echo ❌ Ошибка сборки образа!
    pause
    exit /b 1
)

echo ✅ Образ собран успешно

REM Запускаем MCP сервер
echo 🚀 Запуск MCP сервера...
docker run -d --name memory-mcp-server -p 3004:3004 -e NODE_ENV=production -e MEMORY_BASE_URL=http://localhost:8081 -e MEMORY_API_KEY=your-api-key-here -e LOG_LEVEL=info memory-mcp-server

if %errorlevel% neq 0 (
    echo ❌ Ошибка запуска контейнера!
    pause
    exit /b 1
)

echo ✅ MCP сервер запущен на порту 3004

REM Проверяем статус
timeout /t 3 /nobreak >nul
docker ps --filter "name=memory-mcp-server"

echo.
echo 📋 Инструкции по настройке Cursor:
echo 1. Откройте Cursor
echo 2. Перейдите в Settings ^> AI ^> MCP Servers
echo 3. Добавьте новый сервер:
echo    - Name: memory-llm
echo    - Command: docker
echo    - Args: run --rm -i -p 3004:3004 memory-mcp-server:latest
echo 4. Перезапустите Cursor
echo.
echo 🔗 MCP сервер доступен по адресу: http://localhost:3004
pause
