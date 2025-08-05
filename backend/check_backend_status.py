#!/usr/bin/env python3
"""
Simple script to check if backend is running
"""

import httpx
import asyncio
import sys
import os

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.config import settings


async def check_backend():
    """Check if backend is running"""
    print("🔍 Checking backend status...")
    print(f"🌐 Backend URL: http://localhost:{settings.PORT}")
    print(f"🔧 Environment: {settings.ENVIRONMENT}")
    
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            # Test health endpoint
            response = await client.get(f"http://localhost:{settings.PORT}/api/health")
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Backend is running!")
                print(f"📊 Status: {data.get('status', 'unknown')}")
                print(f"🔧 Environment: {data.get('environment', 'unknown')}")
                print(f"🕐 Timestamp: {data.get('timestamp', 'unknown')}")
                return True
            else:
                print(f"❌ Backend responded with status: {response.status_code}")
                return False
                
    except httpx.ConnectError:
        print("❌ Cannot connect to backend - server is not running")
        print("💡 Start the backend with: python -m uvicorn app.main:app --reload")
        return False
    except Exception as e:
        print(f"❌ Error connecting to backend: {e}")
        return False


async def test_simple_endpoint():
    """Test a simple endpoint"""
    print("\n🧪 Testing simple endpoint...")
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"http://localhost:{settings.PORT}/api/test")
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Simple endpoint working!")
                print(f"📊 Response: {data.get('message', 'No message')}")
                return True
            else:
                print(f"❌ Simple endpoint failed: {response.status_code}")
                return False
                
    except Exception as e:
        print(f"❌ Simple endpoint error: {e}")
        return False


async def main():
    """Main function"""
    print("🚀 Backend Status Check")
    print("=" * 40)
    
    # Check if backend is running
    backend_ok = await check_backend()
    
    if backend_ok:
        # Test a simple endpoint
        endpoint_ok = await test_simple_endpoint()
        
        if endpoint_ok:
            print("\n✅ Backend is working correctly!")
            print("💡 You can now test the frontend")
        else:
            print("\n⚠️ Backend is running but endpoints may have issues")
    else:
        print("\n❌ Backend is not running")
        print("💡 Start the backend first")


if __name__ == "__main__":
    asyncio.run(main()) 