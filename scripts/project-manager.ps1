# 🚀 Dubai Project Manager
# Единый скрипт управления всеми сервисами проекта

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("start", "stop", "restart", "status", "logs", "cleanup", "setup")]
    [string]$Action = "status",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("all", "core", "ai", "frontend", "infrastructure", "monitoring")]
    [string]$Service = "all",
    
    [switch]$Force,
    [switch]$Verbose
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

# Проверка портов
function Test-Ports {
    param([array]$Ports)
    
    Write-Info "🔍 Проверка портов..."
    $conflicts = @()
    
    foreach ($port in $Ports) {
        try {
            $connection = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue
            if ($connection.TcpTestSucceeded) {
                Write-Warning "Порт $port занят"
                $conflicts += $port
            }
        }
        catch {
            # Порт свободен
        }
    }
    
    if ($conflicts.Count -eq 0) {
        Write-Status "Все порты свободны"
        return $true
    }
    else {
        Write-Warning "Найдено $($conflicts.Count) конфликтов портов"
        return $false
    }
}

# Запуск сервиса
function Start-Service {
    param([string]$ServiceName)
    
    $service = $Services[$ServiceName]
    if (-not $service) {
        Write-Error "Неизвестный сервис: $ServiceName"
        return
    }
    
    Write-Header "Запуск $($service.name)"
    Write-Info $service.description
    
    # Проверка портов
    if (-not (Test-Ports $service.ports)) {
        Write-Warning "Возможны конфликты портов"
        if (-not $Force) {
            Write-Error "Используйте -Force для принудительного запуска"
            return
        }
    }
    
    # Проверка compose файла
    $composePath = Join-Path $PSScriptRoot "..\infrastructure\docker\$($service.compose_file)"
    if (-not (Test-Path $composePath)) {
        Write-Warning "Compose файл не найден: $composePath"
        Write-Info "Создаем базовый compose файл..."
        New-DockerComposeFile -ServiceName $ServiceName -ComposePath $composePath
    }
    
    # Запуск через Docker Compose
    try {
        Set-Location (Split-Path $composePath)
        docker compose -f $composePath up -d
        Write-Status "$($service.name) запущен"
    }
    catch {
        Write-Error "Ошибка запуска $($service.name): $_"
    }
}

# Остановка сервиса
function Stop-Service {
    param([string]$ServiceName)
    
    $service = $Services[$ServiceName]
    if (-not $service) {
        Write-Error "Неизвестный сервис: $ServiceName"
        return
    }
    
    Write-Header "Остановка $($service.name)"
    
    $composePath = Join-Path $PSScriptRoot "..\infrastructure\docker\$($service.compose_file)"
    if (Test-Path $composePath) {
        try {
            Set-Location (Split-Path $composePath)
            docker compose -f $composePath down
            Write-Status "$($service.name) остановлен"
        }
        catch {
            Write-Error "Ошибка остановки $($service.name): $_"
        }
    }
    else {
        Write-Warning "Compose файл не найден: $composePath"
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
            try {
                Set-Location (Split-Path $composePath)
                $containers = docker compose -f $composePath ps --format json | ConvertFrom-Json
                if ($containers) {
                    foreach ($container in $containers) {
                        $status = if ($container.State -eq "running") { "🟢" } else { "🔴" }
                        Write-Host "   $status $($container.Service): $($container.State)" -ForegroundColor $Colors.White
                    }
                }
                else {
                    Write-Host "   ⚪ Нет запущенных контейнеров" -ForegroundColor $Colors.Yellow
                }
            }
            catch {
                Write-Host "   ❌ Ошибка проверки статуса" -ForegroundColor $Colors.Red
            }
        }
        else {
            Write-Host "   📁 Compose файл не найден" -ForegroundColor $Colors.Yellow
        }
    }
}

# Создание базового compose файла
function New-DockerComposeFile {
    param([string]$ServiceName, [string]$ComposePath)
    
    $service = $Services[$ServiceName]
    $content = @"
version: '3.8'

services:
  $ServiceName-service:
    image: nginx:alpine
    container_name: dubai-$ServiceName
    ports:
      - "$($service.ports[0]):80"
    volumes:
      - ./logs:/var/log/nginx
    restart: unless-stopped

networks:
  default:
    name: dubai-$ServiceName-network
"@
    
    try {
        New-Item -Path (Split-Path $ComposePath) -ItemType Directory -Force | Out-Null
        $content | Out-File -FilePath $ComposePath -Encoding UTF8
        Write-Status "Создан базовый compose файл: $ComposePath"
    }
    catch {
        Write-Error "Ошибка создания compose файла: $_"
    }
}

# Основная логика
function Main {
    Write-Header "Dubai Project Manager"
    Write-Host "Действие: $Action" -ForegroundColor $Colors.Yellow
    Write-Host "Сервис: $Service" -ForegroundColor $Colors.Yellow
    Write-Host "Подробный вывод: $Verbose" -ForegroundColor $Colors.Yellow
    Write-Host "Принудительно: $Force" -ForegroundColor $Colors.Yellow
    
    # Проверка зависимостей
    if (-not (Test-Docker)) { return }
    if (-not (Test-DockerCompose)) { return }
    
    # Выполнение действия
    switch ($Action) {
        "start" {
            if ($Service -eq "all") {
                foreach ($serviceName in $Services.Keys) {
                    Start-Service $serviceName
                }
            }
            else {
                Start-Service $Service
            }
        }
        "stop" {
            if ($Service -eq "all") {
                foreach ($serviceName in $Services.Keys) {
                    Stop-Service $serviceName
                }
            }
            else {
                Stop-Service $Service
            }
        }
        "restart" {
            if ($Service -eq "all") {
                foreach ($serviceName in $Services.Keys) {
                    Stop-Service $serviceName
                    Start-Sleep -Seconds 2
                    Start-Service $serviceName
                }
            }
            else {
                Stop-Service $Service
                Start-Sleep -Seconds 2
                Start-Service $Service
            }
        }
        "status" {
            Get-ServiceStatus
        }
        "logs" {
            Write-Info "Просмотр логов (реализовать)"
        }
        "cleanup" {
            Write-Info "Очистка (реализовать)"
        }
        "setup" {
            Write-Info "Настройка (реализовать)"
        }
    }
}

# Запуск
Main
