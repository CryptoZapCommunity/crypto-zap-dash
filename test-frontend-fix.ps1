# Script de teste para verificar correções do frontend
# ✅ TESTE DAS CORREÇÕES CRÍTICAS

Write-Host "🧪 Testando correções do frontend..." -ForegroundColor Green
Write-Host ""

# Testar conectividade do backend
Write-Host "1. Testando conectividade do backend..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET
    Write-Host "✅ Backend está funcionando" -ForegroundColor Green
    Write-Host "   Status: $($healthResponse.success)" -ForegroundColor White
} catch {
    Write-Host "❌ Backend não está respondendo" -ForegroundColor Red
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# Testar endpoint de market summary
Write-Host ""
Write-Host "2. Testando endpoint de market summary..." -ForegroundColor Cyan
try {
    $marketResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/market-summary" -Method GET
    Write-Host "✅ Market summary está funcionando" -ForegroundColor Green
    Write-Host "   Market Cap: $($marketResponse.data.totalMarketCap)" -ForegroundColor White
} catch {
    Write-Host "❌ Market summary falhou" -ForegroundColor Red
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# Testar endpoint de trending coins
Write-Host ""
Write-Host "3. Testando endpoint de trending coins..." -ForegroundColor Cyan
try {
    $trendingResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/trending-coins" -Method GET
    Write-Host "✅ Trending coins está funcionando" -ForegroundColor Green
    Write-Host "   Gainers: $($trendingResponse.data.gainers.Count)" -ForegroundColor White
    Write-Host "   Losers: $($trendingResponse.data.losers.Count)" -ForegroundColor White
} catch {
    Write-Host "❌ Trending coins falhou" -ForegroundColor Red
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# Testar frontend
Write-Host ""
Write-Host "4. Testando frontend..." -ForegroundColor Cyan
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET
    Write-Host "✅ Frontend está funcionando" -ForegroundColor Green
    Write-Host "   Status: $($frontendResponse.StatusCode)" -ForegroundColor White
} catch {
    Write-Host "❌ Frontend não está respondendo" -ForegroundColor Red
    Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar containers
Write-Host ""
Write-Host "5. Verificando status dos containers..." -ForegroundColor Cyan
try {
    $containers = docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    Write-Host "✅ Containers em execução:" -ForegroundColor Green
    Write-Host $containers -ForegroundColor White
} catch {
    Write-Host "❌ Erro ao verificar containers" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Teste concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 URLs para teste manual:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "   API Docs: http://localhost:5000/docs" -ForegroundColor White
Write-Host "   Health Check: http://localhost:5000/api/health" -ForegroundColor White 