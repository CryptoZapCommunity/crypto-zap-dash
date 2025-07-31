# 🚀 API Deployment Guide

## **Problema Identificado**
A API não está deployada no Vercel. O teste retornou `DEPLOYMENT_NOT_FOUND`.

## **Soluções**

### **Opção 1: Deploy via Vercel CLI**

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login no Vercel
vercel login

# 3. Deploy da API
vercel --prod
```

### **Opção 2: Deploy via Vercel Dashboard**

1. **Acesse:** https://vercel.com/dashboard
2. **Clique em:** "New Project"
3. **Importe o repositório:** `crypto-zap-dash`
4. **Configure:**
   - **Framework Preset:** Node.js
   - **Root Directory:** `api`
   - **Build Command:** `npm install`
   - **Output Directory:** (deixe vazio)
   - **Install Command:** `npm install`

5. **Environment Variables:**
   ```
   NODE_ENV=production
   ```

6. **Deploy**

### **Opção 3: Deploy via GitHub Integration**

1. **Conecte o repositório** no Vercel
2. **Configure o projeto** para usar a pasta `api`
3. **Deploy automático** será feito

## **Verificação do Deploy**

Após o deploy, teste:

```bash
# Teste a API
node test-api-health.js

# Ou manualmente
curl https://your-api-url.vercel.app/api/health
```

## **Configuração do Frontend**

Após ter a URL da API:

1. **No Netlify Dashboard:**
   - Vá em: Site settings > Environment variables
   - Adicione: `VITE_API_URL` = `https://your-api-url.vercel.app`

2. **Redeploy do frontend:**
   - Vá em: Deploys > Trigger deploy > Deploy site

## **URLs Esperadas**

- **API:** `https://crypto-zap-dash.vercel.app` (ou similar)
- **Frontend:** `https://cryptozapdash.netlify.app`

## **Troubleshooting**

### **Se o deploy falhar:**
1. Verifique se o `api/package.json` existe
2. Verifique se o `api/index.ts` existe
3. Verifique se as dependências estão instaladas

### **Se a API não responder:**
1. Verifique os logs no Vercel Dashboard
2. Verifique se o middleware CORS está funcionando
3. Teste localmente primeiro

### **Se o frontend não conectar:**
1. Verifique se `VITE_API_URL` está configurada
2. Verifique se o redeploy foi feito
3. Verifique o console do browser

## **Comandos Úteis**

```bash
# Testar localmente
cd api
npm run dev

# Build local
cd api
npm run build

# Ver logs do Vercel
vercel logs
``` 