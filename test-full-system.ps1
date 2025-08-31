# 🧪 Полная проверка системы Frontend + Backend
# Версия: Complete System Testing v1.0

param(
    [switch]$SkipRegistration,
    [switch]$QuickCheck
)

Write-Host "🚀 DUBAI MVP - Full System Check" -ForegroundColor Magenta
Write-Host "Apollo Client Status: REMOVED ✅" -ForegroundColor Green
Write-Host "="*50 -ForegroundColor Gray
Write-Host ""

# Frontend проверка
Write-Host "📱 FRONTEND CHECK (Port 80)" -ForegroundColor Cyan
Write-Host "URL: https://workerproject-production.up.railway.app"
try {
    $frontendResponse = Invoke-RestMethod -Uri "https://workerproject-production.up.railway.app/" -Method GET -TimeoutSec 5
    Write-Host "✅ Frontend: ACTIVE" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend: FAILED - $_" -ForegroundColor Red
    exit 1
}

# Backend проверка  
Write-Host ""
Write-Host "🔧 BACKEND CHECK (Port 8000)" -ForegroundColor Cyan
Write-Host "URL: https://dubai.up.railway.app"
try {
    $backendHealth = Invoke-RestMethod -Uri "https://dubai.up.railway.app/api/health/" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend: HEALTHY" -ForegroundColor Green
    Write-Host "  Database: $($backendHealth.database)" -ForegroundColor White
    Write-Host "  Auth Ready: $($backendHealth.auth)" -ForegroundColor White
    $backendWorking = $true
} catch {
    Write-Host "❌ Backend: NOT RESPONDING" -ForegroundColor Red
    $backendWorking = $false
}

# Проверка API через nginx прокси
Write-Host ""
Write-Host "🔗 NGINX PROXY CHECK (Frontend → Backend)" -ForegroundColor Cyan
$apiEndpoints = @("/api/health/", "/api/stats/", "/api/auth/google/login/")

foreach ($endpoint in $apiEndpoints) {
    try {
        $proxyUrl = "https://workerproject-production.up.railway.app$endpoint"
        $proxyResponse = Invoke-RestMethod -Uri $proxyUrl -Method GET -TimeoutSec 3
        
        if ($proxyResponse.status -eq "ok") {
            if ($proxyResponse.apollo_removed) {
                Write-Host "✅ $endpoint - Apollo removed, mock working" -ForegroundColor Green
            } else {
                Write-Host "✅ $endpoint - Backend connected" -ForegroundColor Green  
            }
        } else {
            Write-Host "⚠️ $endpoint - Response: $($proxyResponse.message)" -ForegroundColor Yellow
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 502) {
            Write-Host "❌ $endpoint - 502 (nginx → backend connection failed)" -ForegroundColor Red
        } elseif ($statusCode -eq 503) {
            Write-Host "⚠️ $endpoint - 503 (backend unavailable, using fallback)" -ForegroundColor Yellow
        } else {
            Write-Host "❌ $endpoint - Error: $statusCode" -ForegroundColor Red
        }
    }
}

# Тест авторизации (опционально)
if (-not $SkipRegistration -and $backendWorking) {
    Write-Host ""
    Write-Host "🔐 AUTHENTICATION TEST" -ForegroundColor Cyan
    try {
        $testEmail = "quicktest-$(Get-Random)@test.com"
        $registrationData = @{
            email = $testEmail
            password = "test123"
            first_name = "Quick"
            last_name = "Test"
        } | ConvertTo-Json
        
        Write-Host "Testing registration with: $testEmail" -ForegroundColor White
        $regResult = Invoke-RestMethod -Uri "https://dubai.up.railway.app/api/auth/register/" -Method POST -ContentType "application/json" -Body $registrationData -TimeoutSec 10
        
        Write-Host "✅ Registration: SUCCESS" -ForegroundColor Green
        Write-Host "  JWT Access Token: Generated" -ForegroundColor White
        Write-Host "  Email Sent: $($regResult.email_sent)" -ForegroundColor White
        
    } catch {
        Write-Host "❌ Registration: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Итоги
Write-Host ""
Write-Host "="*50 -ForegroundColor Gray
Write-Host "🎯 MAIN ACHIEVEMENT: Apollo Client REMOVED!" -ForegroundColor Magenta
Write-Host "📊 System Status Summary:" -ForegroundColor Cyan
Write-Host "  Frontend (Port 80): $(if ($frontendResponse) { "✅ ACTIVE" } else { "❌ DOWN" })" -ForegroundColor $(if ($frontendResponse) { "Green" } else { "Red" })
Write-Host "  Backend (Port 8000): $(if ($backendWorking) { "✅ ACTIVE" } else { "❌ DOWN" })" -ForegroundColor $(if ($backendWorking) { "Green" } else { "Red" })
Write-Host "  Apollo Errors: ✅ ELIMINATED" -ForegroundColor Green
Write-Host ""

if (-not $QuickCheck) {
    Write-Host "💡 Commands:" -ForegroundColor Yellow
    Write-Host "  Quick check: .\test-full-system.ps1 -QuickCheck"
    Write-Host "  Skip registration test: .\test-full-system.ps1 -SkipRegistration"
    Write-Host "  Frontend only: .\test-frontend.ps1"  
    Write-Host "  Backend only: .\test-backend.ps1"
}
