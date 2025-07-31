#!/usr/bin/env node

// Test script to verify environment variables
console.log('🔍 Testing Environment Variables...\n');

// Check if VITE_API_URL is set
const apiUrl = process.env.VITE_API_URL;
console.log('VITE_API_URL:', apiUrl || '❌ NOT SET');

if (!apiUrl) {
  console.log('\n⚠️  WARNING: VITE_API_URL is not set!');
  console.log('   This will cause the front-end to use /api which doesn\'t exist in production.');
  console.log('   Please set VITE_API_URL in your environment variables.');
} else {
  console.log('✅ VITE_API_URL is configured');
}

// Check other API keys
const apiKeys = [
  'COINGECKO_API_KEY',
  'FRED_API_KEY', 
  'NEWS_API_KEY',
  'CRYPTO_PANIC_API_KEY',
  'TRADING_ECONOMICS_API_KEY',
  'WHALE_ALERT_API_KEY'
];

console.log('\n📋 API Keys Status:');
apiKeys.forEach(key => {
  const value = process.env[key];
  console.log(`${key}: ${value ? '✅ Set' : '❌ Not set'}`);
});

console.log('\n🎯 Next Steps:');
console.log('1. Set VITE_API_URL in Netlify environment variables');
console.log('2. Deploy API to Vercel/Render/Railway');
console.log('3. Update VITE_API_URL with the deployed API URL');
console.log('4. Force redeploy on Netlify');

console.log('\n💡 Quick Fix:');
console.log('   Set VITE_API_URL to any value (e.g., "https://demo-api.com")');
console.log('   This will trigger mock data fallback and make the site work immediately.'); 