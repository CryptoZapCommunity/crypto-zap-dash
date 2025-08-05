# Script para iniciar o ambiente Docker do Crypto Dashboard
# ✅ MIGRATION COMPLETE: Node.js → Python/FastAPI + React + Docker

Write-Host "🐳 Crypto Dashboard - Ambiente Docker" -ForegroundColor Green
Write-Host "✅ MIGRATION COMPLETE: Node.js → Python/FastAPI + Docker" -ForegroundColor Green
Write-Host ""

# Verificar se Docker está instalado
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker não está instalado ou não está no PATH" -ForegroundColor Red
    Write-Host "Por favor, instale o Docker Desktop e tente novamente" -ForegroundColor Yellow
    exit 1
}

# Verificar se Docker está rodando
try {
    docker version | Out-Null
} catch {
    Write-Host "❌ Docker não está rodando" -ForegroundColor Red
    Write-Host "Por favor, inicie o Docker Desktop e tente novamente" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Docker está disponível" -ForegroundColor Green

# Criar arquivo .env se não existir
if (-not (Test-Path ".env")) {
    Write-Host "📋 Criando arquivo .env com variáveis de ambiente..." -ForegroundColor Yellow
    @"
# Variáveis de ambiente para Docker
# Substitua pelos seus valores reais

# API Keys
COINGECKO_API_KEY=your_coingecko_api_key
FRED_API_KEY=your_fred_api_key
NEWS_API_KEY=your_news_api_key
CRYPTO_PANIC_API_KEY=your_cryptopanic_api_key
TRADING_ECONOMICS_API_KEY=your_trading_economics_api_key
WHALE_ALERT_API_KEY=your_whale_alert_api_key

# Configurações do banco de dados
DATABASE_URL=postgresql://crypto_user:crypto_password@postgres:5432/crypto_dashboard

# Configurações do servidor
PORT=5000
ENVIRONMENT=production
DEBUG=false

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://frontend:3000

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_PER_HOUR=1000
"@ | Out-File -FilePath ".env" -Encoding UTF8
    
    Write-Host "⚠️  Arquivo .env criado. Edite com suas chaves de API reais!" -ForegroundColor Yellow
}

# Perguntar qual ambiente executar
Write-Host ""
Write-Host "Escolha o ambiente:" -ForegroundColor Cyan
Write-Host "1. Desenvolvimento (hot reload, volumes)" -ForegroundColor White
Write-Host "2. Produção (otimizado, com Nginx)" -ForegroundColor White
Write-Host "3. Apenas Backend (para testes)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Digite sua escolha (1-3)"

switch ($choice) {
    "1" {
        Write-Host "🚀 Iniciando ambiente de DESENVOLVIMENTO..." -ForegroundColor Green
        Write-Host ""
        
        # Parar containers existentes
        Write-Host "🛑 Parando containers existentes..." -ForegroundColor Yellow
        docker-compose -f docker-compose.dev.yml down
        
        # Construir e iniciar containers
        Write-Host "🔨 Construindo containers..." -ForegroundColor Yellow
        docker-compose -f docker-compose.dev.yml build
        
        Write-Host "🚀 Iniciando containers..." -ForegroundColor Green
        docker-compose -f docker-compose.dev.yml up -d
        
        Write-Host ""
        Write-Host "✅ Ambiente de DESENVOLVIMENTO iniciado!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 URLs:" -ForegroundColor Cyan
        Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
        Write-Host "   Backend API: http://localhost:5000" -ForegroundColor White
        Write-Host "   API Docs: http://localhost:5000/docs" -ForegroundColor White
        Write-Host "   Health Check: http://localhost:5000/api/health" -ForegroundColor White
        Write-Host "   Database: localhost:5432" -ForegroundColor White
        Write-Host ""
        Write-Host "📝 Comandos úteis:" -ForegroundColor Yellow
        Write-Host "   Logs: docker-compose -f docker-compose.dev.yml logs -f" -ForegroundColor White
        Write-Host "   Parar: docker-compose -f docker-compose.dev.yml down" -ForegroundColor White
        Write-Host "   Rebuild: docker-compose -f docker-compose.dev.yml up --build" -ForegroundColor White
    }
    "2" {
        Write-Host "🚀 Iniciando ambiente de PRODUÇÃO..." -ForegroundColor Green
        Write-Host ""
        
        # Parar containers existentes
        Write-Host "🛑 Parando containers existentes..." -ForegroundColor Yellow
        docker-compose down
        
        # Construir e iniciar containers
        Write-Host "🔨 Construindo containers..." -ForegroundColor Yellow
        docker-compose build
        
        Write-Host "🚀 Iniciando containers..." -ForegroundColor Green
        docker-compose up -d
        
        Write-Host ""
        Write-Host "✅ Ambiente de PRODUÇÃO iniciado!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 URLs:" -ForegroundColor Cyan
        Write-Host "   Frontend: https://localhost" -ForegroundColor White
        Write-Host "   Backend API: https://localhost/api" -ForegroundColor White
        Write-Host "   API Docs: https://localhost/api/docs" -ForegroundColor White
        Write-Host "   Health Check: https://localhost/health" -ForegroundColor White
        Write-Host ""
        Write-Host "📝 Comandos úteis:" -ForegroundColor Yellow
        Write-Host "   Logs: docker-compose logs -f" -ForegroundColor White
        Write-Host "   Parar: docker-compose down" -ForegroundColor White
        Write-Host "   Rebuild: docker-compose up --build" -ForegroundColor White
    }
    "3" {
        Write-Host "🚀 Iniciando apenas o BACKEND..." -ForegroundColor Green
        Write-Host ""
        
        # Parar containers existentes
        Write-Host "🛑 Parando containers existentes..." -ForegroundColor Yellow
        docker-compose -f docker-compose.dev.yml down
        
        # Iniciar apenas backend e postgres
        Write-Host "🚀 Iniciando backend e banco de dados..." -ForegroundColor Green
        docker-compose -f docker-compose.dev.yml up -d postgres backend
        
        Write-Host ""
        Write-Host "✅ Backend iniciado!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 URLs:" -ForegroundColor Cyan
        Write-Host "   Backend API: http://localhost:5000" -ForegroundColor White
        Write-Host "   API Docs: http://localhost:5000/docs" -ForegroundColor White
        Write-Host "   Health Check: http://localhost:5000/api/health" -ForegroundColor White
        Write-Host "   Database: localhost:5432" -ForegroundColor White
        Write-Host ""
        Write-Host "📝 Comandos úteis:" -ForegroundColor Yellow
        Write-Host "   Logs: docker-compose -f docker-compose.dev.yml logs -f backend" -ForegroundColor White
        Write-Host "   Parar: docker-compose -f docker-compose.dev.yml down" -ForegroundColor White
    }
    default {
        Write-Host "❌ Opção inválida. Execute o script novamente." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 Configuração Docker concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Documentação:" -ForegroundColor Yellow
Write-Host "   README.md - Guia completo" -ForegroundColor White
Write-Host "   MIGRATION_GUIDE.md - Detalhes da migração" -ForegroundColor White
Write-Host "   docker-compose.yml - Configuração de produção" -ForegroundColor White
Write-Host "   docker-compose.dev.yml - Configuração de desenvolvimento" -ForegroundColor White 