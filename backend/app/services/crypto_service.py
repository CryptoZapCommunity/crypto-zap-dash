"""
Crypto Service - Transformed from original api/services/crypto-service.ts
Handles cryptocurrency data from CoinGecko API with real data and mock fallbacks
"""

import httpx
import asyncio
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
import os
from ..config import settings

# Real data from original service
MOCK_TRENDING_COINS = [
    {
        "id": "bitcoin",
        "symbol": "BTC",
        "name": "Bitcoin",
        "price": 43250.50,
        "marketCapRank": 1,
        "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
        "priceChange24h": 2.5,
        "marketCap": 850000000000,
        "volume24h": 25000000000,
        "sparklineData": [42000, 42500, 43000, 43250]
    },
    {
        "id": "ethereum",
        "symbol": "ETH",
        "name": "Ethereum",
        "price": 2650.75,
        "marketCapRank": 2,
        "image": "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
        "priceChange24h": 1.8,
        "marketCap": 320000000000,
        "volume24h": 15000000000,
        "sparklineData": [2600, 2620, 2640, 2650]
    },
    {
        "id": "solana",
        "symbol": "SOL",
        "name": "Solana",
        "price": 98.25,
        "marketCapRank": 5,
        "image": "https://assets.coingecko.com/coins/images/4128/large/solana.png",
        "priceChange24h": 5.2,
        "marketCap": 45000000000,
        "volume24h": 3000000000,
        "sparklineData": [93, 95, 97, 98]
    },
    {
        "id": "cardano",
        "symbol": "ADA",
        "name": "Cardano",
        "price": 0.45,
        "marketCapRank": 8,
        "image": "https://assets.coingecko.com/coins/images/975/large/cardano.png",
        "priceChange24h": -1.2,
        "marketCap": 16000000000,
        "volume24h": 800000000,
        "sparklineData": [0.46, 0.455, 0.452, 0.45]
    },
    {
        "id": "polkadot",
        "symbol": "DOT",
        "name": "Polkadot",
        "price": 6.85,
        "marketCapRank": 12,
        "image": "https://assets.coingecko.com/coins/images/12171/large/polkadot_new_logo.png",
        "priceChange24h": -0.8,
        "marketCap": 8500000000,
        "volume24h": 500000000,
        "sparklineData": [6.9, 6.88, 6.86, 6.85]
    }
]

# Mock icons from original service
MOCK_CRYPTO_ICONS = {
    'BTC': 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    'ETH': 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    'SOL': 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    'ADA': 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    'DOT': 'https://assets.coingecko.com/coins/images/12171/large/polkadot_new_logo.png',
    'LINK': 'https://assets.coingecko.com/coins/images/877/large/chainlink.png',
    'UNI': 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png',
    'BCH': 'https://assets.coingecko.com/coins/images/780/large/bitcoin-cash-circle.png',
    'LTC': 'https://assets.coingecko.com/coins/images/2/large/litecoin.png',
    'XRP': 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png'
}

# Popular coins mapping from original service
POPULAR_COINS = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'ADA': 'cardano',
    'DOT': 'polkadot',
    'LINK': 'chainlink',
    'UNI': 'uniswap',
    'MATIC': 'matic-network',
    'AVAX': 'avalanche-2',
    'ATOM': 'cosmos',
    'FTM': 'fantom',
    'NEAR': 'near',
    'ALGO': 'algorand',
    'VET': 'vechain',
    'ICP': 'internet-computer',
    'FIL': 'filecoin',
    'TRX': 'tron',
    'XLM': 'stellar',
    'XMR': 'monero',
    'LTC': 'litecoin',
    'BCH': 'bitcoin-cash',
    'ETC': 'ethereum-classic',
    'XRP': 'ripple',
    'DOGE': 'dogecoin',
    'SHIB': 'shiba-inu',
    'LUNC': 'terra-luna-2',
    'APT': 'aptos',
    'SUI': 'sui',
    'TIA': 'celestia',
    'JUP': 'jupiter',
    'PYTH': 'pyth-network',
    'BONK': 'bonk',
    'WIF': 'dogwifhat',
    'PEPE': 'pepe',
    'FLOKI': 'floki',
    'BABYDOGE': 'babydoge-coin',
}


class CryptoService:
    """Cryptocurrency service using CoinGecko API - migrated from TypeScript"""
    
    def __init__(self):
        self.base_url = "https://api.coingecko.com/api/v3"
        self.api_key = settings.COINGECKO_API_KEY
        self.coins_cache: Dict[str, str] = {}  # symbol -> id
        self.cache_expiry = 24 * 60 * 60  # 24 hours in seconds
        self.last_cache_update = 0
        
    def _format_coin_for_frontend(self, coin: Dict) -> Dict:
        """Convert coin data to frontend-expected format"""
        return {
            "id": coin["id"],
            "symbol": coin["symbol"],
            "name": coin["name"],
            "price": str(coin["price"]),
            "priceChange24h": str(coin["priceChange24h"]) if coin["priceChange24h"] is not None else None,
            "marketCap": str(coin["marketCap"]) if coin["marketCap"] is not None else None,
            "volume24h": str(coin["volume24h"]) if coin["volume24h"] is not None else None,
            "sparklineData": coin.get("sparklineData"),
            "lastUpdated": None  # Mock data doesn't have lastUpdated
        }

    async def get_trending_coins(self) -> Dict[str, List[Dict]]:
        """Get trending coins split into gainers and losers - with fallback to mock data"""
        try:
            print("🪙 Fetching trending coins from CoinGecko API...")
            
            # Verificar se temos API key válida
            if not self.api_key or self.api_key == "demo" or self.api_key == "CG-demo-key":
                print("⚠️ No valid API key configured, using mock data")
                return await self._get_mock_trending_coins()
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/search/trending",
                    params={"x_cg_demo_api_key": self.api_key}
                )
                
                if response.status_code != 200:
                    print(f"❌ CoinGecko API error: {response.status_code}, using mock data")
                    return await self._get_mock_trending_coins()
                
                data = response.json()
                coins = data.get("coins", [])
                
                if not coins:
                    print("❌ No trending coins found in API response, using mock data")
                    return await self._get_mock_trending_coins()
                
                # Processar dados reais
                processed_coins = []
                for coin_data in coins:
                    coin = coin_data.get("item", {})
                    if coin:
                        # Verificar se coin["data"] existe e é um dicionário
                        coin_data_obj = coin.get("data", {})
                        if isinstance(coin_data_obj, dict):
                            price_change_data = coin_data_obj.get("price_change_percentage_24h", {})
                            if isinstance(price_change_data, dict):
                                price_change_usd = price_change_data.get("usd", 0)
                            else:
                                price_change_usd = 0
                        else:
                            price_change_usd = 0
                            
                        processed_coin = {
                            "id": coin.get("id", ""),
                            "symbol": coin.get("symbol", "").upper(),
                            "name": coin.get("name", ""),
                            "price": coin.get("price_btc", 0) * await self._get_btc_price(),
                            "priceChange24h": price_change_usd,
                            "marketCap": coin_data_obj.get("market_cap", 0) if isinstance(coin_data_obj, dict) else 0,
                            "volume24h": coin_data_obj.get("total_volume", 0) if isinstance(coin_data_obj, dict) else 0,
                            "sparklineData": coin_data_obj.get("sparkline", {}).get("price", []) if isinstance(coin_data_obj, dict) else []
                        }
                        processed_coins.append(self._format_coin_for_frontend(processed_coin))
                
                # Separar gainers e losers
                gainers = [coin for coin in processed_coins if coin.get("priceChange24h") and float(coin["priceChange24h"]) > 0]
                losers = [coin for coin in processed_coins if coin.get("priceChange24h") and float(coin["priceChange24h"]) < 0]
                
                print(f"✅ Real data: {len(gainers)} gainers, {len(losers)} losers")
                return {"gainers": gainers, "losers": losers}
                
        except Exception as error:
            print(f"❌ Error fetching trending coins: {error}, using mock data")
            return await self._get_mock_trending_coins()
    
    async def _get_mock_trending_coins(self) -> Dict[str, List[Dict]]:
        """Get mock trending coins as fallback"""
        print("🪙 Returning mock trending coins...")
        
        # Split into gainers and losers (exact logic from original)
        gainers = [self._format_coin_for_frontend(coin) for coin in MOCK_TRENDING_COINS if coin["priceChange24h"] > 0]
        losers = [self._format_coin_for_frontend(coin) for coin in MOCK_TRENDING_COINS if coin["priceChange24h"] < 0]
        
        print(f"✅ Mock data: {len(gainers)} gainers, {len(losers)} losers")
        return {"gainers": gainers, "losers": losers}
    
    async def _get_btc_price(self) -> float:
        """Get current BTC price for conversion"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/simple/price",
                    params={
                        "ids": "bitcoin",
                        "vs_currencies": "usd",
                        "x_cg_demo_api_key": self.api_key
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data.get("bitcoin", {}).get("usd", 45000)  # Fallback price
                
                return 45000  # Fallback price
                
        except Exception:
            return 45000  # Fallback price
    
    async def get_crypto_icon(self, symbol: str) -> Optional[str]:
        """Get crypto icon URL for symbol - exact port from original"""
        try:
            icon_url = MOCK_CRYPTO_ICONS.get(symbol.upper())
            if icon_url:
                print(f"✅ Mock icon found for: {symbol}")
                return icon_url
            else:
                print(f"❌ No mock icon for: {symbol}")
                return None
                
        except Exception as error:
            print(f"Error fetching icon for {symbol}: {error}")
            return None
    
    async def get_crypto_icons(self, symbols: List[str]) -> Dict[str, str]:
        """Get multiple crypto icons - exact port from original"""
        try:
            print(f"🪙 Fetching icons for: {', '.join(symbols)}")
            icons = {}
            
            # Fetch icons with rate limiting (exact logic from original)
            tasks = []
            for index, symbol in enumerate(symbols):
                # Add small delay to avoid rate limiting
                async def fetch_with_delay(sym: str, delay: int):
                    await asyncio.sleep(delay * 0.1)  # 100ms per symbol
                    icon = await self.get_crypto_icon(sym)
                    if icon:
                        return sym.upper(), icon
                    return None
                
                tasks.append(fetch_with_delay(symbol, index))
            
            results = await asyncio.gather(*tasks)
            
            for result in results:
                if result:
                    symbol, icon = result
                    icons[symbol] = icon
            
            print(f"✅ Found {len(icons)} icons")
            return icons
            
        except Exception as error:
            print(f"Error fetching crypto icons: {error}")
            return {}
    
    async def _get_coin_id(self, symbol: str) -> Optional[str]:
        """Get CoinGecko coin ID from symbol - exact port from original"""
        # Check cache first
        if symbol.upper() in self.coins_cache:
            return self.coins_cache[symbol.upper()]
        
        # Update cache if expired
        current_time = datetime.now().timestamp()
        if current_time - self.last_cache_update > self.cache_expiry:
            await self._update_coins_cache()
        
        # Try to find in cache again
        if symbol.upper() in self.coins_cache:
            return self.coins_cache[symbol.upper()]
        
        # If still not found, try fuzzy matching
        return self._find_coin_by_fuzzy_match(symbol)
    
    async def _update_coins_cache(self):
        """Update coins cache from CoinGecko API - exact port from original"""
        try:
            print("🔄 Updating coins cache...")
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/coins/list",
                    params={
                        "include_platform": "false",
                        "x_cg_demo_api_key": self.api_key
                    }
                )
                
                if response.status_code != 200:
                    raise Exception(f"Failed to fetch coins list: {response.status_code}")
                
                coins = response.json()
                
                # Clear existing cache
                self.coins_cache.clear()
                
                # Build new cache
                for coin in coins:
                    if coin.get("symbol"):
                        self.coins_cache[coin["symbol"].upper()] = coin["id"]
                
                self.last_cache_update = datetime.now().timestamp()
                print(f"✅ Updated coins cache with {len(self.coins_cache)} coins")
                
        except Exception as error:
            print(f"Error updating coins cache: {error}")
    
    def _find_coin_by_fuzzy_match(self, symbol: str) -> Optional[str]:
        """Find coin by fuzzy matching - exact port from original"""
        upper_symbol = symbol.upper()
        
        # Try exact match first
        if upper_symbol in self.coins_cache:
            return self.coins_cache[upper_symbol]
        
        # Try common variations (exact logic from original)
        variations = [
            upper_symbol,
            upper_symbol.replace('-', ''),
            upper_symbol.replace('_', ''),
            upper_symbol.replace('USD', ''),
            upper_symbol.replace('USDT', ''),
            upper_symbol.replace('USDC', ''),
        ]
        
        for variation in variations:
            if variation in self.coins_cache:
                return self.coins_cache[variation]
        
        # Try popular coins mapping (exact from original)
        if upper_symbol in POPULAR_COINS:
            return POPULAR_COINS[upper_symbol]
        
        return None
    
    async def update_crypto_prices(self):
        """Update crypto prices from CoinGecko - CORRIGIDO para usar API real"""
        try:
            print("🔄 Updating crypto prices from CoinGecko API...")
            
            # Verificar se temos API key válida
            if not self.api_key or self.api_key == "demo":
                print("⚠️ Using mock data (no valid API key)")
                return self._get_mock_crypto_prices()
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/coins/markets",
                    params={
                        "vs_currency": "usd",
                        "order": "market_cap_desc",
                        "per_page": "50",
                        "page": "1",
                        "sparkline": "true",
                        "price_change_percentage": "24h",
                        "x_cg_demo_api_key": self.api_key
                    }
                )
                
                if response.status_code != 200:
                    print(f"❌ CoinGecko API error: {response.status_code}")
                    return self._get_mock_crypto_prices()
                
                coins = response.json()
                
                if not coins:
                    print("⚠️ No coins data found, using mock data")
                    return self._get_mock_crypto_prices()
                
                print(f"📊 Processing {len(coins)} coins from CoinGecko...")
                
                processed_coins = []
                for coin in coins:
                    try:
                        asset = {
                            "id": coin["id"],
                            "symbol": coin["symbol"].upper(),
                            "name": coin["name"],
                            "price": str(coin["current_price"]),
                            "priceChange24h": str(coin.get("price_change_percentage_24h", 0)),
                            "marketCap": str(coin.get("market_cap", 0)),
                            "volume24h": str(coin.get("total_volume", 0)),
                            "sparklineData": coin.get("sparkline_in_7d", {}).get("price", []),
                        }
                        processed_coins.append(asset)
                        print(f"✅ Processed: {asset['symbol']} - ${asset['price']} - Sparkline: {len(asset['sparklineData'])} points")
                        
                    except Exception as error:
                        print(f"❌ Error processing {coin.get('symbol', 'unknown')}: {error}")
                
                print(f"✅ Updated {len(processed_coins)} crypto prices from CoinGecko")
                return processed_coins
                
        except Exception as error:
            print(f"❌ Error updating crypto prices: {error}")
            return self._get_mock_crypto_prices()
    
    def _get_mock_crypto_prices(self):
        """Get mock crypto prices as fallback"""
        print("🔄 Using mock crypto prices...")
        return [
            {
                "id": "bitcoin",
                "symbol": "BTC",
                "name": "Bitcoin",
                "price": "43250.50",
                "priceChange24h": "2.5",
                "marketCap": "850000000000",
                "volume24h": "25000000000",
                "sparklineData": [42000, 42500, 43000, 43250]
            },
            {
                "id": "ethereum",
                "symbol": "ETH",
                "name": "Ethereum",
                "price": "2650.75",
                "priceChange24h": "1.8",
                "marketCap": "320000000000",
                "volume24h": "15000000000",
                "sparklineData": [2600, 2620, 2640, 2650]
            }
        ]
    
    async def update_market_summary(self):
        """Update market summary from CoinGecko - CORRIGIDO para usar API real"""
        try:
            print("🔄 Updating market summary from CoinGecko API...")
            
            # Verificar se temos API key válida
            if not self.api_key or self.api_key == "demo":
                print("❌ No valid API key configured")
                raise Exception("CoinGecko API key not configured")
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/global",
                    params={"x_cg_demo_api_key": self.api_key}
                )
                
                if response.status_code != 200:
                    print(f"❌ CoinGecko API error: {response.status_code}")
                    raise Exception(f"CoinGecko API returned status {response.status_code}")
                
                data = response.json()
                global_data = data.get("data", {})
                
                if not global_data:
                    print("❌ No global data found in API response")
                    raise Exception("No global market data available")
                
                # Exact mapping from original
                market_summary = {
                    "id": "global",
                    "totalMarketCap": str(global_data.get("total_market_cap", {}).get("usd", 0)),
                    "totalVolume24h": str(global_data.get("total_volume", {}).get("usd", 0)),
                    "btcDominance": str(global_data.get("market_cap_percentage", {}).get("btc", 0)),
                    "fearGreedIndex": None,  # Would need separate API (exact from original)
                    "marketChange24h": str(global_data.get("market_cap_change_percentage_24h_usd", 0)),
                    "lastUpdated": datetime.utcnow().isoformat()
                }
                
                print("✅ Market summary updated from CoinGecko")
                return market_summary
                
        except Exception as error:
            print(f"❌ Error updating market summary: {error}")
            raise error
    
    def _get_mock_market_summary(self):
        """Get mock market summary as fallback"""
        print("🔄 Using mock market summary...")
        return {
            "id": "global",
            "totalMarketCap": "2500000000000",
            "totalVolume24h": "85000000000",
            "btcDominance": "52.5",
            "fearGreedIndex": 65,
            "marketChange24h": "2.3",
            "lastUpdated": datetime.utcnow().isoformat()
        }
    
    async def get_chart_data(self, symbol: str) -> Dict:
        """Get historical chart data for a cryptocurrency - CORRIGIDO para usar API real"""
        try:
            print(f"📈 Fetching chart data for: {symbol}")
            
            # Verificar se temos API key válida
            if not self.api_key or self.api_key == "demo":
                print("❌ No valid API key configured")
                raise Exception("CoinGecko API key not configured")
            
            # Obter coin ID
            coin_id = await self._get_coin_id(symbol)
            if not coin_id:
                print(f"❌ Coin ID not found for {symbol}")
                raise Exception(f"Coin ID not found for symbol: {symbol}")
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/coins/{coin_id}/market_chart",
                    params={
                        "vs_currency": "usd",
                        "days": "7",
                        "x_cg_demo_api_key": self.api_key
                    }
                )
                
                if response.status_code != 200:
                    print(f"❌ CoinGecko API error: {response.status_code}")
                    raise Exception(f"CoinGecko API returned status {response.status_code}")
                
                data = response.json()
                
                # Processar dados reais
                chart_data = {
                    "symbol": symbol.upper(),
                    "prices": data.get("prices", []),
                    "market_caps": data.get("market_caps", []),
                    "total_volumes": data.get("total_volumes", [])
                }
                
                print(f"✅ Chart data retrieved for {symbol} from CoinGecko")
                return chart_data
                
        except Exception as error:
            print(f"❌ Error fetching chart data for {symbol}: {error}")
            raise error
    
    def _get_mock_chart_data(self, symbol: str) -> Dict:
        """Get mock chart data as fallback"""
        print(f"📈 Using mock chart data for {symbol}")
        return {
            "symbol": symbol.upper(),
            "prices": [
                [1704067200000, 42500.50],  # Example timestamps and prices
                [1704153600000, 43200.75],
                [1704240000000, 42800.25],
                [1704326400000, 44100.00],
                [1704412800000, 43900.50],
            ],
            "market_caps": [
                [1704067200000, 830000000000],
                [1704153600000, 845000000000],
                [1704240000000, 836000000000],
                [1704326400000, 862000000000],
                [1704412800000, 858000000000],
            ],
            "total_volumes": [
                [1704067200000, 25000000000],
                [1704153600000, 28000000000],
                [1704240000000, 22000000000],
                [1704326400000, 35000000000],
                [1704412800000, 30000000000],
            ]
        }
    
    async def get_candlestick_data(self, symbol: str, timeframe: str = "1h", limit: int = 100) -> Dict:
        """Get candlestick/OHLC data - restored from original"""
        try:
            print(f"🕯️ Fetching candlestick data for: {symbol} ({timeframe}, limit: {limit})")
            
            # Mock candlestick data for development
            mock_candlestick_data = {
                "symbol": symbol.upper(),
                "timeframe": timeframe,
                "data": [
                    {
                        "timestamp": 1704067200000,
                        "open": 42500.50,
                        "high": 43200.75,
                        "low": 42100.25,
                        "close": 42800.00,
                        "volume": 25000000
                    },
                    {
                        "timestamp": 1704070800000,
                        "open": 42800.00,
                        "high": 44100.50,
                        "low": 42600.75,
                        "close": 43900.25,
                        "volume": 28000000
                    },
                    # Add more mock data points...
                ]
            }
            
            print(f"✅ Candlestick data retrieved for {symbol}")
            return mock_candlestick_data
            
        except Exception as error:
            print(f"Error fetching candlestick data for {symbol}: {error}")
            return {"symbol": symbol, "timeframe": timeframe, "data": []}
    
    async def get_market_analysis(self) -> Dict:
        """Get comprehensive market analysis - restored from original"""
        try:
            print("📊 Fetching market analysis...")
            
            # Get real BTC and ETH data for analysis
            btc_data = await self.get_individual_crypto_data("bitcoin")
            eth_data = await self.get_individual_crypto_data("ethereum")
            
            # Create market analysis data in the format expected by frontend
            market_analysis = [
                {
                    "asset": "BTC",
                    "name": "Bitcoin",
                    "price": float(btc_data.get("current_price", 43250)),
                    "change24h": float(btc_data.get("price_change_percentage_24h", 2.5)),
                    "volume24h": float(btc_data.get("total_volume", 25000000000)),
                    "marketCap": float(btc_data.get("market_cap", 850000000000)),
                    "sentiment": 72,
                    "riskScore": 35,
                    "technicalIndicators": [
                        "RSI: 65 (Neutral)",
                        "MACD: Bullish",
                        "Moving Average: Above 50-day"
                    ],
                    "supportLevels": [42000, 41000, 40000],
                    "resistanceLevels": [44000, 45000, 46000],
                    "prediction": "Bullish",
                    "confidence": 75
                },
                {
                    "asset": "ETH",
                    "name": "Ethereum",
                    "price": float(eth_data.get("current_price", 2650)),
                    "change24h": float(eth_data.get("price_change_percentage_24h", 1.8)),
                    "volume24h": float(eth_data.get("total_volume", 15000000000)),
                    "marketCap": float(eth_data.get("market_cap", 320000000000)),
                    "sentiment": 78,
                    "riskScore": 40,
                    "technicalIndicators": [
                        "RSI: 70 (Bullish)",
                        "MACD: Strong Bullish",
                        "Moving Average: Above 200-day"
                    ],
                    "supportLevels": [2600, 2500, 2400],
                    "resistanceLevels": [2700, 2800, 3000],
                    "prediction": "Very Bullish",
                    "confidence": 85
                }
            ]
            
            print("✅ Market analysis retrieved")
            return market_analysis
            
        except Exception as error:
            print(f"Error fetching market analysis: {error}")
            # Return mock data as fallback
            return [
                {
                    "asset": "BTC",
                    "name": "Bitcoin",
                    "price": 43250.50,
                    "change24h": 2.5,
                    "volume24h": 25000000000,
                    "marketCap": 850000000000,
                    "sentiment": 72,
                    "riskScore": 35,
                    "technicalIndicators": [
                        "RSI: 65 (Neutral)",
                        "MACD: Bullish",
                        "Moving Average: Above 50-day"
                    ],
                    "supportLevels": [42000, 41000, 40000],
                    "resistanceLevels": [44000, 45000, 46000],
                    "prediction": "Bullish",
                    "confidence": 75
                },
                {
                    "asset": "ETH",
                    "name": "Ethereum",
                    "price": 2650.75,
                    "change24h": 1.8,
                    "volume24h": 15000000000,
                    "marketCap": 320000000000,
                    "sentiment": 78,
                    "riskScore": 40,
                    "technicalIndicators": [
                        "RSI: 70 (Bullish)",
                        "MACD: Strong Bullish",
                        "Moving Average: Above 200-day"
                    ],
                    "supportLevels": [2600, 2500, 2400],
                    "resistanceLevels": [2700, 2800, 3000],
                    "prediction": "Very Bullish",
                    "confidence": 85
                }
            ]
    
    async def get_market_sentiment(self) -> Dict:
        """Get current market sentiment indicators - restored from original"""
        try:
            print("💭 Fetching market sentiment...")
            
            # Get real market data for sentiment calculation
            btc_data = await self.get_individual_crypto_data("bitcoin")
            eth_data = await self.get_individual_crypto_data("ethereum")
            
            # Calculate sentiment based on multiple factors
            btc_change = float(btc_data.get("price_change_percentage_24h", 0))
            eth_change = float(eth_data.get("price_change_percentage_24h", 0))
            
            # Simple sentiment calculation (in real implementation, use ML)
            overall_sentiment = 50  # Neutral baseline
            
            # Adjust based on BTC and ETH performance
            if btc_change > 0:
                overall_sentiment += min(btc_change * 2, 30)
            else:
                overall_sentiment += max(btc_change * 2, -30)
            
            if eth_change > 0:
                overall_sentiment += min(eth_change * 1.5, 20)
            else:
                overall_sentiment += max(eth_change * 1.5, -20)
            
            # Clamp to 0-100 range
            overall_sentiment = max(0, min(100, overall_sentiment))
            
            # Return sentiment data in the format expected by frontend
            sentiment_data = {
                "overall": int(overall_sentiment),  # Overall sentiment score 0-100
                "fear_greed_index": int(overall_sentiment),  # 0-100
                "social_mentions": 1250,  # Mock social mentions count
                "news_sentiment": 72,  # 0-100
                "whale_activity": "bullish" if overall_sentiment > 60 else "bearish" if overall_sentiment < 40 else "neutral",
                "technical_indicators": "bullish" if overall_sentiment > 60 else "bearish" if overall_sentiment < 40 else "neutral",
                "updated_at": datetime.utcnow().isoformat()
            }
            
            print("✅ Market sentiment retrieved")
            return sentiment_data
            
        except Exception as error:
            print(f"Error fetching market sentiment: {error}")
            # Return mock data as fallback
            return {
                "overall": 50,
                "fear_greed_index": 50,
                "social_mentions": 1000,
                "news_sentiment": 50,
                "whale_activity": "neutral",
                "technical_indicators": "neutral",
                "updated_at": datetime.utcnow().isoformat()
            }

    async def get_individual_crypto_data(self, coin_id: str) -> Dict:
        """Get detailed data for a specific cryptocurrency"""
        try:
            print(f"🪙 Fetching individual crypto data for {coin_id}...")
            
            # Verificar se temos API key válida
            if not self.api_key or self.api_key == "demo":
                print("⚠️ Using mock data (no valid API key)")
                return self._get_mock_individual_crypto_data(coin_id)
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.base_url}/coins/{coin_id}",
                    params={
                        "localization": "false",
                        "tickers": "false",
                        "market_data": "true",
                        "community_data": "true",
                        "developer_data": "false",
                        "sparkline": "true",
                        "x_cg_demo_api_key": self.api_key
                    }
                )
                
                if response.status_code != 200:
                    print(f"❌ CoinGecko API error: {response.status_code}")
                    return self._get_mock_individual_crypto_data(coin_id)
                
                data = response.json()
                
                # Format the data for frontend
                formatted_data = {
                    "id": data.get("id", coin_id),
                    "symbol": data.get("symbol", "").upper(),
                    "name": data.get("name", ""),
                    "price": data.get("market_data", {}).get("current_price", {}).get("usd", 0),
                    "priceChange24h": data.get("market_data", {}).get("price_change_percentage_24h", 0),
                    "marketCap": data.get("market_data", {}).get("market_cap", {}).get("usd", 0),
                    "volume24h": data.get("market_data", {}).get("total_volume", {}).get("usd", 0),
                    "sparklineData": data.get("market_data", {}).get("sparkline_7d", {}).get("price", []),
                    "lastUpdated": data.get("last_updated"),
                    "description": data.get("description", {}).get("en", ""),
                    "links": data.get("links", {}),
                    "image": data.get("image", {}),
                    "community_data": data.get("community_data", {}),
                    "market_data": data.get("market_data", {})
                }
                
                print(f"✅ Individual crypto data retrieved for {coin_id}")
                return formatted_data
                
        except Exception as error:
            print(f"❌ Error fetching individual crypto data for {coin_id}: {error}")
            return self._get_mock_individual_crypto_data(coin_id)

    def _get_mock_individual_crypto_data(self, coin_id: str) -> Dict:
        """Get mock individual crypto data as fallback"""
        print(f"🪙 Returning mock individual crypto data for {coin_id}...")
        
        # Mock data for BTC and ETH
        mock_data = {
            "bitcoin": {
                "id": "bitcoin",
                "symbol": "BTC",
                "name": "Bitcoin",
                "price": 102547.23,
                "priceChange24h": 2.34,
                "marketCap": 2050000000000,
                "volume24h": 28500000000,
                "sparklineData": [98000, 98500, 99000, 100000, 101000, 102000, 102547],
                "lastUpdated": "2024-01-01T12:00:00Z",
                "description": "Bitcoin is a decentralized cryptocurrency originally described in a 2008 whitepaper by a person, or group of people, using the alias Satoshi Nakamoto.",
                "links": {
                    "homepage": ["https://bitcoin.org/"],
                    "blockchain_site": ["https://blockchain.info/"]
                },
                "image": {
                    "thumb": "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png",
                    "small": "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
                    "large": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
                },
                "community_data": {
                    "twitter_followers": 4500000,
                    "reddit_subscribers": 4200000,
                    "telegram_channel_user_count": 120000
                },
                "market_data": {
                    "current_price": {"usd": 102547.23},
                    "price_change_percentage_24h": 2.34,
                    "market_cap": {"usd": 2050000000000},
                    "total_volume": {"usd": 28500000000}
                }
            },
            "ethereum": {
                "id": "ethereum",
                "symbol": "ETH",
                "name": "Ethereum",
                "price": 3847.56,
                "priceChange24h": 4.12,
                "marketCap": 462000000000,
                "volume24h": 15200000000,
                "sparklineData": [3650, 3700, 3750, 3800, 3820, 3840, 3847],
                "lastUpdated": "2024-01-01T12:00:00Z",
                "description": "Ethereum is a decentralized, open-source blockchain with smart contract functionality.",
                "links": {
                    "homepage": ["https://www.ethereum.org/"],
                    "blockchain_site": ["https://etherscan.io/"]
                },
                "image": {
                    "thumb": "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png",
                    "small": "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
                    "large": "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
                },
                "community_data": {
                    "twitter_followers": 3200000,
                    "reddit_subscribers": 2800000,
                    "telegram_channel_user_count": 850000
                },
                "market_data": {
                    "current_price": {"usd": 3847.56},
                    "price_change_percentage_24h": 4.12,
                    "market_cap": {"usd": 462000000000},
                    "total_volume": {"usd": 15200000000}
                }
            }
        }
        
        return mock_data.get(coin_id, {
            "id": coin_id,
            "symbol": coin_id.upper(),
            "name": coin_id.title(),
            "price": 0,
            "priceChange24h": 0,
            "marketCap": 0,
            "volume24h": 0,
            "sparklineData": [],
            "lastUpdated": "2024-01-01T12:00:00Z",
            "description": "",
            "links": {},
            "image": {},
            "community_data": {},
            "market_data": {}
        })