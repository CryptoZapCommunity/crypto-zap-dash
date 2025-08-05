# 🚀 Crypto Dashboard

## ✅ MIGRATION COMPLETE: Node.js → Python/FastAPI + React + Docker

Um dashboard completo para monitoramento de criptomoedas, notícias, eventos econômicos e atividades de baleias, construído com **Python/FastAPI** (backend) e **React** (frontend).

## 🎯 Características

- 📊 **Dashboard em Tempo Real**: Preços, market cap, volume e tendências
- 📰 **Notícias**: Agregação de notícias de múltiplas fontes
- 📅 **Calendário Econômico**: Eventos econômicos e indicadores
- 🐋 **Atividade de Baleias**: Monitoramento de transações grandes
- 🏦 **Dados do FED**: Indicadores econômicos do Federal Reserve
- 🎁 **Airdrops**: Informações sobre airdrops ativos
- 🔔 **Alertas**: Sistema de notificações personalizáveis
- 📱 **Responsivo**: Interface adaptada para mobile e desktop

## 🏗️ Arquitetura

```
crypto-zap-dash/
├── backend/                 # Python/FastAPI Backend
│   ├── app/
│   │   ├── services/       # Serviços de API
│   │   ├── models/         # Modelos Pydantic
│   │   ├── database/       # SQLAlchemy ORM
│   │   └── middleware/     # CORS, Rate Limiting
│   ├── tests/              # Testes Python
│   └── requirements.txt    # Dependências Python
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas da aplicação
│   │   └── lib/            # Utilitários e API client
│   └── package.json        # Dependências Node.js
└── docker-compose.yml      # Orquestração Docker
```

## 🚀 Início Rápido

### Opção 1: Docker (Recomendado)

```bash
# Comandos simples do npm
npm start          # Iniciar ambiente de desenvolvimento
npm stop           # Parar ambiente
npm logs           # Ver logs
npm health         # Verificar saúde do backend
npm status         # Ver status dos containers

# Ou usar scripts PowerShell
.\start-docker.ps1

# Ou comandos Docker diretos
docker-compose -f docker-compose.dev.yml up -d
```

**URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/docs

### Opção 2: Desenvolvimento Local

```powershell
# Backend Python
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py

# Frontend React (novo terminal)
cd client
npm install
npm run dev
```

## 🐳 Comandos Docker Simplificados

### **Comandos Principais**
```bash
npm start          # Iniciar ambiente de desenvolvimento
npm stop           # Parar ambiente de desenvolvimento
npm restart        # Reiniciar ambiente de desenvolvimento
npm logs           # Ver todos os logs
npm monitor        # Monitorar logs em tempo real
npm status         # Ver status dos containers
npm health         # Verificar saúde do backend
```

### **Build e Manutenção**
```bash
npm build          # Construir containers
npm rebuild        # Reconstruir e iniciar containers
npm reset          # Resetar banco de dados e reiniciar
npm run docker:clean # Limpar recursos Docker
```

### **Acesso aos Containers**
```bash
npm shell:backend  # Acessar container do backend
npm shell:frontend # Acessar container do frontend
npm shell:postgres # Acessar banco de dados
```

### **Produção**
```bash
npm run docker:prod:up      # Iniciar ambiente de produção
npm run docker:prod:down    # Parar ambiente de produção
npm run docker:prod:logs    # Ver logs de produção
npm run docker:prod:status  # Ver status de produção
```

### **Ajuda**
```bash
npm run help       # Mostra todos os comandos disponíveis
```

**📖 Documentação completa:** [DOCKER_COMMANDS_SIMPLE.md](./DOCKER_COMMANDS_SIMPLE.md)

## 📋 Pré-requisitos

### Para Docker
- Docker Desktop
- 4GB+ RAM disponível

### Para Desenvolvimento Local
- Python 3.8+
- Node.js 16+
- PostgreSQL (opcional)

## 🔧 Configuração

### Variáveis de Ambiente

Crie arquivos `.env` nos diretórios `backend/` e `client/`:

**backend/.env:**
```bash
# Copie env.example para .env e configure
cp env.example .env
```

**client/.env:**
```bash
# Copie env.example para .env e configure
cp env.example .env
```

### Configuração de Produção

Para produção, use os arquivos `env.production`:

```bash
# Backend
cp env.production .env

# Frontend  
cp env.production .env
```

**Principais diferenças para produção:**
- `DEBUG=false`
- Rate limiting mais restritivo
- CORS origins limitados
- Logs de debug desabilitados
- Cache mais longo
- Polling menos frequente

## 📚 API Endpoints

### Core Endpoints
- `GET /api/health` - Health check
- `GET /api/test` - Test endpoint
- `GET /api/cors-test` - CORS test

### Market Data
- `GET /api/market-summary` - Resumo do mercado
- `GET /api/trending-coins` - Moedas em tendência
- `GET /api/crypto-icons` - Ícones de criptomoedas
- `POST /api/update/crypto` - Atualizar dados de crypto

### News & Events
- `GET /api/news` - Notícias gerais
- `GET /api/news/geopolitics` - Notícias geopolíticas
- `GET /api/news/macro` - Notícias macroeconômicas
- `GET /api/economic-calendar` - Calendário econômico
- `POST /api/update/news` - Atualizar notícias
- `POST /api/update/economic` - Atualizar eventos econômicos

### Whale Activity
- `GET /api/whale-transactions` - Transações de baleias
- `POST /api/update/whale` - Atualizar dados de baleias

### Federal Reserve
- `GET /api/fed/indicators` - Indicadores do FED
- `GET /api/fed/rate` - Taxa de juros atual
- `GET /api/fed/rate-history` - Histórico de taxas

### Airdrops
- `GET /api/airdrops` - Lista de airdrops
- `POST /api/update/airdrops` - Atualizar airdrops

### Alerts
- `GET /api/alerts` - Alertas do sistema

## 🧪 Testes

### Backend (Python)
```powershell
cd backend
python -m pytest tests/
python run_tests.py
```

### Frontend (React)
```powershell
cd client
npm test
```

## 🐳 Docker

### Comandos Úteis

```powershell
# Desenvolvimento
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml logs -f

# Produção
docker-compose up -d
docker-compose logs -f

# Parar todos os containers
docker-compose down
docker-compose -f docker-compose.dev.yml down
```

### Estrutura Docker
- **PostgreSQL**: Banco de dados
- **Backend**: Python/FastAPI
- **Frontend**: React (Vite)
- **Nginx**: Proxy reverso (produção)

## 📊 Monitoramento

### Health Checks
- Backend: http://localhost:5000/api/health
- Frontend: http://localhost:3000
- Database: Verificar logs do PostgreSQL

### Logs
```powershell
# Ver logs de todos os serviços
docker-compose -f docker-compose.dev.yml logs

# Logs específicos
docker logs crypto-dashboard-backend-dev
docker logs crypto-dashboard-frontend-dev
```

## 🔒 Segurança

- **CORS**: Configurado para desenvolvimento e produção
- **Rate Limiting**: Proteção contra spam
- **SSL/HTTPS**: Configurado para produção
- **Headers de Segurança**: Implementados no Nginx

## 🚀 Deploy

### Local
```powershell
# Desenvolvimento
.\start-dev.ps1

# Docker
.\start-docker.ps1
```

### Cloud
- **Backend**: Railway, Render, Heroku
- **Frontend**: Vercel, Netlify
- **Database**: PostgreSQL na nuvem

## 📚 Documentação

- [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) - Guia completo do Docker
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Detalhes da migração
- [API Documentation](http://localhost:5000/docs) - Swagger UI

## 🎯 Benefícios da Migração

✅ **Performance**: Python/FastAPI mais rápido que Node.js/Express
✅ **Type Safety**: Pydantic para validação de dados
✅ **Async/Await**: Suporte nativo para operações assíncronas
✅ **Documentação**: Swagger UI automático
✅ **Testes**: Pytest com melhor cobertura
✅ **Docker**: Containerização completa
✅ **Escalabilidade**: Arquitetura microserviços
✅ **Monitoramento**: Health checks e logs estruturados

## 🔄 Atualizações

### Backend
```powershell
cd backend
git pull
pip install -r requirements.txt
python main.py
```

### Frontend
```powershell
cd client
git pull
npm install
npm run dev
```

### Docker
```powershell
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml pull
docker-compose -f docker-compose.dev.yml up --build -d
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**🎉 Projeto migrado com sucesso de Node.js para Python/FastAPI + React + Docker!**