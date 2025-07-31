# Crypto Zap Dashboard - Development Script
# This script starts the development server with proper port management

Write-Host "🚀 Starting Crypto Zap Dashboard Development Server..." -ForegroundColor Green

# Check if port 5000 is in use
$portInUse = netstat -ano | findstr :5000

if ($portInUse) {
    Write-Host "⚠️  Port 5000 is already in use. Attempting to free it..." -ForegroundColor Yellow
    
    # Get the PID using the port
    $processInfo = netstat -ano | findstr :5000 | Select-Object -First 1
    if ($processInfo) {
        $pid = ($processInfo -split '\s+')[-1]
        Write-Host "🔄 Terminating process with PID: $pid" -ForegroundColor Yellow
        taskkill /PID $pid /F 2>$null
        
        # Wait a moment for the process to terminate
        Start-Sleep -Seconds 2
    }
}

# Check if port 3000 is in use (for Vite dev server)
$port3000InUse = netstat -ano | findstr :3000

if ($port3000InUse) {
    Write-Host "⚠️  Port 3000 is already in use. Attempting to free it..." -ForegroundColor Yellow
    
    # Get the PID using the port
    $processInfo = netstat -ano | findstr :3000 | Select-Object -First 1
    if ($processInfo) {
        $pid = ($processInfo -split '\s+')[-1]
        Write-Host "🔄 Terminating process with PID: $pid" -ForegroundColor Yellow
        taskkill /PID $pid /F 2>$null
        
        # Wait a moment for the process to terminate
        Start-Sleep -Seconds 2
    }
}

Write-Host "✅ Ports checked and freed if necessary" -ForegroundColor Green
Write-Host "🎯 Starting development server..." -ForegroundColor Cyan

# Start the development server
npm run dev 