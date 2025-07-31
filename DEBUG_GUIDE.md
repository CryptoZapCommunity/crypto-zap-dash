# 🚨 Debug Guide - Crypto Zap Dashboard

## **Situação Atual**
- ErrorBoundary implementado no nível mais alto
- CORS configurado com mais domínios e fallback
- Mock data melhorado para capturar mais tipos de erro
- Logs detalhados adicionados

## **Checklist de Debug**

### 1. **Verificar API no Vercel**
```bash
# Testar endpoints da API
node test-api-health.js

# Ou manualmente:
curl -X GET https://crypto-zap-dash.vercel.app/api/health
curl -X OPTIONS https://crypto-zap-dash.vercel.app/api/health
```

**✅ Esperado:**
- Status 200 para GET
- Status 200 para OPTIONS
- Headers CORS presentes

### 2. **Verificar Frontend no Netlify**

**No Netlify Dashboard:**
- [ ] VITE_API_URL está configurada
- [ ] Valor: `https://crypto-zap-dash.vercel.app` (sem barras finais)
- [ ] Deploy foi feito após configurar a env

**No Browser DevTools:**
- [ ] Console não mostra erros de CORS
- [ ] Network tab mostra requests para a API correta
- [ ] Logs mostram "🔧 ApiClient initialized with:"

### 3. **Verificar Variáveis de Ambiente**

**No Netlify:**
```bash
# Verificar se a env está setada
echo $VITE_API_URL
```

**No Browser:**
```javascript
// No console do browser
console.log(import.meta.env.VITE_API_URL)
```

### 4. **Testar Localmente**

**Backend:**
```bash
cd api
npm run dev
# Testar: http://localhost:5000/api/health
```

**Frontend:**
```bash
cd client
npm run dev
# Verificar se está usando /api (dev) ou VITE_API_URL (prod)
```

### 5. **Logs para Capturar**

**No Console do Browser:**
- Erros de fetch
- Mensagens de CORS
- Logs do ApiClient
- Logs do ErrorBoundary

**No Network Tab:**
- Status das requests
- Headers de resposta
- Timing das requests

## **Problemas Comuns e Soluções**

### **Problema: CORS Error**
```
Access to fetch at 'https://api-url' from origin 'https://frontend-url' has been blocked by CORS policy
```

**Solução:**
1. Verificar se a API está respondendo OPTIONS
2. Verificar se o domínio está na lista de allowed origins
3. Verificar se o middleware CORS está sendo aplicado

### **Problema: API URL Errada**
```
Failed to fetch from /api in production
```

**Solução:**
1. Verificar VITE_API_URL no Netlify
2. Fazer novo deploy após configurar env
3. Verificar se não há cache

### **Problema: ErrorBoundary Não Captura**
```
White screen ou erro não tratado
```

**Solução:**
1. Verificar se ErrorBoundary está no main.tsx
2. Verificar se não há erros fora do React
3. Verificar se não há erros de build

## **Comandos de Debug**

### **Testar API**
```bash
# Teste completo
node test-api-health.js

# Teste manual
curl -v -X GET https://crypto-zap-dash.vercel.app/api/health
curl -v -X OPTIONS https://crypto-zap-dash.vercel.app/api/health
```

### **Verificar Build**
```bash
# Frontend
cd client
npm run build
npm run preview

# Backend
cd api
npm run build
```

### **Verificar Logs**
```bash
# Vercel logs
vercel logs

# Netlify logs
netlify logs
```

## **Próximos Passos**

1. **Executar teste da API** para verificar se está funcionando
2. **Verificar variáveis de ambiente** no Netlify
3. **Capturar logs do browser** para identificar o erro específico
4. **Testar localmente** para isolar o problema

## **Contato para Debug**

Se o problema persistir, forneça:
1. Logs do console do browser
2. Resultado do `node test-api-health.js`
3. Screenshot do Network tab
4. URL exata onde está testando 