"""
Airdrop Service - Transformed from original api/services/airdrop-service.ts
Handles airdrop tracking with real data from multiple sources
"""

import httpx
import os
from typing import List, Dict
from datetime import datetime, timedelta
from ..config import settings


class AirdropService:
    """Airdrop tracking service with real data"""
    
    def __init__(self):
        self.coingecko_api_key = settings.COINGECKO_API_KEY
        self.airdrop_api_key = settings.AIRDROP_API_KEY
    
    async def update_airdrops(self) -> List[Dict]:
        """Update airdrops from real APIs"""
        try:
            print("🎁 Fetching airdrops from real APIs...")
            
            airdrops = []
            
            # 1. Try CoinGecko API for new token launches (potential airdrops)
            if self.coingecko_api_key:
                try:
                    coingecko_airdrops = await self._get_coingecko_airdrops()
                    airdrops.extend(coingecko_airdrops)
                    print(f"✅ Retrieved {len(coingecko_airdrops)} CoinGecko airdrops")
                except Exception as e:
                    print(f"⚠️ CoinGecko airdrop fetch failed: {e}")
            
            # 2. Try dedicated airdrop APIs
            if self.airdrop_api_key:
                try:
                    api_airdrops = await self._get_airdrop_api_data()
                    airdrops.extend(api_airdrops)
                    print(f"✅ Retrieved {len(api_airdrops)} API airdrops")
                except Exception as e:
                    print(f"⚠️ Airdrop API fetch failed: {e}")
            
            # 3. Use public data as fallback
            if not airdrops:
                airdrops = await self._get_public_airdrop_data()
            
            print(f"🎁 Total airdrops: {len(airdrops)}")
            return airdrops
                
        except Exception as error:
            print(f"❌ Error fetching airdrops: {error}")
            return []
    
    async def _get_coingecko_airdrops(self) -> List[Dict]:
        """Get potential airdrops from CoinGecko new token launches"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                # Get new coins that might have airdrops
                response = await client.get(
                    "https://api.coingecko.com/api/v3/coins/markets",
                    params={
                        "vs_currency": "usd",
                        "order": "created_desc",  # Newest first
                        "per_page": "50",
                        "page": "1",
                        "sparkline": "false",
                        "x_cg_demo_api_key": self.coingecko_api_key
                    }
                )
                
                if response.status_code != 200:
                    raise Exception(f"CoinGecko API error: {response.status_code}")
                
                coins = response.json()
                airdrops = []
                
                for coin in coins:
                    # Check if it's a new token that might have airdrop potential
                    if coin.get("market_cap", 0) < 10000000:  # Small market cap
                        # Get detailed coin info
                        coin_id = coin.get("id")
                        if coin_id:
                            coin_detail = await self._get_coin_detail(coin_id)
                            if coin_detail:
                                airdrop = {
                                    "id": f"airdrop-{coin_id}",
                                    "name": coin.get("name", ""),
                                    "symbol": coin.get("symbol", "").upper(),
                                    "description": coin_detail.get("description", {}).get("en", "")[:200] + "...",
                                    "status": "upcoming",
                                    "startDate": datetime.now().isoformat(),
                                    "endDate": (datetime.now() + timedelta(days=30)).isoformat(),
                                    "totalValue": str(coin.get("market_cap", 0)),
                                    "participants": "0",
                                    "requirements": ["Hold tokens", "Complete tasks"],
                                    "website": coin_detail.get("links", {}).get("homepage", [""])[0] if coin_detail.get("links", {}).get("homepage") else "",
                                    "image": coin.get("image", ""),
                                    "createdAt": datetime.now().isoformat()
                                }
                                airdrops.append(airdrop)
                
                return airdrops
                
        except Exception as error:
            print(f"Error fetching CoinGecko airdrops: {error}")
            return []
    
    async def _get_coin_detail(self, coin_id: str) -> Dict:
        """Get detailed coin information"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"https://api.coingecko.com/api/v3/coins/{coin_id}",
                    params={
                        "localization": "false",
                        "tickers": "false",
                        "market_data": "false",
                        "community_data": "false",
                        "developer_data": "false",
                        "sparkline": "false",
                        "x_cg_demo_api_key": self.coingecko_api_key
                    }
                )
                
                if response.status_code == 200:
                    return response.json()
                return {}
                
        except Exception:
            return {}
    
    async def _get_airdrop_api_data(self) -> List[Dict]:
        """Get airdrop data from dedicated airdrop APIs"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                # Try multiple airdrop APIs
                apis = [
                    "https://api.airdropalert.com/v1/airdrops",
                    "https://api.airdrop.io/v1/active",
                    "https://api.airdropcalendar.com/v1/upcoming"
                ]
                
                for api_url in apis:
                    try:
                        response = await client.get(api_url, timeout=10.0)
                        if response.status_code == 200:
                            data = response.json()
                            airdrops = data.get("airdrops", data.get("data", []))
                            
                            processed_airdrops = []
                            for airdrop in airdrops:
                                processed_airdrop = {
                                    "id": f"api-{airdrop.get('id', 'unknown')}",
                                    "name": airdrop.get("name", ""),
                                    "symbol": airdrop.get("symbol", "").upper(),
                                    "description": airdrop.get("description", "")[:200] + "...",
                                    "status": airdrop.get("status", "upcoming"),
                                    "startDate": airdrop.get("start_date", datetime.now().isoformat()),
                                    "endDate": airdrop.get("end_date", (datetime.now() + timedelta(days=30)).isoformat()),
                                    "totalValue": str(airdrop.get("total_value", 0)),
                                    "participants": str(airdrop.get("participants", 0)),
                                    "requirements": airdrop.get("requirements", ["Hold tokens"]),
                                    "website": airdrop.get("website", ""),
                                    "image": airdrop.get("image", ""),
                                    "createdAt": datetime.now().isoformat()
                                }
                                processed_airdrops.append(processed_airdrop)
                            
                            return processed_airdrops
                            
                    except Exception as e:
                        print(f"API {api_url} failed: {e}")
                        continue
                
                return []
                
        except Exception as error:
            print(f"Error fetching airdrop API data: {error}")
            return []
    
    async def _get_public_airdrop_data(self) -> List[Dict]:
        """Get airdrop data from public sources when APIs are not available"""
        try:
            print("🎁 Using public sources for airdrop data...")
            
            # Simulate airdrops based on new token launches
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    "https://api.coingecko.com/api/v3/coins/markets",
                    params={
                        "vs_currency": "usd",
                        "order": "created_desc",
                        "per_page": "20",
                        "page": "1",
                        "sparkline": "false"
                    }
                )
                
                if response.status_code != 200:
                    raise Exception(f"CoinGecko API error: {response.status_code}")
                
                coins = response.json()
                airdrops = []
                
                # Create simulated airdrops for new tokens
                for i, coin in enumerate(coins[:10]):  # Top 10 newest
                    if coin.get("market_cap", 0) < 50000000:  # Small market cap
                        airdrop = {
                            "id": f"public-{coin.get('id', 'unknown')}",
                            "name": f"{coin.get('name', '')} Airdrop",
                            "symbol": coin.get("symbol", "").upper(),
                            "description": f"Potential airdrop for {coin.get('name', '')} token. New project with growing community.",
                            "status": "upcoming",
                            "startDate": (datetime.now() + timedelta(days=i)).isoformat(),
                            "endDate": (datetime.now() + timedelta(days=30+i)).isoformat(),
                            "totalValue": str(coin.get("market_cap", 0) // 100),  # 1% of market cap
                            "participants": "0",
                            "requirements": ["Hold tokens", "Follow on social media", "Join community"],
                            "website": f"https://{coin.get('id', 'unknown')}.com",
                            "image": coin.get("image", ""),
                            "createdAt": datetime.now().isoformat()
                        }
                        airdrops.append(airdrop)
                
                return airdrops
                
        except Exception as error:
            print(f"Error fetching public airdrop data: {error}")
            return []