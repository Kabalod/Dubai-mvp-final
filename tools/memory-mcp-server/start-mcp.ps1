# Скрипт запуска MCP сервера для Cursor
Write-Host "🚀 Запуск MCP сервера для Cursor..." -ForegroundColor Cyan

# Проверяем Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker не установлен!" -ForegroundColor Red
    exit 1
}

# Проверяем, запущен ли Docker
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker не запущен!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker доступен" -ForegroundColor Green

# Переходим в директорию MCP сервера
Set-Location $PSScriptRoot

# Собираем образ
Write-Host "🔨 Сборка Docker образа..." -ForegroundColor Yellow
docker build -t memory-mcp-server .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Ошибка сборки образа!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Образ собран успешно" -ForegroundColor Green

# Запускаем MCP сервер
Write-Host "🚀 Запуск MCP сервера..." -ForegroundColor Yellow
docker run -d --name memory-mcp-server `
    -p 3004:3004 `
    -e NODE_ENV=production `
    -e MEMORY_BASE_URL=http://localhost:8081 `
    -e MEMORY_API_KEY=your-api-key-here `
    -e LOG_LEVEL=info `
    memory-mcp-server

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Ошибка запуска контейнера!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ MCP сервер запущен на порту 3004" -ForegroundColor Green

# Проверяем статус
Start-Sleep -Seconds 3
docker ps --filter "name=memory-mcp-server"

Write-Host "`n📋 Инструкции по настройке Cursor:" -ForegroundColor Cyan
Write-Host "1. Откройте Cursor" -ForegroundColor White
Write-Host "2. Перейдите в Settings > AI > MCP Servers" -ForegroundColor White
Write-Host "3. Добавьте новый сервер:" -ForegroundColor White
Write-Host "   - Name: memory-llm" -ForegroundColor White
Write-Host "   - Command: docker" -ForegroundColor White
Write-Host "   - Args: run --rm -i -p 3004:3004 memory-mcp-server:latest" -ForegroundColor White
Write-Host "4. Перезапустите Cursor" -ForegroundColor White

Write-Host "`n🔗 MCP сервер доступен по адресу: http://localhost:3004" -ForegroundColor Green
