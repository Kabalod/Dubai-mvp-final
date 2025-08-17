# Скрипт проверки портов для Memory LLM
Write-Host "🔍 Проверка портов для Memory LLM..." -ForegroundColor Cyan

# Портты, которые мы используем
$ports = @{
    "Grafana" = 3002
    "Prometheus" = 9090
    "Nginx" = 80
    "Memory Service" = 8081
    "PostgreSQL" = 5433
    "Redis" = 6379
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
        Write-Host "  $($used.Service): измените порт в .env.ports или остановите процесс PID $($used.PID)" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n✅ Все порты свободны!" -ForegroundColor Green
}

if ($freePorts.Count -gt 0) {
    Write-Host "`n✅ Свободные порты:" -ForegroundColor Green
    $freePorts | Format-Table -AutoSize
}

Write-Host "`n🚀 Для запуска используйте:" -ForegroundColor Cyan
Write-Host "  docker compose --env-file .env.production -f docker-compose.monitoring.yml up -d" -ForegroundColor White
