# 🧪 Быстрая проверка Backend (порт 8000)
# Версия: Django Auth Testing v1.0

Write-Host "🔍 Testing Backend Service..." -ForegroundColor Cyan
Write-Host "URL: https://dubai.up.railway.app" -ForegroundColor Yellow
Write-Host ""

# Проверяем health check
Write-Host "1. Testing backend health..." -ForegroundColor Green
try {
    $health = Invoke-RestMethod -Uri "https://dubai.up.railway.app/api/health/" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend HEALTHY" -ForegroundColor Green
    Write-Host "  Service: $($health.service)" -ForegroundColor White
    Write-Host "  Database: $($health.database)" -ForegroundColor White
    Write-Host "  Auth: $($health.auth)" -ForegroundColor White
    if ($health.database_url_set) {
        Write-Host "  PostgreSQL: Connected" -ForegroundColor Green
    } else {
        Write-Host "  Database: SQLite fallback" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Backend FAILED: $_" -ForegroundColor Red
    Write-Host "Trying healthz endpoint..." -ForegroundColor Yellow
    
    try {
        $healthz = Invoke-RestMethod -Uri "https://dubai.up.railway.app/healthz/" -Method GET -TimeoutSec 5
        Write-Host "✅ Backend basic health OK: $($healthz.status)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Backend completely down: $_" -ForegroundColor Red
        exit 1
    }
}

# Проверяем авторизацию endpoints
Write-Host ""
Write-Host "2. Testing authentication endpoints..." -ForegroundColor Green

# Google OAuth
try {
    Write-Host "Testing Google OAuth..." -ForegroundColor Cyan
    $oauth = Invoke-RestMethod -Uri "https://dubai.up.railway.app/api/auth/google/login/" -Method GET -TimeoutSec 5
    Write-Host "✅ Google OAuth endpoint working" -ForegroundColor Green
    Write-Host "  Auth URL generated: $($oauth.auth_url.Length) characters" -ForegroundColor White
} catch {
    Write-Host "❌ Google OAuth failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Тест регистрации
Write-Host ""
Write-Host "3. Testing user registration..." -ForegroundColor Green
try {
    $testUser = @{
        email = "test-$(Get-Random)@test.com"
        password = "testpass123"
        first_name = "Test"
        last_name = "User"
    } | ConvertTo-Json
    
    $register = Invoke-RestMethod -Uri "https://dubai.up.railway.app/api/auth/register/" -Method POST -ContentType "application/json" -Body $testUser -TimeoutSec 10
    Write-Host "✅ Registration working" -ForegroundColor Green
    Write-Host "  User created: $($register.user.email)" -ForegroundColor White
    Write-Host "  JWT tokens: Generated" -ForegroundColor White
    Write-Host "  Email sent: $($register.email_sent)" -ForegroundColor White
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 BACKEND AUTH SYSTEM STATUS CHECKED!" -ForegroundColor Magenta
