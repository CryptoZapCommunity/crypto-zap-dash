# Netlify Setup Guide

## Current Issues Identified

### ❌ Missing Environment Variables
- `VITE_API_URL` is NOT configured in Netlify
- Front-end falls back to `/api` which doesn't exist in production

### ❌ Build Configuration Issues
- Base directory should be `client` (already correct in netlify.toml)
- Need to ensure proper build settings

## Step-by-Step Fix

### 1. Configure Environment Variables in Netlify

**Go to:** https://app.netlify.com/projects/cryptozapdash/configuration/env

**Add these variables:**

#### Required Variables:
```
VITE_API_URL=https://your-api-domain.vercel.app
```

#### Optional Variables (for API if you deploy it):
```
COINGECKO_API_KEY=your_coingecko_key
FRED_API_KEY=your_fred_key
NEWS_API_KEY=your_news_key
CRYPTO_PANIC_API_KEY=your_cryptopanic_key
TRADING_ECONOMICS_API_KEY=your_trading_economics_key
WHALE_ALERT_API_KEY=your_whale_alert_key
```

### 2. Verify Build Settings

**Go to:** https://app.netlify.com/projects/cryptozapdash/configuration/deploys

**Ensure these settings:**
- **Base directory:** `client`
- **Build command:** `npm run build`
- **Publish directory:** `dist`

### 3. API Deployment Options

#### Option A: Deploy API to Vercel (Recommended)
1. **Create new Vercel project for API:**
   ```bash
   # In a new directory
   vercel --prod
   ```

2. **Get the API URL** (e.g., `https://crypto-zap-dash-api.vercel.app`)

3. **Set VITE_API_URL in Netlify:**
   ```
   VITE_API_URL=https://crypto-zap-dash-api.vercel.app
   ```

#### Option B: Use Mock Data (Temporary)
- The front-end already has mock data fallback
- No API deployment needed for demo
- Set `VITE_API_URL` to any value to trigger mock data

### 4. Force Redeploy

After setting environment variables:
1. Go to **Deploys** tab
2. Click **"Trigger deploy"**
3. Select **"Clear cache and deploy site"**

## Current Configuration Status

| Setting | Status | Action Needed |
|---------|--------|---------------|
| Base directory | ✅ `client` | None |
| Build command | ✅ `npm run build` | None |
| Publish directory | ✅ `dist` | None |
| VITE_API_URL | ❌ Not set | **ADD THIS** |
| Redirects | ✅ Correct | None |
| Mock data | ✅ Available | None |

## Testing

### 1. Check Environment Variables
```bash
# In browser console
console.log(import.meta.env.VITE_API_URL)
```

### 2. Check API Requests
- Open DevTools (F12)
- Go to Network tab
- Reload page
- Look for API requests and their URLs

### 3. Verify Mock Data
- If API is not available, mock data should load
- Check console for "using mock data" messages

## Troubleshooting

### If still getting "Failed to load market data":
1. **Check environment variable is set correctly**
2. **Verify API URL is accessible**
3. **Check browser console for specific errors**
4. **Ensure mock data fallback is working**

### If build fails:
1. **Verify base directory is `client`**
2. **Check build command is `npm run build`**
3. **Ensure publish directory is `dist`**

## Quick Fix for Demo

If you need the site working immediately:
1. **Set any value for VITE_API_URL** in Netlify
2. **Mock data will automatically activate**
3. **Site will show realistic demo data**

## Expected Result

After configuration:
- ✅ Site loads without errors
- ✅ Data displays (real or mock)
- ✅ No "Failed to load market data" message
- ✅ Console shows proper API requests or mock data usage 