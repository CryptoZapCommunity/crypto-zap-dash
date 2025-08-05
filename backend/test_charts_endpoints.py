#!/usr/bin/env python3
"""
Test script for charts and candlestick endpoints
"""

import asyncio
import httpx
import json

BASE_URL = "http://localhost:5000"

async def test_charts_endpoints():
    """Test all charts and candlestick endpoints"""
    print("📊 Testing Charts and Candlestick Endpoints...")
    print("=" * 50)
    
    async with httpx.AsyncClient() as client:
        # Test chart data
        print("🔍 Testing /api/charts/bitcoin...")
        response = await client.get(f"{BASE_URL}/api/charts/bitcoin")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Response: {json.dumps(data, indent=2)[:200]}...")
        else:
            print(f"❌ Error: {response.text}")
        
        print("\n🔍 Testing /api/charts/ethereum...")
        response = await client.get(f"{BASE_URL}/api/charts/ethereum")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Response: {json.dumps(data, indent=2)[:200]}...")
        else:
            print(f"❌ Error: {response.text}")
        
        print("\n🔍 Testing /api/candlestick/bitcoin...")
        response = await client.get(f"{BASE_URL}/api/candlestick/bitcoin")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Response: {json.dumps(data, indent=2)[:200]}...")
        else:
            print(f"❌ Error: {response.text}")
        
        print("\n🔍 Testing /api/candlestick/ethereum...")
        response = await client.get(f"{BASE_URL}/api/candlestick/ethereum")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Response: {json.dumps(data, indent=2)[:200]}...")
        else:
            print(f"❌ Error: {response.text}")
    
    print("=" * 50)
    print("🏁 Charts and Candlestick Tests Completed!")

if __name__ == "__main__":
    asyncio.run(test_charts_endpoints()) 