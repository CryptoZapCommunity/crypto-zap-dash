# Deployment Guide

## Current Issue
The front-end is deployed on Netlify but the API is not available, causing "Failed to load market data" errors.

## Solutions

### Option 1: Deploy API to Vercel (Recommended)

1. **Deploy API to Vercel:**
   ```bash
   # The API is already configured for Vercel deployment
   # Just connect your GitHub repo to Vercel and deploy
   ```

2. **Set Environment Variables in Netlify:**
   - Go to Netlify Dashboard > Site Settings > Environment Variables
   - Add: `VITE_API_URL=https://your-api.vercel.app`

3. **Update front-end to use the deployed API**

### Option 2: Use Mock Data (Temporary)

The front-end now includes mock data that will be used when the API is not available. This allows the site to function while you set up the API deployment.

### Option 3: Deploy Full Stack to Vercel

1. **Deploy both front-end and API to Vercel:**
   - The `vercel.json` is already configured for this
   - This will serve both the API and front-end from the same domain

## Current Configuration

- **Front-end:** Netlify (static files only)
- **API:** Not deployed (causing the error)
- **Mock Data:** Available as fallback

## Next Steps

1. Deploy the API to Vercel
2. Set the `VITE_API_URL` environment variable in Netlify
3. Test the integration

## Environment Variables Needed

### For API (Vercel):
```
DATABASE_URL=your_database_url
COINGECKO_API_KEY=your_key
FRED_API_KEY=your_key
NEWS_API_KEY=your_key
CRYPTO_PANIC_API_KEY=your_key
TRADING_ECONOMICS_API_KEY=your_key
WHALE_ALERT_API_KEY=your_key
```

### For Front-end (Netlify):
```
VITE_API_URL=https://your-api.vercel.app
``` 