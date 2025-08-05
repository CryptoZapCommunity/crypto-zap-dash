"""
News Service - Transformed from original api/services/news-service.ts
Handles news aggregation with real data from multiple APIs
"""

import httpx
import os
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from ..config import settings


class NewsService:
    """News aggregation service with real data from multiple APIs"""
    
    def __init__(self):
        self.news_api_key = settings.NEWS_API_KEY
        self.crypto_panic_api_key = settings.CRYPTO_PANIC_API_KEY
        self.alpha_vantage_api_key = settings.ALPHA_VANTAGE_API_KEY
    
    async def update_general_news(self, category: Optional[str] = None, limit: int = 20) -> List[Dict]:
        """Update general news from real APIs"""
        try:
            print("📰 Fetching general news from real APIs...")
            
            news = []
            
            # 1. Try NewsAPI for general financial news
            if self.news_api_key and self.news_api_key != "" and self.news_api_key != "demo":
                try:
                    newsapi_articles = await self._get_newsapi_articles(category, limit)
                    news.extend(newsapi_articles)
                    print(f"✅ Retrieved {len(newsapi_articles)} NewsAPI articles")
                except Exception as e:
                    print(f"⚠️ NewsAPI fetch failed: {e}")
            
            # 2. Try CryptoPanic for crypto-specific news
            if self.crypto_panic_api_key and self.crypto_panic_api_key != "" and self.crypto_panic_api_key != "demo":
                try:
                    cryptopanic_articles = await self._get_cryptopanic_articles(limit)
                    news.extend(cryptopanic_articles)
                    print(f"✅ Retrieved {len(cryptopanic_articles)} CryptoPanic articles")
                except Exception as e:
                    print(f"⚠️ CryptoPanic fetch failed: {e}")
            
            # 3. Use public APIs as fallback
            if not news:
                news = await self._get_public_news_data(category, limit)
            
            print(f"📰 Total news articles: {len(news)}")
            return news
                
        except Exception as error:
            print(f"❌ Error fetching news: {error}")
            return []
    
    async def _get_newsapi_articles(self, category: Optional[str] = None, limit: int = 20) -> List[Dict]:
        """Get articles from NewsAPI"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                # Build query based on category
                query = "cryptocurrency OR bitcoin OR ethereum"
                if category == "geopolitics":
                    query += " AND (geopolitics OR politics OR government)"
                elif category == "macro":
                    query += " AND (economy OR inflation OR fed OR central bank)"
                
                response = await client.get(
                    "https://newsapi.org/v2/everything",
                    params={
                        "q": query,
                        "language": "en",
                        "sortBy": "publishedAt",
                        "pageSize": limit,
                        "apiKey": self.news_api_key
                    }
                )
                
                if response.status_code != 200:
                    raise Exception(f"NewsAPI error: {response.status_code}")
                
                data = response.json()
                articles = data.get("articles", [])
                processed_articles = []
                
                for article in articles:
                    processed_article = {
                        "id": f"newsapi-{article.get('publishedAt', '')}-{hash(article.get('title', ''))}",
                        "title": article.get("title", ""),
                        "description": article.get("description", ""),
                        "url": article.get("url", ""),
                        "imageUrl": article.get("urlToImage", ""),
                        "source": article.get("source", {}).get("name", ""),
                        "publishedAt": article.get("publishedAt", ""),
                        "category": category or "general",
                        "sentiment": "neutral",  # Would need sentiment analysis API
                        "createdAt": datetime.now().isoformat()
                    }
                    processed_articles.append(processed_article)
                
                return processed_articles
                
        except Exception as error:
            print(f"Error fetching NewsAPI articles: {error}")
            return []
    
    async def _get_cryptopanic_articles(self, limit: int = 20) -> List[Dict]:
        """Get articles from CryptoPanic"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    "https://cryptopanic.com/api/v1/posts/",
                    params={
                        "auth_token": self.crypto_panic_api_key,
                        "kind": "news",
                        "filter": "hot",
                        "limit": limit
                    }
                )
                
                if response.status_code != 200:
                    raise Exception(f"CryptoPanic API error: {response.status_code}")
                
                data = response.json()
                articles = data.get("results", [])
                processed_articles = []
                
                for article in articles:
                    processed_article = {
                        "id": f"cryptopanic-{article.get('id', '')}",
                        "title": article.get("title", ""),
                        "description": article.get("metadata", {}).get("description", ""),
                        "url": article.get("url", ""),
                        "imageUrl": article.get("metadata", {}).get("image", {}).get("original_url", ""),
                        "source": article.get("source", {}).get("title", ""),
                        "publishedAt": article.get("published_at", ""),
                        "category": "crypto",
                        "sentiment": article.get("vote", "neutral"),
                        "createdAt": datetime.now().isoformat()
                    }
                    processed_articles.append(processed_article)
                
                return processed_articles
                
        except Exception as error:
            print(f"Error fetching CryptoPanic articles: {error}")
            return []
    
    async def _get_public_news_data(self, category: Optional[str] = None, limit: int = 20) -> List[Dict]:
        """Get news data from public sources when APIs are not available"""
        try:
            print("📰 Using public sources for news data...")
            
            # Use public crypto news APIs that don't require keys
            async with httpx.AsyncClient(timeout=30.0) as client:
                articles = []
                
                # Try CoinGecko news (public API)
                try:
                    response = await client.get(
                        "https://api.coingecko.com/api/v3/news",
                        timeout=10.0
                    )
                    if response.status_code == 200:
                        data = response.json()
                        for item in data.get("data", [])[:limit]:
                            article = {
                                "id": f"coingecko-{item.get('id', '')}",
                                "title": item.get("title", ""),
                                "description": item.get("description", ""),
                                "url": item.get("url", ""),
                                "imageUrl": item.get("image", {}).get("thumb", ""),
                                "source": "CoinGecko",
                                "publishedAt": item.get("published_at", datetime.now().isoformat()),
                                "category": category or "crypto",
                                "sentiment": "neutral",
                                "createdAt": datetime.now().isoformat()
                            }
                            articles.append(article)
                        print(f"✅ Retrieved {len(articles)} CoinGecko news articles")
                except Exception as e:
                    print(f"⚠️ CoinGecko news failed: {e}")
                
                # If we don't have enough articles, try alternative sources
                if len(articles) < limit:
                    try:
                        # Try CryptoCompare news (public API)
                        response = await client.get(
                            "https://min-api.cryptocompare.com/data/v2/news/?lang=EN",
                            timeout=10.0
                        )
                        if response.status_code == 200:
                            data = response.json()
                            for item in data.get("Data", [])[:limit-len(articles)]:
                                article = {
                                    "id": f"cryptocompare-{item.get('id', '')}",
                                    "title": item.get("title", ""),
                                    "description": item.get("body", ""),
                                    "url": item.get("url", ""),
                                    "imageUrl": item.get("imageurl", ""),
                                    "source": "CryptoCompare",
                                    "publishedAt": item.get("published_on", datetime.now().isoformat()),
                                    "category": category or "crypto",
                                    "sentiment": "neutral",
                                    "createdAt": datetime.now().isoformat()
                                }
                                articles.append(article)
                            print(f"✅ Retrieved {len(articles)} total news articles")
                    except Exception as e:
                        print(f"⚠️ CryptoCompare news failed: {e}")
                
                return articles
                
        except Exception as error:
            print(f"Error fetching public news data: {error}")
            return []
    
    async def update_geopolitical_news(self, limit: int = 20) -> List[Dict]:
        """Update geopolitical news specifically"""
        return await self.update_general_news("geopolitics", limit)
    
    async def update_macro_news(self, limit: int = 20) -> List[Dict]:
        """Update macroeconomic news specifically"""
        return await self.update_general_news("macro", limit)
    
    async def update_crypto_news(self, limit: int = 20) -> List[Dict]:
        """Update crypto-specific news"""
        return await self.update_general_news("crypto", limit)
    
    async def get_news(self, limit: int = 20, category: Optional[str] = None) -> List[Dict]:
        """Get news data - wrapper for update_general_news"""
        return await self.update_general_news(category, limit)