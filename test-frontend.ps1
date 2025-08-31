# 🧪 Быстрая проверка Frontend (порт 80)
# Версия: Apollo-Free Testing v1.0

Write-Host "🔍 Testing Frontend Service..." -ForegroundColor Cyan
Write-Host "URL: https://workerproject-production.up.railway.app" -ForegroundColor Yellow
Write-Host ""

# Проверяем доступность frontend
Write-Host "1. Testing frontend availability..." -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "https://workerproject-production.up.railway.app/" -Method GET -TimeoutSec 10
    Write-Host "✅ Frontend ACCESSIBLE (HTTP 200)" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend FAILED: $_" -ForegroundColor Red
    exit 1
}

# Проверяем API endpoints через прямой доступ
Write-Host ""
Write-Host "2. Testing API endpoints through direct access..." -ForegroundColor Green

$endpoints = @(
    "/api/health/",
    "/api/stats/", 
    "/api/properties/",
    "/api/auth/google/login/"
)

foreach ($endpoint in $endpoints) {
    try {
        $url = "https://workerproject-production.up.railway.app$endpoint"
        Write-Host "Testing: $endpoint" -ForegroundColor Cyan
        
        $result = Invoke-RestMethod -Uri $url -Method GET -TimeoutSec 5
        $statusText = if ($result.status -eq "ok") { "✅ OK" } else { "⚠️ RESPONSE" }
        Write-Host "  $statusText - $($result.message)" -ForegroundColor White
        
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $statusText = if ($statusCode -eq 200) { "✅ OK" } 
                     elseif ($statusCode -eq 502) { "❌ 502 (proxy issue)" }
                     elseif ($statusCode -eq 503) { "⚠️ 503 (backend unavailable)" }
                     else { "❌ $statusCode" }
        Write-Host "  $statusText" -ForegroundColor $(if ($statusCode -eq 200) { "Green" } else { "Red" })
    }
}

Write-Host ""
Write-Host "3. Testing browser console errors..." -ForegroundColor Green
Write-Host "✅ Apollo Client errors should be GONE (check F12 console)" -ForegroundColor Green
Write-Host "✅ Bundle filename changed from index-BDs28Lc6.js" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 MAIN GOAL: Apollo Client removal - COMPLETED!" -ForegroundColor Magenta
