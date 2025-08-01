# Production Setup Guide

This guide covers setting up the Crypto Zap Dashboard for production deployment on Vercel.

## Architecture Overview

- **Frontend**: React + Vite (deployed to Vercel)
- **Backend**: Node.js + Express (deployed as Vercel serverless functions)
- **Database**: PostgreSQL (external service)
- **Fullstack**: Single deployment with API routes at `/api/*`

## Prerequisites

- Node.js 18+ installed
- Vercel account
- PostgreSQL database
- API keys for external services

## Environment Variables

Set these environment variables in your Vercel project:

### Database
```
DATABASE_URL=postgresql://username:password@host:port/database
```

### API Keys
```
COINGECKO_API_KEY=your_coingecko_api_key
FRED_API_KEY=your_fred_api_key
NEWS_API_KEY=your_news_api_key
CRYPTO_PANIC_API_KEY=your_cryptopanic_api_key
TRADING_ECONOMICS_API_KEY=your_trading_economics_api_key
WHALE_ALERT_API_KEY=your_whale_alert_api_key
```

### Server Configuration
```
NODE_ENV=production
```

## Deployment Steps

1. **Connect Repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - The `vercel.json` is already configured for fullstack deployment

2. **Configure Environment Variables**
   - Go to your Vercel project settings
   - Add all required environment variables
   - Ensure `NODE_ENV=production` is set

3. **Deploy**
   - Vercel will automatically build and deploy
   - Frontend will be available at your domain
   - API will be available at `/api/*` routes

## Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp env.example .env
   # Edit .env with your local values
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Database Setup

1. **Create PostgreSQL Database**
   - Use a service like Neon, Supabase, or Railway
   - Get your connection string

2. **Run Migrations** (if needed)
   ```bash
   # Database migrations are handled automatically
   ```

## API Services Setup

### CoinGecko
- Sign up at [coingecko.com](https://coingecko.com)
- Get your API key
- Set `COINGECKO_API_KEY`

### Federal Reserve Economic Data (FRED)
- Sign up at [fred.stlouisfed.org](https://fred.stlouisfed.org)
- Get your API key
- Set `FRED_API_KEY`

### News API
- Sign up at [newsapi.org](https://newsapi.org)
- Get your API key
- Set `NEWS_API_KEY`

### CryptoPanic
- Sign up at [cryptopanic.com](https://cryptopanic.com)
- Get your API key
- Set `CRYPTO_PANIC_API_KEY`

### Trading Economics
- Sign up at [tradingeconomics.com](https://tradingeconomics.com)
- Get your API key
- Set `TRADING_ECONOMICS_API_KEY`

### Whale Alert
- Sign up at [whale-alert.io](https://whale-alert.io)
- Get your API key
- Set `WHALE_ALERT_API_KEY`

## Monitoring and Maintenance

1. **Check Vercel Build Logs**
   - Monitor for any build errors
   - Verify environment variables are loaded

2. **Monitor API Usage**
   - Check rate limits for external APIs
   - Monitor database connections

3. **Performance Monitoring**
   - Use Vercel Analytics
   - Monitor API response times

## Troubleshooting

### Common Issues

1. **API Not Available**
   - Check environment variables are set
   - Verify API keys are valid
   - Check Vercel function logs

2. **Database Connection Issues**
   - Verify `DATABASE_URL` is correct
   - Check database is accessible
   - Ensure SSL is configured if required

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check TypeScript compilation

### Support

- Check Vercel documentation for deployment issues
- Review API service documentation for rate limits
- Monitor application logs for debugging 