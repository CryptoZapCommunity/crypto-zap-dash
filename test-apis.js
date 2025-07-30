const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';

async function testAPI(endpoint, description) {
  try {
    console.log(`🔍 Testing: ${description}`);
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${description}: SUCCESS`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Data: ${JSON.stringify(data).substring(0, 100)}...`);
    } else {
      console.log(`❌ ${description}: FAILED`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`❌ ${description}: ERROR`);
    console.log(`   Error: ${error.message}`);
  }
  console.log('');
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  // Test health endpoint
  await testAPI('/api/health', 'Health Check');
  
  // Test market endpoints
  await testAPI('/api/market-summary', 'Market Summary');
  await testAPI('/api/trending-coins', 'Trending Coins');
  
  // Test crypto icons
  await testAPI('/api/crypto-icons?symbols=bitcoin,ethereum', 'Crypto Icons');
  await testAPI('/api/crypto-icons/bitcoin', 'Single Crypto Icon');
  
  // Test news endpoints
  await testAPI('/api/news', 'General News');
  await testAPI('/api/news/geopolitics', 'Geopolitical News');
  await testAPI('/api/news/macro', 'Macroeconomic News');
  
  // Test economic endpoints
  await testAPI('/api/economic-calendar', 'Economic Calendar');
  await testAPI('/api/fed-updates', 'FED Updates');
  await testAPI('/api/fred/indicators', 'FRED Indicators');
  
  // Test whale endpoints
  await testAPI('/api/whale-movements', 'Whale Movements');
  
  // Test airdrops
  await testAPI('/api/airdrops', 'Airdrops');
  
  // Test charts
  await testAPI('/api/charts/bitcoin', 'Bitcoin Chart');
  
  console.log('🏁 API Tests Completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests }; 