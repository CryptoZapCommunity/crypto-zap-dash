# 🚀 Guia de Deploy no Vercel

## 📋 Pré-requisitos

1. **Conta no Vercel**: [vercel.com](https://vercel.com)
2. **Repositório no GitHub**: Projeto deve estar no GitHub
3. **Variáveis de Ambiente**: Configurar as variáveis necessárias

## 🔧 Configuração

### 1. Arquivo `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "dist/$1"
    }
  ],
  "functions": {
    "api/index.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 2. Variáveis de Ambiente
Configure no painel do Vercel:

```env
NODE_ENV=production
COINGECKO_API_KEY=your_api_key_here
NEWS_API_KEY=your_news_api_key_here
FRED_API_KEY=your_fred_api_key_here
```

## 🚀 Deploy

### Opção 1: Deploy via GitHub
1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático será feito

### Opção 2: Deploy via CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 🔍 Troubleshooting

### Problema: API não carrega dados
**Solução:**
1. Verifique se as variáveis de ambiente estão configuradas
2. Teste a API localmente primeiro
3. Verifique os logs no painel do Vercel

### Problema: Build falha
**Solução:**
1. Verifique se o `package.json` tem os scripts corretos
2. Teste o build localmente: `npm run build`
3. Verifique se todas as dependências estão instaladas
4. Certifique-se de que o `vercel.json` está configurado corretamente
5. Use `@vercel/static-build` para o frontend e `@vercel/node` para a API

### Problema: API não funciona no Vercel
**Solução:**
1. Verifique se o arquivo `api/index.ts` existe
2. Configure as variáveis de ambiente no painel do Vercel
3. Verifique os logs da função no painel do Vercel
4. Teste a API localmente primeiro: `curl http://localhost:5000/api/health`

### Problema: 404 em rotas
**Solução:**
1. Verifique se o `vercel.json` está configurado corretamente
2. Teste as rotas localmente
3. Verifique se o arquivo `api/index.ts` existe

## 📊 Monitoramento

### Logs
- Acesse o painel do Vercel
- Vá em "Functions" para ver logs da API
- Use "Real-time" para logs em tempo real

### Métricas
- Performance: Vercel Analytics
- Erros: Logs de função
- Uptime: Status do Vercel

## 🔄 Atualizações

### Deploy Automático
- Push para `main` = deploy automático
- Pull Requests = preview deployments

### Deploy Manual
```bash
vercel --prod
```

## 🛠️ Desenvolvimento Local

### Testar antes do deploy
```bash
# Build
npm run build

# Testar API
curl http://localhost:5000/api/health

# Testar frontend
npm run dev
```

## 📝 Notas Importantes

1. **Cold Start**: Primeira requisição pode ser lenta
2. **Rate Limiting**: APIs externas podem ter limites
3. **Timeout**: Funções têm limite de 30s
4. **Storage**: Dados são em memória (reset a cada deploy)

## 🆘 Suporte

- **Documentação Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Logs**: Painel do Vercel > Functions
- **Status**: [vercel-status.com](https://vercel-status.com) 