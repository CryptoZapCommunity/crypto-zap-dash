# Production Setup Guide

## Current Issue
The front-end is deployed on Netlify but the API is not available, causing "Failed to load market data" errors.

## Solution Steps

### 1. Deploy API to Vercel (Recommended)

#### Option A: Deploy API separately
1. **Create new Vercel project for API:**
   ```bash
   # In a new directory or branch
   vercel --prod
   ```

2. **Configure environment variables in Vercel:**
   ```
   DATABASE_URL=your_database_url
   COINGECKO_API_KEY=your_key
   FRED_API_KEY=your_key
   NEWS_API_KEY=your_key
   CRYPTO_PANIC_API_KEY=your_key
   TRADING_ECONOMICS_API_KEY=your_key
   WHALE_ALERT_API_KEY=your_key
   NODE_ENV=production
   ```

3. **Get the API URL** (e.g., `https://crypto-zap-dash-api.vercel.app`)

#### Option B: Deploy full stack to Vercel
1. **Use existing vercel.json** - it's already configured for full-stack deployment
2. **Deploy to Vercel** - both front-end and API will be served from the same domain

### 2. Configure Netlify Environment Variables

1. **Go to Netlify Dashboard:**
   - Site Settings > Environment Variables

2. **Add the API URL:**
   ```
   VITE_API_URL=https://your-api.vercel.app
   ```

3. **Force redeploy:**
   - Go to Deploys > Trigger deploy

### 3. Alternative: Use Mock Data (Temporary)

The front-end now includes comprehensive mock data that will be used when the API is not available. This allows the site to function while you set up the API deployment.

## Current Configuration

| Component | Status | Action Needed |
|-----------|--------|---------------|
| Front-end (Netlify) | ✅ Working | None |
| API Backend | ❌ Not deployed | Deploy to Vercel/Render/Railway |
| Environment Variables | ❌ Not set | Add VITE_API_URL to Netlify |
| Mock Data | ✅ Available | Fallback when API unavailable |

## Environment Variables

### For API (Vercel/Render/Railway):
```
DATABASE_URL=your_database_url
COINGECKO_API_KEY=your_key
FRED_API_KEY=your_key
NEWS_API_KEY=your_key
CRYPTO_PANIC_API_KEY=your_key
TRADING_ECONOMICS_API_KEY=your_key
WHALE_ALERT_API_KEY=your_key
NODE_ENV=production
```

### For Front-end (Netlify):
```
VITE_API_URL=https://your-api.vercel.app
```

## Testing

1. **Local development:**
   ```bash
   npm run dev
   ```

2. **Production test:**
   - Deploy API
   - Set environment variables
   - Test on Netlify

## Troubleshooting

### If API is not responding:
1. Check environment variables in Vercel
2. Verify API keys are valid
3. Check Vercel function logs

### If front-end still shows errors:
1. Verify VITE_API_URL is set in Netlify
2. Check browser console for specific errors
3. Ensure mock data is working as fallback

## Quick Fix for Demo

If you need the site working immediately for demo purposes:
1. The mock data will automatically activate
2. No additional configuration needed
3. Site will show realistic demo data 