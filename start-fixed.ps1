# Start Fixed Script
# Inicializa o projeto com as correções de comunicação aplicadas

Write-Host "🚀 Starting Crypto Dashboard with Communication Fixes" -ForegroundColor Cyan
Write-Host "=" * 60

# 1. Check if Docker is running
Write-Host "`n1️⃣ Checking Docker..." -ForegroundColor Yellow
try {
    docker version | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running" -ForegroundColor Red
    Write-Host "   Please start Docker Desktop and try again" -ForegroundColor Yellow
    exit 1
}

# 2. Stop any existing containers
Write-Host "`n2️⃣ Stopping existing containers..." -ForegroundColor Yellow
try {
    docker-compose -f docker-compose.dev.yml down
    Write-Host "✅ Existing containers stopped" -ForegroundColor Green
} catch {
    Write-Host "⚠️ No existing containers to stop" -ForegroundColor Yellow
}

# 3. Build and start containers
Write-Host "`n3️⃣ Building and starting containers..." -ForegroundColor Yellow
try {
    docker-compose -f docker-compose.dev.yml up --build -d
    Write-Host "✅ Containers started successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to start containers" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    exit 1
}

# 4. Wait for backend to be ready
Write-Host "`n4️⃣ Waiting for backend to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
$backendReady = $false

while ($attempt -lt $maxAttempts -and -not $backendReady) {
    $attempt++
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 5
        if ($response.success) {
            $backendReady = $true
            Write-Host "✅ Backend is ready (attempt $attempt)" -ForegroundColor Green
        }
    } catch {
        Write-Host "   Waiting... (attempt $attempt/$maxAttempts)" -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }
}

if (-not $backendReady) {
    Write-Host "❌ Backend failed to start within timeout" -ForegroundColor Red
    Write-Host "   Check logs with: docker-compose -f docker-compose.dev.yml logs backend" -ForegroundColor Yellow
    exit 1
}

# 5. Wait for frontend to be ready
Write-Host "`n5️⃣ Waiting for frontend to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
$frontendReady = $false

while ($attempt -lt $maxAttempts -and -not $frontendReady) {
    $attempt++
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            $frontendReady = $true
            Write-Host "✅ Frontend is ready (attempt $attempt)" -ForegroundColor Green
        }
    } catch {
        Write-Host "   Waiting... (attempt $attempt/$maxAttempts)" -ForegroundColor Gray
        Start-Sleep -Seconds 2
    }
}

if (-not $frontendReady) {
    Write-Host "❌ Frontend failed to start within timeout" -ForegroundColor Red
    Write-Host "   Check logs with: docker-compose -f docker-compose.dev.yml logs frontend" -ForegroundColor Yellow
    exit 1
}

# 6. Test communication
Write-Host "`n6️⃣ Testing communication..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/market-summary" -Method GET -TimeoutSec 10
    Write-Host "✅ Communication test passed" -ForegroundColor Green
    Write-Host "   Backend responding correctly" -ForegroundColor Gray
} catch {
    Write-Host "❌ Communication test failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# 7. Show status
Write-Host "`n7️⃣ Final Status:" -ForegroundColor Yellow
try {
    $containers = docker ps --filter "name=crypto-dashboard" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    Write-Host $containers -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to get container status" -ForegroundColor Red
}

Write-Host "`n" + "=" * 60
Write-Host "🎉 Crypto Dashboard is ready!" -ForegroundColor Green
Write-Host "`n📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📚 API Docs: http://localhost:5000/docs" -ForegroundColor Cyan
Write-Host "`n💡 Useful commands:" -ForegroundColor Yellow
Write-Host "   View logs: docker-compose -f docker-compose.dev.yml logs -f" -ForegroundColor Gray
Write-Host "   Stop: docker-compose -f docker-compose.dev.yml down" -ForegroundColor Gray
Write-Host "   Test communication: .\test-communication.ps1" -ForegroundColor Gray 