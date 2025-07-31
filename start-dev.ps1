# Script para iniciar o desenvolvimento completo
Write-Host "🚀 Iniciando Crypto Zap Dashboard..." -ForegroundColor Green

# Definir variáveis de ambiente
$env:PORT = "5000"
$env:NODE_ENV = "development"

# Iniciar API em background
Write-Host "📡 Iniciando API..." -ForegroundColor Yellow
Start-Process -NoNewWindow -FilePath "npx" -ArgumentList "tsx server/index.ts"

# Aguardar um pouco
Start-Sleep -Seconds 5

# Iniciar Client em background
Write-Host "🖥️ Iniciando Client..." -ForegroundColor Yellow
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run dev"

Write-Host "✅ Serviços iniciados!" -ForegroundColor Green
Write-Host "📡 API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🖥️ Frontend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🏥 Health Check: http://localhost:5000/api/health" -ForegroundColor Cyan
Write-Host "🔗 Frontend: http://localhost:5000" -ForegroundColor Cyan

Write-Host "`nPressione Ctrl+C para parar todos os serviços" -ForegroundColor Red 