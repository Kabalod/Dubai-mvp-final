# 🚀 Dubai Project Manager - Простая версия
# Единый скрипт управления всеми сервисами проекта

param(
    [string]$Action = "status",
    [string]$Service = "all"
)

$ErrorActionPreference = 'Stop'

# Цвета для вывода
$Colors = @{
    Red = 'Red'
    Green = 'Green'
    Yellow = 'Yellow'
    Cyan = 'Cyan'
    White = 'White'
}

# Функции для вывода
function Write-Header {
    param([string]$Message)
    Write-Host "`n🚀 $Message" -ForegroundColor $Colors.Cyan
    Write-Host ("=" * ($Message.Length + 4)) -ForegroundColor $Colors.Cyan
}

function Write-Status {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor $Colors.Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor $Colors.Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor $Colors.Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor $Colors.White
}

# Конфигурация сервисов
$Services = @{
    core = @{
        name = "Core Services"
        compose_file = "docker-compose.core.yml"
        ports = @(8000, 8001, 8002)
        description = "Основные бизнес-сервисы (недвижимость, аналитика)"
    }
    ai = @{
        name = "AI Services"
        compose_file = "docker-compose.ai.yml"
        ports = @(8081, 8082, 8083)
        description = "ИИ сервисы (память, агенты, ML модели)"
    }
    frontend = @{
        name = "Frontend"
        compose_file = "docker-compose.frontend.yml"
        ports = @(3000, 3001, 3002)
        description = "Пользовательский интерфейс"
    }
    infrastructure = @{
        name = "Infrastructure"
        compose_file = "docker-compose.infrastructure.yml"
        ports = @(5432, 6379, 8080)
        description = "Базы данных, кэш, API gateway"
    }
    monitoring = @{
        name = "Monitoring"
        compose_file = "docker-compose.monitoring.yml"
        ports = @(9090, 3001, 5601)
        description = "Мониторинг, логирование, метрики"
    }
}

# Проверка Docker
function Test-Docker {
    try {
        $null = docker --version
        Write-Status "Docker найден"
        return $true
    }
    catch {
        Write-Error "Docker не найден. Установите Docker Desktop"
        return $false
    }
}

# Проверка Docker Compose
function Test-DockerCompose {
    try {
        $null = docker compose version
        Write-Status "Docker Compose найден"
        return $true
    }
    catch {
        Write-Error "Docker Compose не найден"
        return $false
    }
}

# Статус сервисов
function Get-ServiceStatus {
    Write-Header "Статус сервисов Dubai Project"
    
    foreach ($serviceName in $Services.Keys) {
        $service = $Services[$serviceName]
        Write-Host "`n📊 $($service.name)" -ForegroundColor $Colors.Cyan
        Write-Host "   Описание: $($service.description)" -ForegroundColor $Colors.White
        Write-Host "   Порт: $($service.ports -join ', ')" -ForegroundColor $Colors.White
        
        # Проверка статуса Docker контейнеров
        $composePath = Join-Path $PSScriptRoot "..\infrastructure\docker\$($service.compose_file)"
        if (Test-Path $composePath) {
            Write-Host "   📁 Compose файл найден" -ForegroundColor $Colors.Green
        }
        else {
            Write-Host "   📁 Compose файл не найден" -ForegroundColor $Colors.Yellow
        }
    }
}

# Основная логика
function Main {
    Write-Header "Dubai Project Manager"
    Write-Host "Действие: $Action" -ForegroundColor $Colors.Yellow
    Write-Host "Сервис: $Service" -ForegroundColor $Colors.Yellow
    
    # Проверка зависимостей
    if (-not (Test-Docker)) { return }
    if (-not (Test-DockerCompose)) { return }
    
    # Выполнение действия
    switch ($Action) {
        "status" {
            Get-ServiceStatus
        }
        default {
            Write-Info "Действие '$Action' пока не реализовано"
            Write-Info "Доступные действия: status"
        }
    }
}

# Запуск
Main
