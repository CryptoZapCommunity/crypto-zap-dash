#!/usr/bin/env node

import https from 'https';
import http from 'http';

// Configuration
const API_URL = process.env.API_URL || 'https://crypto-zap-dash.vercel.app';
const ENDPOINTS = [
  '/api/health',
  '/api/market-summary',
  '/api/trending-coins'
];

function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'User-Agent': 'API-Health-Check/1.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data,
          url: url,
          method: method
        });
      });
    });

    req.on('error', (error) => {
      reject({
        error: error.message,
        url: url,
        method: method
      });
    });

    req.end();
  });
}

async function testEndpoint(endpoint) {
  console.log(`\n🔍 Testing: ${endpoint}`);
  
  try {
    // Test GET request
    const getResult = await makeRequest(`${API_URL}${endpoint}`, 'GET');
    console.log(`✅ GET ${endpoint}: ${getResult.status}`);
    console.log(`📡 Headers:`, getResult.headers);
    
    if (getResult.status === 200) {
      try {
        const jsonData = JSON.parse(getResult.data);
        console.log(`📊 Response data:`, JSON.stringify(jsonData, null, 2));
      } catch (e) {
        console.log(`📄 Raw response:`, getResult.data.substring(0, 200));
      }
    }
    
    // Test OPTIONS request (CORS preflight)
    const optionsResult = await makeRequest(`${API_URL}${endpoint}`, 'OPTIONS');
    console.log(`✅ OPTIONS ${endpoint}: ${optionsResult.status}`);
    console.log(`📡 CORS Headers:`, {
      'Access-Control-Allow-Origin': optionsResult.headers['access-control-allow-origin'],
      'Access-Control-Allow-Methods': optionsResult.headers['access-control-allow-methods'],
      'Access-Control-Allow-Headers': optionsResult.headers['access-control-allow-headers'],
      'Access-Control-Allow-Credentials': optionsResult.headers['access-control-allow-credentials']
    });
    
  } catch (error) {
    console.error(`❌ Error testing ${endpoint}:`, error);
  }
}

async function runTests() {
  console.log(`🚀 API Health Check`);
  console.log(`📍 Target API: ${API_URL}`);
  console.log(`⏰ Time: ${new Date().toISOString()}`);
  
  for (const endpoint of ENDPOINTS) {
    await testEndpoint(endpoint);
  }
  
  console.log(`\n✅ Health check completed`);
}

// Run tests
runTests().catch(console.error); 