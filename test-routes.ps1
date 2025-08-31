# Dubai MVP - Проверка всех маршрутов
Write-Host "🔍 ПРОВЕРКА ВСЕХ МАРШРУТОВ" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

$frontendUrl = "https://frontend-production-261c.up.railway.app"
$backendUrl = "https://dubai.up.railway.app"

Write-Host "`n📱 FRONTEND МАРШРУТЫ:" -ForegroundColor Cyan

$frontendRoutes = @(
    "/",
    "/dashboard", 
    "/auth",
    "/analytics",
    "/reports",
    "/payment",
    "/pricing",
    "/policy",
    "/profile"
)

foreach ($route in $frontendRoutes) {
    try {
        $response = Invoke-WebRequest -Uri "$frontendUrl$route" -Method GET -TimeoutSec 5
        $status = if ($response.StatusCode -eq 200) { "✅ 200 OK" } else { "⚠️ $($response.StatusCode)" }
        Write-Host "  $route - $status" -ForegroundColor $(if ($response.StatusCode -eq 200) { "Green" } else { "Yellow" })
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "  $route - ❌ $statusCode" -ForegroundColor Red
    }
}

Write-Host "`n🔗 API МАРШРУТЫ (GET):" -ForegroundColor Cyan

$apiGetRoutes = @(
    "/api/health/",
    "/api/csrf/",
    "/api/stats/", 
    "/api/properties/",
    "/api/areas/",
    "/api/buildings/",
    "/api/auth/google/login/",
    "/api/profile/me/"
)

foreach ($route in $apiGetRoutes) {
    try {
        $response = Invoke-RestMethod -Uri "$backendUrl$route" -Method GET -TimeoutSec 5
        Write-Host "  $route - ✅ 200 OK" -ForegroundColor Green
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $status = if ($statusCode -eq 401) { "🔒 401 (auth required)" }
                 elseif ($statusCode -eq 404) { "❌ 404 (not found)" }
                 else { "⚠️ $statusCode" }
        Write-Host "  $route - $status" -ForegroundColor $(if ($statusCode -eq 401) { "Yellow" } else { "Red" })
    }
}

Write-Host "`n🔗 API ПРОКСИРОВАНИЕ (через frontend):" -ForegroundColor Cyan

foreach ($route in $apiGetRoutes) {
    try {
        $response = Invoke-RestMethod -Uri "$frontendUrl$route" -Method GET -TimeoutSec 5
        Write-Host "  $route - ✅ Proxy OK" -ForegroundColor Green
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $status = if ($statusCode -eq 401) { "🔒 401 (auth required)" }
                 elseif ($statusCode -eq 404) { "❌ 404 (not found)" }
                 else { "⚠️ $statusCode" }
        Write-Host "  $route - $status" -ForegroundColor $(if ($statusCode -eq 401) { "Yellow" } else { "Red" })
    }
}

Write-Host "`n💡 ИТОГИ:" -ForegroundColor Cyan
Write-Host "✅ Frontend URL: $frontendUrl" -ForegroundColor Green
Write-Host "✅ Backend URL: $backendUrl" -ForegroundColor Green
Write-Host "🔗 Для тестирования OTP: $frontendUrl/auth" -ForegroundColor Yellow
Write-Host "🔗 Для тестирования Google OAuth: $frontendUrl/auth" -ForegroundColor Yellow
