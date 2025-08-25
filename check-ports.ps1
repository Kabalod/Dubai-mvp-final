# Скрипт проверки портов для Dubai MVP
Write-Host "🔍 Проверка портов для Dubai MVP..." -ForegroundColor Cyan

# Портты, которые мы используем для MVP
$ports = @{
    "Frontend (React)" = 3000
    "Backend (Django)" = 8000
    "PostgreSQL" = 5432
    "Redis" = 6379
    "Storybook" = 3003
}

$usedPorts = @()
$freePorts = @()

foreach ($service in $ports.Keys) {
    $port = $ports[$service]
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
        Write-Host "  $($used.Service): измените порт в конфигурации или остановите процесс PID $($used.PID)" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n✅ Все порты свободны!" -ForegroundColor Green
}

if ($freePorts.Count -gt 0) {
    Write-Host "`n✅ Свободные порты:" -ForegroundColor Green
    $freePorts | Format-Table -AutoSize
}

Write-Host "`n🚀 Для запуска используйте:" -ForegroundColor Cyan
Write-Host "  docker compose -f docker-compose.mvp.yml up -d" -ForegroundColor White
