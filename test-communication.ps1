# Test Communication Script
# Testa a comunicação entre frontend e backend

Write-Host "🔍 Testing Communication Between Frontend and Backend" -ForegroundColor Cyan
Write-Host "=" * 60

# 1. Test if backend is running
Write-Host "`n1️⃣ Testing Backend Health..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend is running" -ForegroundColor Green
    Write-Host "   Status: $($response.data.status)" -ForegroundColor Gray
    Write-Host "   Environment: $($response.data.environment)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend is not running or not accessible" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    Write-Host "   💡 Start the backend with: docker-compose -f docker-compose.dev.yml up -d" -ForegroundColor Yellow
    exit 1
}

# 2. Test CORS
Write-Host "`n2️⃣ Testing CORS Configuration..." -ForegroundColor Yellow
try {
    $headers = @{
        "Origin" = "http://localhost:3000"
        "Access-Control-Request-Method" = "GET"
        "Access-Control-Request-Headers" = "X-Requested-With"
    }
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method OPTIONS -Headers $headers -TimeoutSec 10
    Write-Host "✅ CORS is working correctly" -ForegroundColor Green
    Write-Host "   Access-Control-Allow-Origin: $($response.Headers['Access-Control-Allow-Origin'])" -ForegroundColor Gray
} catch {
    Write-Host "❌ CORS test failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# 3. Test market summary endpoint
Write-Host "`n3️⃣ Testing Market Summary Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/market-summary" -Method GET -TimeoutSec 10
    Write-Host "✅ Market summary endpoint working" -ForegroundColor Green
    Write-Host "   Success: $($response.success)" -ForegroundColor Gray
    Write-Host "   Message: $($response.message)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Market summary endpoint failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# 4. Test trending coins endpoint
Write-Host "`n4️⃣ Testing Trending Coins Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/trending-coins" -Method GET -TimeoutSec 10
    Write-Host "✅ Trending coins endpoint working" -ForegroundColor Green
    Write-Host "   Success: $($response.success)" -ForegroundColor Gray
    Write-Host "   Message: $($response.message)" -ForegroundColor Gray
    
    if ($response.data) {
        $gainers = $response.data.gainers.Count
        $losers = $response.data.losers.Count
        Write-Host "   Gainers: $gainers, Losers: $losers" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Trending coins endpoint failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# 5. Test if frontend is accessible
Write-Host "`n5️⃣ Testing Frontend Accessibility..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 10
    Write-Host "✅ Frontend is accessible" -ForegroundColor Green
    Write-Host "   Status Code: $($response.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Frontend is not accessible" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    Write-Host "   💡 Start the frontend with: docker-compose -f docker-compose.dev.yml up -d" -ForegroundColor Yellow
}

# 6. Test Docker containers
Write-Host "`n6️⃣ Testing Docker Containers..." -ForegroundColor Yellow
try {
    $containers = docker ps --filter "name=crypto-dashboard" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    Write-Host "✅ Docker containers status:" -ForegroundColor Green
    Write-Host $containers -ForegroundColor Gray
} catch {
    Write-Host "❌ Docker command failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host "`n" + "=" * 60
Write-Host "🏁 Communication test completed!" -ForegroundColor Cyan
Write-Host "`n💡 If all tests passed, the applications should be communicating correctly." -ForegroundColor Yellow
Write-Host "💡 If some tests failed, check the error messages above." -ForegroundColor Yellow 