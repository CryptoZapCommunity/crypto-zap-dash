"""
Portfolio Service - MISSING from original migration
Handles user portfolio and asset tracking
"""

import httpx
import asyncio
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import os
from ..config import settings

# Mock portfolio data for development
MOCK_PORTFOLIO = [
    {
        "id": "asset-001",
        "symbol": "BTC",
        "name": "Bitcoin",
        "amount": 0.5,
        "avgPrice": 42000.00,
        "currentPrice": 43250.50,
        "value": 21625.25,
        "change24h": 2.5,
        "isWatching": True,
        "createdAt": datetime.utcnow().isoformat()
    },
    {
        "id": "asset-002",
        "symbol": "ETH",
        "name": "Ethereum",
        "amount": 2.5,
        "avgPrice": 2600.00,
        "currentPrice": 2650.75,
        "value": 6626.88,
        "change24h": 1.8,
        "isWatching": True,
        "createdAt": datetime.utcnow().isoformat()
    },
    {
        "id": "asset-003",
        "symbol": "SOL",
        "name": "Solana",
        "amount": 50.0,
        "avgPrice": 95.00,
        "currentPrice": 98.25,
        "value": 4912.50,
        "change24h": 5.2,
        "isWatching": False,
        "createdAt": datetime.utcnow().isoformat()
    }
]

class PortfolioService:
    """Portfolio service for user asset tracking"""
    
    def __init__(self):
        self.base_url = "https://api.coingecko.com/api/v3"
        self.portfolio_cache = MOCK_PORTFOLIO.copy()
        self.crypto_service = None  # Will be injected
    
    def set_crypto_service(self, crypto_service):
        """Inject crypto service for price updates"""
        self.crypto_service = crypto_service
    
    async def get_user_portfolio(self, user_id: str = "default") -> List[Dict]:
        """Get user portfolio - MISSING from migration"""
        try:
            if settings.DEBUG:
                print(f"💼 Fetching portfolio for user: {user_id}")
            
            # Update current prices if crypto service is available
            if self.crypto_service:
                await self._update_portfolio_prices()
            
            if settings.DEBUG:
                print(f"✅ Retrieved {len(self.portfolio_cache)} portfolio assets")
            
            return self.portfolio_cache
            
        except Exception as error:
            if settings.DEBUG:
                print(f"❌ Error fetching portfolio: {error}")
            return []
    
    async def add_asset(self, user_id: str, asset_data: dict) -> Dict:
        """Add asset to portfolio - MISSING from migration"""
        try:
            if settings.DEBUG:
                print(f"💼 Adding asset to portfolio: {asset_data}")
            
            # Generate new asset ID
            asset_id = f"asset-{len(self.portfolio_cache) + 1:03d}"
            
            # Get current price from crypto service
            current_price = asset_data.get("currentPrice", 0)
            if self.crypto_service:
                try:
                    coin_data = await self.crypto_service.get_individual_crypto_data(asset_data["symbol"].lower())
                    current_price = float(coin_data.get("current_price", 0))
                except:
                    pass
            
            new_asset = {
                "id": asset_id,
                "symbol": asset_data["symbol"],
                "name": asset_data.get("name", asset_data["symbol"]),
                "amount": float(asset_data["amount"]),
                "avgPrice": float(asset_data["avgPrice"]),
                "currentPrice": current_price,
                "value": float(asset_data["amount"]) * current_price,
                "change24h": 0,  # Will be updated by crypto service
                "isWatching": asset_data.get("isWatching", True),
                "createdAt": datetime.utcnow().isoformat()
            }
            
            # Add to cache (in real implementation, save to database)
            self.portfolio_cache.append(new_asset)
            
            if settings.DEBUG:
                print(f"✅ Added asset: {asset_id}")
            
            return new_asset
            
        except Exception as error:
            if settings.DEBUG:
                print(f"❌ Error adding asset: {error}")
            raise Exception("Failed to add asset to portfolio")
    
    async def update_asset(self, asset_id: str, asset_data: dict) -> Dict:
        """Update portfolio asset - MISSING from migration"""
        try:
            if settings.DEBUG:
                print(f"💼 Updating asset: {asset_id}")
            
            # Find and update asset
            for asset in self.portfolio_cache:
                if asset["id"] == asset_id:
                    # Update fields
                    if "amount" in asset_data:
                        asset["amount"] = float(asset_data["amount"])
                    if "avgPrice" in asset_data:
                        asset["avgPrice"] = float(asset_data["avgPrice"])
                    if "isWatching" in asset_data:
                        asset["isWatching"] = asset_data["isWatching"]
                    
                    # Recalculate value
                    asset["value"] = asset["amount"] * asset["currentPrice"]
                    
                    if settings.DEBUG:
                        print(f"✅ Updated asset: {asset_id}")
                    return asset
            
            if settings.DEBUG:
                print(f"⚠️ Asset {asset_id} not found")
            return {}
            
        except Exception as error:
            if settings.DEBUG:
                print(f"❌ Error updating asset: {error}")
            return {}
    
    async def remove_asset(self, asset_id: str) -> bool:
        """Remove asset from portfolio - MISSING from migration"""
        try:
            if settings.DEBUG:
                print(f"💼 Removing asset: {asset_id}")
            
            # Remove from cache
            original_length = len(self.portfolio_cache)
            self.portfolio_cache = [asset for asset in self.portfolio_cache if asset["id"] != asset_id]
            
            if len(self.portfolio_cache) < original_length:
                if settings.DEBUG:
                    print(f"✅ Removed asset: {asset_id}")
                return True
            else:
                if settings.DEBUG:
                    print(f"⚠️ Asset {asset_id} not found")
                return False
            
        except Exception as error:
            if settings.DEBUG:
                print(f"❌ Error removing asset: {error}")
            return False
    
    async def get_portfolio_summary(self, user_id: str = "default") -> Dict:
        """Get portfolio summary - MISSING from migration"""
        try:
            if settings.DEBUG:
                print(f"💼 Getting portfolio summary for user: {user_id}")
            
            # Update current prices
            if self.crypto_service:
                await self._update_portfolio_prices()
            
            total_value = sum(asset["value"] for asset in self.portfolio_cache)
            total_invested = sum(asset["amount"] * asset["avgPrice"] for asset in self.portfolio_cache)
            total_profit = total_value - total_invested
            profit_percentage = (total_profit / total_invested * 100) if total_invested > 0 else 0
            
            summary = {
                "totalValue": total_value,
                "totalInvested": total_invested,
                "totalProfit": total_profit,
                "profitPercentage": profit_percentage,
                "assetCount": len(self.portfolio_cache),
                "topAssets": sorted(self.portfolio_cache, key=lambda x: x["value"], reverse=True)[:3],
                "lastUpdated": datetime.utcnow().isoformat()
            }
            
            if settings.DEBUG:
                print(f"✅ Portfolio summary: {summary}")
            
            return summary
            
        except Exception as error:
            if settings.DEBUG:
                print(f"❌ Error getting portfolio summary: {error}")
            return {
                "totalValue": 0,
                "totalInvested": 0,
                "totalProfit": 0,
                "profitPercentage": 0,
                "assetCount": 0,
                "topAssets": [],
                "lastUpdated": datetime.utcnow().isoformat()
            }
    
    async def _update_portfolio_prices(self):
        """Update current prices for all portfolio assets"""
        try:
            if not self.crypto_service:
                return
            
            for asset in self.portfolio_cache:
                try:
                    # Get current price from crypto service
                    coin_data = await self.crypto_service.get_individual_crypto_data(asset["symbol"].lower())
                    current_price = float(coin_data.get("current_price", asset["currentPrice"]))
                    price_change = float(coin_data.get("price_change_percentage_24h", 0))
                    
                    # Update asset data
                    asset["currentPrice"] = current_price
                    asset["value"] = asset["amount"] * current_price
                    asset["change24h"] = price_change
                    
                except Exception as e:
                    if settings.DEBUG:
                        print(f"⚠️ Could not update price for {asset['symbol']}: {e}")
                    continue
            
            if settings.DEBUG:
                print("✅ Updated portfolio prices")
                
        except Exception as error:
            if settings.DEBUG:
                print(f"❌ Error updating portfolio prices: {error}")
    
    async def get_watchlist(self, user_id: str = "default") -> List[Dict]:
        """Get user watchlist - MISSING from migration"""
        try:
            if settings.DEBUG:
                print(f"👀 Fetching watchlist for user: {user_id}")
            
            # Return assets marked as watching
            watchlist = [asset for asset in self.portfolio_cache if asset["isWatching"]]
            
            if settings.DEBUG:
                print(f"✅ Retrieved {len(watchlist)} watchlist assets")
            
            return watchlist
            
        except Exception as error:
            if settings.DEBUG:
                print(f"❌ Error fetching watchlist: {error}")
            return []
    
    async def toggle_watchlist(self, asset_id: str) -> bool:
        """Toggle asset in watchlist - MISSING from migration"""
        try:
            if settings.DEBUG:
                print(f"👀 Toggling watchlist for asset: {asset_id}")
            
            # Find and toggle asset
            for asset in self.portfolio_cache:
                if asset["id"] == asset_id:
                    asset["isWatching"] = not asset["isWatching"]
                    
                    if settings.DEBUG:
                        print(f"✅ Toggled watchlist for asset: {asset_id} -> {asset['isWatching']}")
                    return True
            
            if settings.DEBUG:
                print(f"⚠️ Asset {asset_id} not found")
            return False
            
        except Exception as error:
            if settings.DEBUG:
                print(f"❌ Error toggling watchlist: {error}")
            return False 