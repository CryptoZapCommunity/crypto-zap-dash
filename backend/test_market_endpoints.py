#!/usr/bin/env python3
"""
Test script for market analysis endpoints
"""

import asyncio
import httpx
import json

BASE_URL = "http://localhost:5000"

async def test_market_endpoints():
    """Test all market analysis endpoints"""
    print("📈 Testing Market Analysis Endpoints...")
    print("=" * 50)
    
    async with httpx.AsyncClient() as client:
        # Test market analysis
        print("🔍 Testing /api/market-analysis...")
        response = await client.get(f"{BASE_URL}/api/market-analysis")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Response: {json.dumps(data, indent=2)[:200]}...")
        else:
            print(f"❌ Error: {response.text}")
        
        print("\n🔍 Testing /api/market-sentiment...")
        response = await client.get(f"{BASE_URL}/api/market-sentiment")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Response: {json.dumps(data, indent=2)[:200]}...")
        else:
            print(f"❌ Error: {response.text}")
    
    print("=" * 50)
    print("🏁 Market Analysis Tests Completed!")

if __name__ == "__main__":
    asyncio.run(test_market_endpoints()) 