# Deployment Guide

This guide covers deploying the Crypto Zap Dashboard to Vercel as a fullstack application.

## Prerequisites

- Node.js 18+ installed
- Vercel account
- Database (PostgreSQL recommended)
- API keys for external services

## Environment Variables

Set these environment variables in your Vercel project:

### Database
- `DATABASE_URL` - Your PostgreSQL connection string

### API Keys
- `COINGECKO_API_KEY` - CoinGecko API key
- `FRED_API_KEY` - Federal Reserve Economic Data API key
- `NEWS_API_KEY` - News API key
- `CRYPTO_PANIC_API_KEY` - CryptoPanic API key
- `TRADING_ECONOMICS_API_KEY` - Trading Economics API key
- `WHALE_ALERT_API_KEY` - Whale Alert API key

### Server Configuration
- `NODE_ENV=production`

## Deployment Steps

1. **Connect your repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - The `vercel.json` is already configured for this

2. **Set environment variables in Vercel dashboard**
   - Go to your project settings
   - Add all required environment variables

3. **Deploy**
   - Vercel will automatically build and deploy your application
   - The monorepo structure is handled by the `vercel.json` configuration

## Architecture

- **Frontend**: React + Vite (deployed to Vercel)
- **Backend**: Node.js + Express (deployed as Vercel serverless functions)
- **Database**: PostgreSQL (external service)
- **Fullstack**: Single deployment with API routes at `/api/*`

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `env.example` to `.env` and configure
4. Start development: `npm run dev`

## Troubleshooting

- Check Vercel build logs for any errors
- Verify environment variables are set correctly
- Ensure database connection is working
- Monitor API rate limits for external services 