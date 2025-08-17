# 🔄 Dubai Project - Реорганизация проекта
# Автоматическое перемещение существующих проектов в новую структуру

param(
    [switch]$DryRun,
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
    Write-Host "`n🔄 $Message" -ForegroundColor $Colors.Cyan
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

# План реорганизации
$ReorganizationPlan = @{
    "realty-main" = @{
        destination = "core\real_estate\realty"
        description = "Основная логика недвижимости"
        type = "core"
    }
    "pfimport-main" = @{
        destination = "core\data_processing\pfimport"
        description = "Импорт данных Property Finder"
        type = "core"
    }
    "DXB-frontend-develop" = @{
        destination = "frontend\dxb"
        description = "React фронтенд приложение"
        type = "frontend"
    }
    "Java_Memory_LLM-master" = @{
        destination = "ai_services\memory\java-llm"
        description = "Java LLM сервис памяти"
        type = "ai"
    }
    "compose-for-agents" = @{
        destination = "ai_services\agents\compose"
        description = "Docker Compose для AI агентов"
        type = "ai"
    }
    "services" = @{
        destination = "infrastructure\services"
        description = "Инфраструктурные сервисы"
        type = "infrastructure"
    }
    "tools" = @{
        destination = "tools"
        description = "Инструменты разработки"
        type = "tools"
    }
    "configs" = @{
        destination = "infrastructure\configs"
        description = "Конфигурационные файлы"
        type = "infrastructure"
    }
}

# Проверка существования папок
function Test-ProjectFolders {
    Write-Info "🔍 Проверка существующих проектов..."
    
    $existingProjects = @()
    $missingProjects = @()
    
    foreach ($project in $ReorganizationPlan.Keys) {
        if (Test-Path $project) {
            $existingProjects += $project
            Write-Status "Найден: $project"
        }
        else {
            $missingProjects += $project
            Write-Warning "Отсутствует: $project"
        }
    }
    
    Write-Host ""
    Write-Info "Найдено проектов: $($existingProjects.Count)"
    Write-Info "Отсутствует проектов: $($missingProjects.Count)"
    
    return $existingProjects
}

# Создание структуры папок
function Create-FolderStructure {
    Write-Info "📁 Создание структуры папок..."
    
    $folders = @(
        "core\real_estate",
        "core\analytics", 
        "core\data_processing",
        "ai_services\memory",
        "ai_services\agents",
        "ai_services\ml_models",
        "frontend",
        "infrastructure\docker",
        "infrastructure\monitoring",
        "infrastructure\deployment",
        "infrastructure\services",
        "infrastructure\configs",
        "tools",
        "scripts",
        "env",
        "logs"
    )
    
    foreach ($folder in $folders) {
        if (-not (Test-Path $folder)) {
            New-Item -Path $folder -ItemType Directory -Force | Out-Null
            Write-Status "Создана папка: $folder"
        }
        else {
            Write-Info "Папка уже существует: $folder"
        }
    }
}

# Перемещение проекта
function Move-Project {
    param(
        [string]$Source,
        [string]$Destination,
        [string]$Description
    )
    
    Write-Info "📦 Перемещение: $Source → $Destination"
    Write-Info "Описание: $Description"
    
    if ($DryRun) {
        Write-Warning "DRY RUN: Проект НЕ будет перемещен"
        return
    }
    
    try {
        # Проверка существования источника
        if (-not (Test-Path $Source)) {
            Write-Error "Источник не найден: $Source"
            return
        }
        
        # Проверка существования назначения
        if (Test-Path $Destination) {
            if ($Force) {
                Write-Warning "Назначение существует, удаляем: $Destination"
                Remove-Item -Path $Destination -Recurse -Force
            }
            else {
                Write-Error "Назначение уже существует: $Destination"
                Write-Info "Используйте -Force для перезаписи"
                return
            }
        }
        
        # Создание родительской папки
        $parentFolder = Split-Path $Destination -Parent
        if (-not (Test-Path $parentFolder)) {
            New-Item -Path $parentFolder -ItemType Directory -Force | Out-Null
        }
        
        # Перемещение
        Move-Item -Path $Source -Destination $Destination -Force
        Write-Status "Проект перемещен: $Source → $Destination"
        
        # Создание README в новой папке
        $readmePath = Join-Path $Destination "README.md"
        if (-not (Test-Path $readmePath)) {
            $readmeContent = @"
# $Description

Перемещен из: `$Source`

## Описание
$Description

## Статус
- ✅ Перемещен в новую структуру
- 📅 Дата: $(Get-Date -Format "dd.MM.yyyy")
- 🔄 Автоматически создано скриптом реорганизации

## Следующие шаги
1. Обновить конфигурации
2. Проверить зависимости
3. Обновить документацию
4. Протестировать функциональность
"@
            $readmeContent | Out-File -FilePath $readmePath -Encoding UTF8
            Write-Status "Создан README: $readmePath"
        }
    }
    catch {
        Write-Error "Ошибка перемещения $Source`: $_"
    }
}

# Создание Docker Compose файлов
function Create-DockerComposeFiles {
    Write-Info "🐳 Создание Docker Compose файлов..."
    
    $composeFiles = @{
        "core" = @{
            file = "infrastructure\docker\docker-compose.core.yml"
            services = @("real-estate-api", "analytics-service", "data-processor")
            ports = @(8000, 8001, 8002)
        }
        "ai" = @{
            file = "infrastructure\docker\docker-compose.ai.yml"
            services = @("memory-service", "agent-service", "ml-service")
            ports = @(8081, 8082, 8083)
        }
        "frontend" = @{
            file = "infrastructure\docker\docker-compose.frontend.yml"
            services = @("dxb-frontend", "frontend-api")
            ports = @(3000, 3001)
        }
        "infrastructure" = @{
            file = "infrastructure\docker\docker-compose.infrastructure.yml"
            services = @("postgres", "redis", "nginx")
            ports = @(5432, 6379, 8080)
        }
        "monitoring" = @{
            file = "infrastructure\docker\docker-compose.monitoring.yml"
            services = @("prometheus", "grafana", "elasticsearch", "kibana")
            ports = @(9090, 3001, 9200, 5601)
        }
    }
    
    foreach ($type in $composeFiles.Keys) {
        $config = $composeFiles[$type]
        $filePath = $config.file
        
        if (-not (Test-Path $filePath)) {
            # Создание содержимого для каждого сервиса
            $servicesContent = ""
            foreach ($service in $config.services) {
                $serviceName = $service
                $servicesContent += "  $serviceName:`n"
                $servicesContent += "    image: nginx:alpine`n"
                $servicesContent += "    container_name: dubai-$serviceName`n"
                $servicesContent += "    ports:`n"
                $servicesContent += "      - `"$($config.ports[0]):80`"`n"
                $servicesContent += "    volumes:`n"
                $servicesContent += "      - ./logs:/var/log/nginx`n"
                $servicesContent += "    restart: unless-stopped`n`n"
            }
            
            $content = @"
version: '3.8'

services:
$servicesContent
networks:
  default:
    name: dubai-$type-network
"@
            
            try {
                New-Item -Path (Split-Path $filePath) -ItemType Directory -Force | Out-Null
                $content | Out-File -FilePath $filePath -Encoding UTF8
                Write-Status "Создан Docker Compose: $filePath"
            }
            catch {
                Write-Error "Ошибка создания $filePath`: $_"
            }
        }
        else {
            Write-Info "Docker Compose уже существует: $filePath"
        }
    }
}

# Создание переменных окружения
function Create-EnvironmentFiles {
    Write-Info "🔐 Создание файлов переменных окружения..."
    
    $envFiles = @{
        "env\.env.development" = @"
# Development Environment
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dubai_dev
DB_USER=dubai_user
DB_PASSWORD=dubai_pass

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AI Services
AI_MEMORY_URL=http://localhost:8081
AI_AGENTS_URL=http://localhost:8082
AI_ML_URL=http://localhost:8083

# Frontend
FRONTEND_PORT=3000
FRONTEND_API_URL=http://localhost:8000

# Monitoring
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001
"@
        
        "env\.env.production" = @"
# Production Environment
NODE_ENV=production
DEBUG=false
LOG_LEVEL=info

# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=dubai_prod
DB_USER=dubai_user
DB_PASSWORD=dubai_pass

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# AI Services
AI_MEMORY_URL=http://ai-memory-service:8081
AI_AGENTS_URL=http://ai-agents-service:8082
AI_ML_URL=http://ai-ml-service:8083

# Frontend
FRONTEND_PORT=3000
FRONTEND_API_URL=http://api-gateway:8000

# Monitoring
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001
"@
    }
    
    foreach ($filePath in $envFiles.Keys) {
        if (-not (Test-Path $filePath)) {
            try {
                New-Item -Path (Split-Path $filePath) -ItemType Directory -Force | Out-Null
                $envFiles[$filePath] | Out-File -FilePath $filePath -Encoding UTF8
                Write-Status "Создан файл окружения: $filePath"
            }
            catch {
                Write-Error "Ошибка создания $filePath`: $_"
            }
        }
        else {
            Write-Info "Файл окружения уже существует: $filePath"
        }
    }
}

# Основная функция
function Main {
    Write-Header "Dubai Project - Реорганизация"
    Write-Host "Режим: $($DryRun ? 'DRY RUN' : 'РЕАЛЬНОЕ ПЕРЕМЕЩЕНИЕ')" -ForegroundColor $Colors.Yellow
    Write-Host "Принудительно: $Force" -ForegroundColor $Colors.Yellow
    Write-Host "Подробно: $Verbose" -ForegroundColor $Colors.Yellow
    
    # Проверка существующих проектов
    $existingProjects = Test-ProjectFolders
    
    if ($existingProjects.Count -eq 0) {
        Write-Error "Не найдено проектов для реорганизации"
        return
    }
    
    # Создание структуры папок
    Create-FolderStructure
    
    # Перемещение проектов
    Write-Header "Перемещение проектов"
    
    foreach ($project in $existingProjects) {
        $plan = $ReorganizationPlan[$project]
        Move-Project -Source $project -Destination $plan.destination -Description $plan.description
        Write-Host ""
    }
    
    # Создание Docker Compose файлов
    Create-DockerComposeFiles
    
    # Создание файлов окружения
    Create-EnvironmentFiles
    
    # Финальный отчет
    Write-Header "Реорганизация завершена"
    Write-Status "Проект реорганизован в новую структуру"
    
    if ($DryRun) {
        Write-Warning "Это был DRY RUN - никакие изменения не были внесены"
        Write-Info "Запустите скрипт без -DryRun для реального перемещения"
    }
    
    Write-Host ""
    Write-Host "📚 Следующие шаги:" -ForegroundColor $Colors.Cyan
    Write-Host "1. Проверьте новую структуру папок"
    Write-Host "2. Обновите конфигурации и зависимости"
    Write-Host "3. Протестируйте функциональность"
    Write-Host "4. Обновите документацию"
    Write-Host "5. Используйте project-manager.ps1 для управления"
}

# Запуск
Main
