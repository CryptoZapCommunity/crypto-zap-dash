#!/usr/bin/env python3
"""
Test script for sentiment analysis endpoints
"""

import asyncio
import httpx
import json

BASE_URL = "http://localhost:5000"

async def test_sentiment_endpoints():
    """Test all sentiment analysis endpoints"""
    print("🧪 Testing Sentiment Analysis Endpoints...")
    print("=" * 50)
    
    async with httpx.AsyncClient() as client:
        # Test sentiment analysis
        print("🔍 Testing /api/sentiment/analyze...")
        response = await client.get(f"{BASE_URL}/api/sentiment/analyze?text=bitcoin%20is%20going%20up")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Response: {json.dumps(data, indent=2)[:200]}...")
        else:
            print(f"❌ Error: {response.text}")
        
        print("\n🔍 Testing /api/sentiment/market...")
        response = await client.get(f"{BASE_URL}/api/sentiment/market")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Response: {json.dumps(data, indent=2)[:200]}...")
        else:
            print(f"❌ Error: {response.text}")
        
        print("\n🔍 Testing /api/sentiment/bitcoin...")
        response = await client.get(f"{BASE_URL}/api/sentiment/bitcoin")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Response: {json.dumps(data, indent=2)[:200]}...")
        else:
            print(f"❌ Error: {response.text}")
        
        print("\n🔍 Testing /api/sentiment/bitcoin/history...")
        response = await client.get(f"{BASE_URL}/api/sentiment/bitcoin/history")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Response: {json.dumps(data, indent=2)[:200]}...")
        else:
            print(f"❌ Error: {response.text}")
        
        print("\n🔍 Testing /api/sentiment/compare...")
        response = await client.get(f"{BASE_URL}/api/sentiment/compare?symbols=bitcoin,ethereum,solana")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Response: {json.dumps(data, indent=2)[:200]}...")
        else:
            print(f"❌ Error: {response.text}")
    
    print("=" * 50)
    print("🏁 Sentiment Analysis Tests Completed!")

if __name__ == "__main__":
    asyncio.run(test_sentiment_endpoints()) 