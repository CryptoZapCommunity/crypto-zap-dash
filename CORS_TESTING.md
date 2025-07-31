# CORS Testing Guide

## Problem Identified
The front-end is making requests to the correct API URL, but getting CORS errors.

## Testing Steps

### 1. Test API Health Endpoint
```bash
# Test from command line
curl -H "Origin: https://cryptozapdash.netlify.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-api-domain.vercel.app/api/health
```

### 2. Check Browser Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Reload the page
4. Look for failed requests (red)
5. Click on failed request to see:
   - **Response:** Should show CORS error details
   - **Headers:** Check if CORS headers are present

### 3. Test CORS Headers
```bash
# Test if CORS headers are present
curl -I -H "Origin: https://cryptozapdash.netlify.app" \
     https://your-api-domain.vercel.app/api/health
```

Expected headers:
```
Access-Control-Allow-Origin: https://cryptozapdash.netlify.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
```

## Common CORS Issues

### 1. Missing CORS Headers
**Symptom:** "No 'Access-Control-Allow-Origin' header"
**Solution:** Ensure CORS middleware is applied to all routes

### 2. Wrong Origin
**Symptom:** "Origin not allowed"
**Solution:** Add your domain to allowed origins

### 3. Preflight Request Failing
**Symptom:** OPTIONS request returns 404
**Solution:** Handle OPTIONS requests properly

### 4. Credentials Issue
**Symptom:** "Credentials not supported"
**Solution:** Set `Access-Control-Allow-Credentials: true`

## Debugging Commands

### Test from Browser Console
```javascript
// Test API endpoint
fetch('https://your-api-domain.vercel.app/api/health', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

### Test with curl
```bash
# Test GET request
curl -H "Origin: https://cryptozapdash.netlify.app" \
     https://your-api-domain.vercel.app/api/health

# Test OPTIONS request (preflight)
curl -X OPTIONS \
     -H "Origin: https://cryptozapdash.netlify.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     https://your-api-domain.vercel.app/api/health
```

## Expected Results

### ✅ Success Response
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "cors": "enabled",
  "origin": "https://cryptozapdash.netlify.app"
}
```

### ✅ CORS Headers
```
Access-Control-Allow-Origin: https://cryptozapdash.netlify.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Access-Control-Allow-Credentials: true
```

## Troubleshooting

### If API is not responding:
1. Check if API is deployed correctly
2. Verify the API URL is correct
3. Test API endpoint directly

### If CORS headers are missing:
1. Ensure CORS middleware is applied
2. Check if middleware is in correct order
3. Verify serverless function configuration

### If specific origin is blocked:
1. Add your domain to allowed origins
2. Check for typos in domain name
3. Ensure protocol (https) matches

## Quick Fix for Development
For immediate testing, you can temporarily allow all origins:
```javascript
res.header("Access-Control-Allow-Origin", "*");
```

**Note:** This is not recommended for production, but useful for debugging. 