#!/usr/bin/env python3
"""
Test script for all API endpoints
Equivalent to the original test-apis.js
"""

import asyncio
import httpx
import json
from datetime import datetime


BASE_URL = "http://localhost:5000"


async def test_api(client: httpx.AsyncClient, endpoint: str, description: str, method: str = "GET"):
    """Test a single API endpoint"""
    try:
        print(f"🔍 Testing {description}...")
        
        if method == "GET":
            response = await client.get(f"{BASE_URL}{endpoint}")
        elif method == "POST":
            response = await client.post(f"{BASE_URL}{endpoint}")
        else:
            print(f"   Error: Unsupported method {method}")
            return
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ {endpoint}: {response.status_code}")
            
            # Show data structure
            if isinstance(data, dict):
                if 'data' in data:
                    data_type = type(data['data']).__name__
                    if isinstance(data['data'], list):
                        print(f"   Response: {data_type} with {len(data['data'])} items")
                    else:
                        print(f"   Response: {data_type}")
                else:
                    print(f"   Response: {list(data.keys())}")
            else:
                print(f"   Response: {type(data).__name__}")
                
        else:
            print(f"❌ {endpoint}: {response.status_code}")
            print(f"   Error: {response.text}")

    except Exception as error:
        print(f"   Error: {str(error)}")
    print("")


async def run_tests():
    """Run all API tests"""
    print("🚀 Starting API Tests...\n")
    
    async with httpx.AsyncClient() as client:
        # Test health endpoint
        await test_api(client, "/api/health", "Health Check")
        
        # Test market endpoints
        await test_api(client, "/api/market-summary", "Market Summary")
        await test_api(client, "/api/trending-coins", "Trending Coins")
        
        # Test crypto icons
        await test_api(client, "/api/crypto-icons?symbols=bitcoin,ethereum", "Crypto Icons")
        await test_api(client, "/api/crypto-icons/bitcoin", "Single Crypto Icon")
        
        # Test news endpoints
        await test_api(client, "/api/news", "General News")
        await test_api(client, "/api/news/geopolitics", "Geopolitical News")
        await test_api(client, "/api/news/macro", "Macroeconomic News")
        
        # Test economic endpoints
        await test_api(client, "/api/economic-calendar", "Economic Calendar")
        await test_api(client, "/api/fed/indicators", "FRED Indicators")
        await test_api(client, "/api/fed/rate", "FRED Rate")
        await test_api(client, "/api/fed/rate-history", "FRED Rate History")
        
        # Test whale endpoints
        await test_api(client, "/api/whale-transactions", "Whale Transactions")
        
        # Test airdrops
        await test_api(client, "/api/airdrops", "Airdrops")
        
        # Test update endpoints (POST requests)
        await test_api(client, "/api/update/crypto", "Update Crypto", "POST")
        await test_api(client, "/api/update/news", "Update News", "POST")
        await test_api(client, "/api/update/economic", "Update Economic", "POST")
        await test_api(client, "/api/update/whale", "Update Whale", "POST")
    
    print("🏁 API Tests Completed!")


if __name__ == "__main__":
    asyncio.run(run_tests())