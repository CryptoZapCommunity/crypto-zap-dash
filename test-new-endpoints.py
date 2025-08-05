#!/usr/bin/env python3
"""
Test script for new endpoints implemented in the migration
"""

import asyncio
import httpx
import json
from datetime import datetime

BASE_URL = "http://localhost:5000"

async def test_endpoint(client, endpoint, method="GET", data=None):
    """Test a single endpoint"""
    try:
        url = f"{BASE_URL}{endpoint}"
        print(f"🔍 Testing {method} {endpoint}")
        
        if method == "GET":
            response = await client.get(url)
        elif method == "POST":
            response = await client.post(url, json=data)
        elif method == "PUT":
            response = await client.put(url, json=data)
        elif method == "DELETE":
            response = await client.delete(url)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ {endpoint}: {response.status_code}")
            print(f"   Success: {result.get('success', False)}")
            print(f"   Message: {result.get('message', 'No message')}")
            if 'data' in result:
                data_type = type(result['data']).__name__
                if isinstance(result['data'], list):
                    print(f"   Data: {len(result['data'])} items")
                elif isinstance(result['data'], dict):
                    print(f"   Data: {len(result['data'])} keys")
                else:
                    print(f"   Data: {data_type}")
            return True
        else:
            print(f"❌ {endpoint}: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ {endpoint}: Error - {str(e)}")
        return False

async def main():
    """Test all new endpoints"""
    print("🚀 Testing new endpoints implemented in migration")
    print("=" * 60)
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        # Test basic endpoints first
        print("\n📊 Testing Basic Endpoints:")
        await test_endpoint(client, "/api/health")
        await test_endpoint(client, "/api/market-summary")
        await test_endpoint(client, "/api/trending-coins")
        
        # Test new Alerts endpoints
        print("\n🔔 Testing Alerts Endpoints:")
        await test_endpoint(client, "/api/alerts")
        await test_endpoint(client, "/api/alerts?limit=5")
        await test_endpoint(client, "/api/alerts/stats")
        
        # Test new Portfolio endpoints
        print("\n💼 Testing Portfolio Endpoints:")
        await test_endpoint(client, "/api/portfolio")
        await test_endpoint(client, "/api/portfolio/summary")
        
        # Test new Sentiment endpoints
        print("\n💭 Testing Sentiment Endpoints:")
        await test_endpoint(client, "/api/sentiment/market")
        await test_endpoint(client, "/api/sentiment/BTC")
        await test_endpoint(client, "/api/sentiment/BTC/history?days=7")
        await test_endpoint(client, "/api/sentiment/compare?symbols=BTC,ETH,SOL")
        
        # Test existing endpoints that were improved
        print("\n📈 Testing Improved Endpoints:")
        await test_endpoint(client, "/api/market-sentiment")
        await test_endpoint(client, "/api/market-analysis")
        await test_endpoint(client, "/api/charts/BTC")
        await test_endpoint(client, "/api/candlestick/BTC?timeframe=1h&limit=50")
        
        # Test individual crypto endpoints
        print("\n🪙 Testing Individual Crypto Endpoints:")
        await test_endpoint(client, "/api/BTC")
        await test_endpoint(client, "/api/ETH")
        
        # Test other existing endpoints
        print("\n📰 Testing Other Endpoints:")
        await test_endpoint(client, "/api/news?limit=5")
        await test_endpoint(client, "/api/economic-calendar")
        await test_endpoint(client, "/api/whale-transactions")
        await test_endpoint(client, "/api/airdrops")
        await test_endpoint(client, "/api/fed/indicators")
        
    print("\n" + "=" * 60)
    print("✅ Testing completed!")

if __name__ == "__main__":
    asyncio.run(main()) 