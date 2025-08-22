# Быстрая проверка статуса системы
Write-Host "🔍 БЫСТРАЯ ПРОВЕРКА СИСТЕМЫ" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green

# Backend проверка
Write-Host "`nBackend API:" -ForegroundColor White
try {
    $response = Invoke-RestMethod -Uri "https://workerproject-production.up.railway.app/api/health/" -Method GET -TimeoutSec 15
    Write-Host "✅ Backend работает!" -ForegroundColor Green
    Write-Host "   Статус: $($response.status)" -ForegroundColor Gray
    Write-Host "   Сервис: $($response.service)" -ForegroundColor Gray
    Write-Host "   Время: $($response.timestamp)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend недоступен" -ForegroundColor Red
    Write-Host "   Ошибка: $($_.Exception.Message)" -ForegroundColor Gray
}

# Frontend проверка
Write-Host "`nFrontend:" -ForegroundColor White
try {
    $frontendResponse = Invoke-WebRequest -Uri "https://frontend-production-5c48.up.railway.app/" -Method GET -TimeoutSec 10
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend доступен" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend недоступен" -ForegroundColor Red
}

# Railway статус
Write-Host "`nRailway CLI:" -ForegroundColor White
try {
    $railwayCheck = npx --yes @railway/cli@latest status 2>&1
    if ($railwayCheck -match "Project:") {
        Write-Host "✅ Railway подключен" -ForegroundColor Green
    } else {
        Write-Host "❌ Railway не подключен" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Railway CLI недоступен" -ForegroundColor Red
}

Write-Host "`n🔗 Ссылки для тестирования:" -ForegroundColor Yellow
Write-Host "Backend: https://workerproject-production.up.railway.app/api/health/" -ForegroundColor White
Write-Host "Frontend: https://frontend-production-5c48.up.railway.app/auth" -ForegroundColor White
Write-Host "OTP Test: Введите kbalodk@gmail.com и нажмите SIGN UP" -ForegroundColor White

Write-Host "`n🏁 Проверка завершена!" -ForegroundColor Green
