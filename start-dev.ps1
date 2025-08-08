# Crypto Dashboard Development Startup Script
# ✅ MIGRATION COMPLETE: Node.js → Python/FastAPI + React
# Starts both Python backend and React frontend

Write-Host "🚀 Crypto Dashboard - Python Backend + React Frontend" -ForegroundColor Green
Write-Host "✅ MIGRATION COMPLETE: Node.js → Python/FastAPI" -ForegroundColor Green
Write-Host ""

# Check if Python is installed
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ and try again" -ForegroundColor Yellow
    exit 1
}

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js 16+ and try again" -ForegroundColor Yellow
    exit 1
}

# Backend Setup
Write-Host "🐍 Setting up Python Backend..." -ForegroundColor Cyan

# Navigate to backend directory
Set-Location backend

# Create virtual environment if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "📦 Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "🔧 Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Install Python dependencies
Write-Host "📦 Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Copy .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📋 Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
    Write-Host "⚠️  Please edit backend/.env with your API keys and database settings" -ForegroundColor Yellow
    Write-Host "   Required: DATABASE_URL, COINGECKO_API_KEY, FRED_API_KEY, etc." -ForegroundColor Cyan
}

# Note: Database integration is optional for development
Write-Host "📝 Note: Backend uses in-memory storage for development" -ForegroundColor Yellow
Write-Host "   For production, configure PostgreSQL in backend/.env" -ForegroundColor Cyan

# Start backend server
Write-Host "🚀 Starting Python backend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\Activate.ps1; python main.py"

# Frontend Setup
Write-Host ""
Write-Host "⚛️  Setting up React Frontend..." -ForegroundColor Cyan

# Navigate to client directory
Set-Location ..\client

# Install Node.js dependencies
Write-Host "📦 Installing Node.js dependencies..." -ForegroundColor Yellow
npm install

# Copy .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📋 Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
    Write-Host "✅ Frontend .env created. API URL set to: http://localhost:5000/api" -ForegroundColor Green
}

# Start frontend server
Write-Host "🚀 Starting React frontend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"

# Return to root directory
Set-Location ..

Write-Host ""
Write-Host "🎉 Development environment started!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📚 API Docs: http://localhost:5000/docs" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔍 Health Check: http://localhost:5000/api/ready" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Useful Commands:" -ForegroundColor Yellow
Write-Host "   Backend: cd backend && python main.py" -ForegroundColor White
Write-Host "   Frontend: cd client && npm run dev" -ForegroundColor White
Write-Host "   Database: cd backend && python setup_database.py" -ForegroundColor White
Write-Host "   Tests: cd backend && python run_tests.py" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Configuration:" -ForegroundColor Yellow
Write-Host "   Backend .env: backend/.env" -ForegroundColor White
Write-Host "   Frontend .env: client/.env" -ForegroundColor White
Write-Host "   Database URL: Check backend/.env DATABASE_URL" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   Migration Guide: MIGRATION_GUIDE.md" -ForegroundColor White
Write-Host "   API Docs: http://localhost:5000/docs" -ForegroundColor White
Write-Host "   README: README.md" -ForegroundColor White 