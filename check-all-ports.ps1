# Скрипт проверки всех портов для всех проектов
Write-Host "🔍 Проверка всех портов для всех проектов..." -ForegroundColor Cyan

# Портты для всех проектов
$allPorts = @{
    # DXB Frontend (React)
    "DXB Frontend" = 3000
    
    # Realty Main (Django)
    "Realty Main Web" = 8000
    "Realty Main DB" = 5432
    
    # PfImport
    "PfImport Service" = 8082
    
    # Memory LLM Production
    "Memory PostgreSQL" = 5433
    "Memory Redis" = 6379
    "Memory Service" = 8081
    "Memory Nginx" = 8080
    "Memory Prometheus" = 9090
    "Memory Grafana" = 3003
}

$usedPorts = @()
$freePorts = @()

Write-Host "`n📋 Проверяем порты:" -ForegroundColor Yellow
foreach ($service in $allPorts.Keys) {
    $port = $allPorts[$service]
    Write-Host "  $service`: $port" -ForegroundColor White
    
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    
    if ($process) {
        $usedPorts += [PSCustomObject]@{
            Service = $service
            Port = $port
            PID = $process.OwningProcess
            Process = (Get-Process -Id $process.OwningProcess -ErrorAction SilentlyContinue).ProcessName
        }
    } else {
        $freePorts += [PSCustomObject]@{
            Service = $service
            Port = $port
            Status = "Свободен"
        }
    }
}

# Выводим результаты
if ($usedPorts.Count -gt 0) {
    Write-Host "`n❌ Занятые порты:" -ForegroundColor Red
    $usedPorts | Format-Table -AutoSize
    
    Write-Host "`n💡 Рекомендации:" -ForegroundColor Yellow
    foreach ($used in $usedPorts) {
        Write-Host "  $($used.Service): измените порт в global-ports.env или остановите процесс PID $($used.PID)" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n✅ Все порты свободны!" -ForegroundColor Green
}

if ($freePorts.Count -gt 0) {
    Write-Host "`n✅ Свободные порты:" -ForegroundColor Green
    $freePorts | Format-Table -AutoSize
}

Write-Host "`n🚀 Для запуска всех проектов используйте:" -ForegroundColor Cyan
Write-Host "  docker compose -f docker-compose.all-projects.yml up -d" -ForegroundColor White

Write-Host "`n📁 Файлы конфигурации:" -ForegroundColor Cyan
Write-Host "  - global-ports.env - глобальные порты для всех проектов" -ForegroundColor White
Write-Host "  - docker-compose.all-projects.yml - запуск всех проектов" -ForegroundColor White
Write-Host "  - ../realty-main/docker-compose.ports.yml - Realty Main" -ForegroundColor White
Write-Host "  - ../DXB-frontend-develop/docker-compose.ports.yml - DXB Frontend" -ForegroundColor White
Write-Host "  - ../pfimport-main/docker-compose.ports.yml - PfImport" -ForegroundColor White
