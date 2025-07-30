const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';

async function testAPI(endpoint, name) {
  try {
    console.log(`\n🧪 Testing ${name}...`);
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${name}: SUCCESS`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Data: ${JSON.stringify(data).slice(0, 100)}...`);
    } else {
      console.log(`❌ ${name}: FAILED`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${JSON.stringify(data)}`);
    }
  } catch (error) {
    console.log(`❌ ${name}: ERROR`);
    console.log(`   Error: ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  const tests = [
    { endpoint: '/api/market-summary', name: 'Market Summary' },
    { endpoint: '/api/news', name: 'News' },
    { endpoint: '/api/whale-movements', name: 'Whale Movements' },
    { endpoint: '/api/airdrops', name: 'Airdrops' },
    { endpoint: '/api/fed-updates', name: 'FED Updates' },
    { endpoint: '/api/fred/indicators', name: 'FRED Indicators' },
    { endpoint: '/api/fred/rate-history', name: 'FRED Rate History' },
    { endpoint: '/api/economic-calendar', name: 'Economic Calendar' },
  ];
  
  for (const test of tests) {
    await testAPI(test.endpoint, test.name);
  }
  
  console.log('\n🎉 API Tests Complete!');
}

runTests().catch(console.error); 