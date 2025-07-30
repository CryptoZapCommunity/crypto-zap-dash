import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testFedAPIs() {
  console.log('🧪 Testing FED APIs...\n');

  try {
    // Test health endpoint
    console.log('🔍 Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health:', healthData);
    console.log('');

    // Force update FED data
    console.log('🔄 Force updating FED data...');
    const updateResponse = await fetch(`${BASE_URL}/api/update/fed`, {
      method: 'POST'
    });
    const updateData = await updateResponse.json();
    console.log('✅ Update result:', updateData);
    console.log('');

    // Test FED updates endpoint
    console.log('🔍 Testing FED updates endpoint...');
    const fedResponse = await fetch(`${BASE_URL}/api/fed-updates`);
    const fedData = await fedResponse.json();
    console.log('✅ FED updates:', fedData);
    console.log(`📊 Found ${fedData.length} FED updates`);
    console.log('');

    // Test FRED indicators
    console.log('🔍 Testing FRED indicators...');
    const fredResponse = await fetch(`${BASE_URL}/api/fred/indicators`);
    const fredData = await fredResponse.json();
    console.log('✅ FRED indicators:', fredData);
    console.log('');

    // Test FRED rate history
    console.log('🔍 Testing FRED rate history...');
    const historyResponse = await fetch(`${BASE_URL}/api/fred/rate-history`);
    const historyData = await historyResponse.json();
    console.log('✅ FRED rate history:', historyData);
    console.log('');

  } catch (error) {
    console.error('❌ Error testing FED APIs:', error);
  }
}

testFedAPIs(); 