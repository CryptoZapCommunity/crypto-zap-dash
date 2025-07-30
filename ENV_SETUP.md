# Configuração de Variáveis de Ambiente

## Arquivo .env Atual

O arquivo `.env` atual contém:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/crypto_dashboard

# API Keys
COINGECKO_API_KEY=CG-nawQnNKrG1ChCCAuta3m3sVv
FRED_API_KEY=e5080d830ffce709df93c118ab551842

# Server Configuration
PORT=5000
NODE_ENV=development

# Optional: Add other API keys as needed
NEWS_API_KEY=adb881d6adfe483a8d53d4025002ef1f
```

## Variáveis Faltantes

Baseado na análise do código, as seguintes variáveis estão sendo usadas mas não estão no `.env`:

### API Keys Necessárias:

1. **CRYPTO_PANIC_API_KEY** - Usado em `server/services/news-service.ts`
   - Para buscar notícias do CryptoPanic
   - Valor atual: `your_cryptopanic_api_key_here`

2. **TRADING_ECONOMICS_API_KEY** - Usado em `server/services/economic-service.ts`
   - Para buscar dados econômicos
   - Valor atual: `your_trading_economics_api_key_here`

3. **WHALE_ALERT_API_KEY** - Usado em `server/services/whale-service.ts`
   - Para monitorar transações de baleias
   - Valor atual: `your_whale_alert_api_key_here`

## Arquivo .env Completo Recomendado

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/crypto_dashboard

# API Keys
COINGECKO_API_KEY=CG-nawQnNKrG1ChCCAuta3m3sVv
FRED_API_KEY=e5080d830ffce709df93c118ab551842
NEWS_API_KEY=adb881d6adfe483a8d53d4025002ef1f
CRYPTO_PANIC_API_KEY=your_cryptopanic_api_key_here
TRADING_ECONOMICS_API_KEY=your_trading_economics_api_key_here
WHALE_ALERT_API_KEY=your_whale_alert_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Como Obter as API Keys

1. **CryptoPanic API**: https://cryptopanic.com/developers/api/
2. **Trading Economics API**: https://tradingeconomics.com/api/
3. **Whale Alert API**: https://whale-alert.io/

## Impacto das Variáveis Faltantes

- **CRYPTO_PANIC_API_KEY**: Sem esta chave, o serviço de notícias usará dados mock
- **TRADING_ECONOMICS_API_KEY**: Sem esta chave, o calendário econômico usará dados mock
- **WHALE_ALERT_API_KEY**: Sem esta chave, o tracker de baleias usará dados mock

## Status Atual

✅ **Funcionando com dados mock**:
- Notícias (NEWS_API_KEY presente)
- Dados do FED (FRED_API_KEY presente)
- Preços de criptomoedas (COINGECKO_API_KEY presente)

⚠️ **Usando dados mock**:
- Notícias do CryptoPanic
- Calendário econômico
- Transações de baleias 