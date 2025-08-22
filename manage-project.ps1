# 🚀 ГЛАВНЫЙ МЕНЕДЖЕР ПРОЕКТА DUBAI_MVP
# Единая точка входа для всех операций

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("check", "deploy", "test", "dev", "prod", "fix", "watch", "status")]
    [string]$Action,
    
    [switch]$AutoFix = $false,
    [switch]$Force = $false
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 DUBAI MVP PROJECT MANAGER" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green
Write-Host "Действие: $Action" -ForegroundColor Cyan

switch ($Action) {
    "check" {
        Write-Host "🔍 Запуск комплексной проверки..." -ForegroundColor Cyan
        & ".\scripts\comprehensive-check.ps1"
        
        if ($LASTEXITCODE -ne 0 -and $AutoFix) {
            Write-Host "🔧 Запуск автоисправления..." -ForegroundColor Yellow
            & ".\scripts\auto-deploy-manager.ps1" -MaxRetries 3
        }
    }
    
    "deploy" {
        Write-Host "🚂 Запуск автоматического деплоя..." -ForegroundColor Cyan
        & ".\scripts\auto-deploy-manager.ps1" -MaxRetries 5
    }
    
    "test" {
        Write-Host "🧪 Запуск тестирования..." -ForegroundColor Cyan
        & ".\scripts\railway-health-check.ps1"
        
        Write-Host "`n🔗 Ссылки для ручного тестирования:" -ForegroundColor Yellow
        Write-Host "Backend: https://workerproject-production.up.railway.app/api/health/" -ForegroundColor White
        Write-Host "Frontend: https://frontend-production-5c48.up.railway.app/auth" -ForegroundColor White
        Write-Host "OTP Test: Введите kbalodk@gmail.com и нажмите SIGN UP" -ForegroundColor White
    }
    
    "dev" {
        Write-Host "💻 Запуск локальной разработки..." -ForegroundColor Cyan
        
        if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
            Write-Host "🐳 Запуск Docker Compose для разработки..." -ForegroundColor Yellow
            docker-compose -f docker-compose.dev.yml up --build
        } else {
            Write-Host "❌ Docker Compose не найден" -ForegroundColor Red
            Write-Host "Установите Docker Desktop: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
        }
    }
    
    "prod" {
        Write-Host "🏭 Подготовка к продакшену..." -ForegroundColor Cyan
        
        # Комплексная проверка
        Write-Host "1. Комплексная проверка..." -ForegroundColor Yellow
        & ".\scripts\comprehensive-check.ps1"
        
        if ($LASTEXITCODE -ne 0 -and -not $Force) {
            Write-Host "❌ Проверка не пройдена. Используйте -Force для принудительного деплоя" -ForegroundColor Red
            exit 1
        }
        
        # Деплой
        Write-Host "2. Автоматический деплой..." -ForegroundColor Yellow
        & ".\scripts\auto-deploy-manager.ps1" -MaxRetries 3
        
        # Тестирование
        Write-Host "3. Финальное тестирование..." -ForegroundColor Yellow
        & ".\scripts\railway-health-check.ps1"
        
        Write-Host "🎉 Продакшен готов!" -ForegroundColor Green
    }
    
    "fix" {
        Write-Host "🔧 Запуск автоматического исправления..." -ForegroundColor Cyan
        & ".\scripts\auto-deploy-manager.ps1" -MaxRetries 10
    }
    
    "watch" {
        Write-Host "👁️ Запуск режима мониторинга..." -ForegroundColor Cyan
        & ".\scripts\auto-deploy-manager.ps1" -WatchMode -WaitSeconds 40
    }
    
    "status" {
        Write-Host "📊 Проверка текущего статуса..." -ForegroundColor Cyan
        
        # Backend
        Write-Host "`nBackend API:" -ForegroundColor White
        try {
            $response = Invoke-RestMethod -Uri "https://workerproject-production.up.railway.app/api/health/" -Method GET -TimeoutSec 10
            Write-Host "✅ Работает" -ForegroundColor Green
            Write-Host "   Статус: $($response.status)" -ForegroundColor Gray
            Write-Host "   Сервис: $($response.service)" -ForegroundColor Gray
        } catch {
            Write-Host "❌ Недоступен" -ForegroundColor Red
        }
        
        # Frontend
        Write-Host "`nFrontend:" -ForegroundColor White
        try {
            $frontendResponse = Invoke-WebRequest -Uri "https://frontend-production-5c48.up.railway.app/" -Method GET -TimeoutSec 10
            Write-Host "✅ Доступен" -ForegroundColor Green
        } catch {
            Write-Host "❌ Недоступен" -ForegroundColor Red
        }
        
        # Railway статус
        Write-Host "`nRailway:" -ForegroundColor White
        try {
            $railwayStatus = npx --yes @railway/cli@latest status 2>&1
            if ($railwayStatus -match "Project:") {
                Write-Host "✅ Подключен" -ForegroundColor Green
            } else {
                Write-Host "❌ Не подключен" -ForegroundColor Red
            }
        } catch {
            Write-Host "❌ CLI недоступен" -ForegroundColor Red
        }
        
        Write-Host "`n🔗 Полезные ссылки:" -ForegroundColor Yellow
        Write-Host "Backend: https://workerproject-production.up.railway.app/api/health/" -ForegroundColor White
        Write-Host "Frontend: https://frontend-production-5c48.up.railway.app/auth" -ForegroundColor White
        Write-Host "Railway: https://railway.app/" -ForegroundColor White
    }
}

Write-Host "`n🏁 Операция '$Action' завершена!" -ForegroundColor Green

# Показать доступные команды
Write-Host "`n💡 Доступные команды:" -ForegroundColor Yellow
Write-Host "  .\manage-project.ps1 check     # Комплексная проверка" -ForegroundColor White
Write-Host "  .\manage-project.ps1 deploy    # Автоматический деплой" -ForegroundColor White
Write-Host "  .\manage-project.ps1 test      # Тестирование системы" -ForegroundColor White
Write-Host "  .\manage-project.ps1 dev       # Локальная разработка" -ForegroundColor White
Write-Host "  .\manage-project.ps1 prod      # Подготовка к продакшену" -ForegroundColor White
Write-Host "  .\manage-project.ps1 fix       # Автоисправление" -ForegroundColor White
Write-Host "  .\manage-project.ps1 watch     # Мониторинг" -ForegroundColor White
Write-Host "  .\manage-project.ps1 status    # Текущий статус" -ForegroundColor White
