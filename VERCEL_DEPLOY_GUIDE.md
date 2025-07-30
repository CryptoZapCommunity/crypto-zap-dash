# 🚀 Guia de Deploy para Vercel

## ✅ **Problemas Corrigidos**

### **1. Configuração de Build**
- ✅ `vercel.json` atualizado para servir arquivos estáticos corretamente
- ✅ Script de build otimizado para Vercel
- ✅ Rotas configuradas para API e frontend

### **2. Dependências Limpas**
- ✅ Removido `ws` (WebSocket não funciona na Vercel)
- ✅ Removidos plugins Replit desnecessários
- ✅ Dependências otimizadas

### **3. Configuração de Servidor**
- ✅ Servidor configurado para servir arquivos de `dist/`
- ✅ CORS configurado para Vercel
- ✅ Health check endpoint adicionado

## 📋 **Passos para Deploy**

### **1. Preparar o Projeto**
```bash
# Verificar se tudo está funcionando
npm run build
npm run check
```

### **2. Configurar Vercel CLI**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login na Vercel
vercel login
```

### **3. Configurar Environment Variables**
No dashboard da Vercel, adicionar as seguintes variáveis:

```
DATABASE_URL=your_database_url
COINGECKO_API_KEY=your_coingecko_api_key
FRED_API_KEY=your_fred_api_key
NEWS_API_KEY=your_news_api_key
CRYPTO_PANIC_API_KEY=your_crypto_panic_api_key
TRADING_ECONOMICS_API_KEY=your_trading_economics_api_key
WHALE_ALERT_API_KEY=your_whale_alert_api_key
NODE_ENV=production
```

### **4. Deploy**
```bash
# Deploy para produção
vercel --prod

# Ou deploy para preview
vercel
```

## 🔧 **Configurações Específicas**

### **vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["server/**", "shared/**", "dist/**"]
      }
    },
    {
      "src": "client/index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/assets/(.*)",
      "dest": "/dist/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/index.html"
    }
  ],
  "functions": {
    "server/index.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  }
}
```

### **package.json Scripts**
```json
{
  "scripts": {
    "vercel-build": "node vercel-build.js"
  }
}
```

## 🚨 **Possíveis Problemas e Soluções**

### **1. Build Falha**
- Verificar se todas as dependências estão instaladas
- Verificar se as variáveis de ambiente estão configuradas
- Verificar logs do build no dashboard da Vercel

### **2. API Não Funciona**
- Verificar se as rotas estão configuradas corretamente
- Verificar se o servidor está iniciando corretamente
- Verificar logs da função serverless

### **3. Frontend Não Carrega**
- Verificar se os arquivos estáticos estão sendo servidos
- Verificar se as rotas estão configuradas corretamente
- Verificar se o build gerou os arquivos corretamente

## 📊 **Monitoramento**

### **Health Check**
- Endpoint: `/api/health`
- Retorna status do servidor
- Útil para monitoramento

### **Logs**
- Verificar logs no dashboard da Vercel
- Logs de build e runtime disponíveis
- Monitorar erros e performance

## ✅ **Status Final**

**PROJETO PRONTO PARA VERCEL!**

- ✅ Build otimizado
- ✅ Configuração correta
- ✅ Dependências limpas
- ✅ Scripts funcionais
- ✅ Rotas configuradas

**O projeto agora está completamente otimizado para deploy na Vercel!** 🎉 