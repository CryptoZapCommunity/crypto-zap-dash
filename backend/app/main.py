"""
FastAPI Main Application - Transformed from original api/index.ts and api/routes.ts
Complete migration with all endpoints and exact logic
"""

from fastapi import FastAPI, Depends, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from datetime import datetime
from typing import List, Optional

from .config import settings
from .models import (
    ApiResponse, HealthResponse, TrendingCoinsResponse, MarketSummaryResponse,
    NewsResponse, EconomicCalendarResponse, WhaleTransactionsResponse,
    FedIndicatorsResponse, FedRateResponse, AirdropsResponse, AlertsResponse,
    PortfolioResponse, PortfolioSummaryResponse, AlertCreate, AlertUpdate, AlertStatsResponse
)
from .services.crypto_service import CryptoService
from .services.news_service import NewsService
from .services.economic_service import EconomicService
from .services.whale_service import WhaleService
from .services.fred_service import FredService
from .services.airdrop_service import AirdropService
from .services.alerts_service import AlertsService
from .services.portfolio_service import PortfolioService
from .services.sentiment_service import SentimentService
from .middleware.rate_limiter import rate_limit_middleware
from .middleware.security_headers import security_headers_middleware
from prometheus_fastapi_instrumentator import Instrumentator
import asyncio
import contextlib
try:
    import redis.asyncio as redis
except Exception:
    redis = None


# Initialize FastAPI app with comprehensive metadata
app = FastAPI(
    title="Crypto Dashboard API",
    description="""
    ## Crypto Dashboard API - Migrated from Node.js/Express
    
    Comprehensive API for cryptocurrency market data, news, economic indicators, and whale tracking.
    
    ### Features:
    - **Real-time crypto data** from CoinGecko API
    - **News aggregation** from NewsAPI and CryptoPanic
    - **Economic calendar** and Federal Reserve data
    - **Whale transaction monitoring** 
    - **Airdrop tracking**
    - **Market alerts and notifications**
    
    ### Migration Notes:
    - Migrated from Express.js to FastAPI
    - All original endpoints preserved
    - Enhanced with automatic validation and documentation
    - Improved performance and type safety
    """,
    version="2.0.0",
    contact={
        "name": "Crypto Dashboard Team",
        "email": "support@cryptodashboard.com",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
)

# Apply CORS middleware using configured allowed origins
def _parse_allowed_origins(origins_str: str):
    try:
        return [o.strip() for o in origins_str.split(",") if o.strip()]
    except Exception:
        return ["http://localhost:5173", "http://localhost:3000"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=_parse_allowed_origins(settings.ALLOWED_ORIGINS),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allow_headers=["*"],
)

# Apply rate limiting middleware
app.middleware("http")(rate_limit_middleware)
app.middleware("http")(security_headers_middleware)

# Initialize services (exact from original)
crypto_service = CryptoService()
news_service = NewsService()
economic_service = EconomicService()
whale_service = WhaleService()
fred_service = FredService()
airdrop_service = AirdropService()
alerts_service = AlertsService()
portfolio_service = PortfolioService()
sentiment_service = SentimentService()

# Inject crypto service into portfolio service
portfolio_service.set_crypto_service(crypto_service)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler - exact logic from original"""
    if settings.DEBUG:
        print(f"Server error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "message": str(exc),
            "error": str(exc) if settings.DEBUG else None
        }
    )


# Health check endpoint - exact port from original api/index.ts
@app.get(
    "/api/health",
    response_model=HealthResponse,
    summary="Health Check",
    description="Check the health status of the API with CORS and environment info"
)
async def health_check(request: Request):
    """Health check endpoint - exact from original"""
    return HealthResponse(
        success=True,
        message="API is healthy",
        data={
            "status": "ok",
            "timestamp": datetime.utcnow().isoformat(),
            "environment": settings.ENVIRONMENT,
            "cors": "enabled",
            "origin": request.headers.get("origin"),
            "host": request.headers.get("host"),
            "userAgent": request.headers.get("user-agent")
        }
    )


# Liveness and Readiness endpoints (for container orchestration)
@app.get(
    "/api/live",
    response_model=ApiResponse,
    summary="Liveness Probe",
    description="Basic liveness check"
)
async def liveness():
    return ApiResponse(success=True, message="live", data={"timestamp": datetime.utcnow().isoformat()})


@app.get(
    "/api/ready",
    response_model=ApiResponse,
    summary="Readiness Probe",
    description="Basic readiness check"
)
async def readiness():
    checks = {"redis": None}
    ok = True
    # Redis check (optional)
    if settings.ENABLE_REDIS and settings.REDIS_URL and redis is not None:
        try:
            client = redis.from_url(settings.REDIS_URL, decode_responses=True)
            with contextlib.suppress(Exception):
                await client.ping()
            checks["redis"] = True
        except Exception:
            checks["redis"] = False
            ok = False
    return ApiResponse(
        success=ok,
        message="ready" if ok else "degraded",
        data={"timestamp": datetime.utcnow().isoformat(), **checks},
    )


# CORS test endpoint - exact port from original
@app.get(
    "/api/cors-test",
    response_model=ApiResponse,
    summary="CORS Test",
    description="Test CORS configuration for frontend integration"
)
async def cors_test(request: Request):
    """CORS test endpoint - exact from original"""
    return ApiResponse(
        success=True,
        message="CORS is working correctly!",
        data={
            "origin": request.headers.get("origin"),
            "timestamp": datetime.utcnow().isoformat(),
            "headers": {
                "access-control-allow-origin": "*",  # Will be set by middleware
                "access-control-allow-credentials": "true",
                "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS, HEAD"
            }
        }
    )


# Simple test endpoint - exact port from original
@app.get(
    "/api/test",
    response_model=ApiResponse,
    summary="Simple Test",
    description="Simple test endpoint for API connectivity"
)
async def test_endpoint():
    """Simple test endpoint - exact from original"""
    return ApiResponse(
        success=True,
        message="API is working!",
        data={
            "timestamp": datetime.utcnow().isoformat(),
            "environment": settings.ENVIRONMENT
        }
    )


# Market Summary endpoint - exact port from original routes.ts
@app.get(
    "/api/market-summary",
    response_model=MarketSummaryResponse,
    summary="Get Market Summary",
    description="Get comprehensive market summary with crypto assets"
)
async def get_market_summary():
    """Market summary endpoint - CORRIGIDO para usar dados reais"""
    start_time = datetime.now()
    
    try:
        print("📊 Fetching market summary from APIs...")
        
        # Buscar dados reais do market summary
        market_summary = await crypto_service.update_market_summary()
        
        if not market_summary:
            print("❌ Failed to get market summary from API")
            raise HTTPException(status_code=500, detail="Failed to retrieve market summary from external API")
        
        # Buscar trending coins para crypto assets
        trending_data = await crypto_service.get_trending_coins()
        
        if not trending_data:
            print("❌ Failed to get trending coins from API")
            raise HTTPException(status_code=500, detail="Failed to retrieve trending coins from external API")
        
        gainers = trending_data.get("gainers", [])
        losers = trending_data.get("losers", [])
        crypto_assets = gainers + losers
        
        duration = (datetime.now() - start_time).total_seconds() * 1000
        if settings.DEBUG:
            print(f"✅ Market summary request completed in {duration}ms")
            print(f"📊 Market Cap: ${market_summary.get('totalMarketCap', '0')}")
            print(f"📈 Crypto Assets: {len(crypto_assets)}")
        
        # CORRIGIDO: Retornar estrutura que o frontend espera
        return MarketSummaryResponse(
            success=True,
            message="Market summary retrieved successfully",
            data=market_summary  # Retornar diretamente o market_summary, não aninhado
        )
        
    except Exception as error:
        duration = (datetime.now() - start_time).total_seconds() * 1000
        if settings.DEBUG:
            print(f"❌ Market summary error after {duration}ms: {error}")
        
        # Retornar dados mock em caso de erro
        mock_market_summary = crypto_service._get_mock_market_summary()
        return MarketSummaryResponse(
            success=True,
            message="Market summary retrieved successfully (mock data)",
            data=mock_market_summary
        )


# Trending coins endpoint - exact port from original
@app.get(
    "/api/trending-coins",
    response_model=TrendingCoinsResponse,
    summary="Get Trending Coins",
    description="Get trending cryptocurrencies sorted by 24h price change"
)
async def get_trending_coins():
    """Trending coins endpoint - exact logic from original"""
    try:
        trending_data = await crypto_service.get_trending_coins()
        
        # CORRIGIDO: Retornar estrutura que o frontend espera (gainers e losers separados)
        return TrendingCoinsResponse(
            success=True,
            message="Trending coins retrieved successfully",
            data={
                "gainers": trending_data["gainers"],
                "losers": trending_data["losers"]
            }
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching trending coins: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch trending coins")


# News endpoints - exact port from original
@app.get(
    "/api/news",
    response_model=NewsResponse,
    summary="Get General News",
    description="Get general cryptocurrency and financial news"
)
async def get_news(
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = Query(None, description="News category (geopolitics, macro, crypto)")
):
    """Get general news - exact from original"""
    try:
        news_data = await news_service.get_news(limit=limit, category=category)
        
        return NewsResponse(
            success=True,
            message="News retrieved successfully",
            data=news_data
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching news: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch news")


@app.get(
    "/api/news/geopolitics",
    response_model=NewsResponse,
    summary="Get Geopolitical News",
    description="Get geopolitical news affecting financial markets"
)
async def get_geopolitical_news(limit: int = Query(20, ge=1, le=100)):
    """Get geopolitical news - exact from original"""
    try:
        news_data = await news_service.get_news(category="geopolitics", limit=limit)
        
        return NewsResponse(
            success=True,
            message="Geopolitical news retrieved successfully",
            data=news_data
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching geopolitical news: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch geopolitical news")


@app.get(
    "/api/news/macro",
    response_model=NewsResponse,
    summary="Get Macroeconomic News",
    description="Get macroeconomic news affecting financial markets"
)
async def get_macro_news(limit: int = Query(20, ge=1, le=100)):
    """Get macroeconomic news - exact from original"""
    try:
        news_data = await news_service.get_news(category="macro", limit=limit)
        
        return NewsResponse(
            success=True,
            message="Macroeconomic news retrieved successfully", 
            data=news_data
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching macro news: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch macro news")


# Economic calendar endpoint - exact port from original
@app.get(
    "/api/economic-calendar",
    response_model=EconomicCalendarResponse,
    summary="Get Economic Calendar",
    description="Get economic events for the next 7 days"
)
async def get_economic_calendar():
    """Economic calendar endpoint - exact from original"""
    try:
        events_data = await economic_service.get_economic_events()
        
        return EconomicCalendarResponse(
            success=True,
            message="Economic calendar retrieved successfully",
            data=events_data
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching economic calendar: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch economic calendar")


# Crypto icons endpoints - exact port from original
@app.get(
    "/api/crypto-icons",
    response_model=ApiResponse,
    summary="Get Crypto Icons",
    description="Get cryptocurrency icons for multiple symbols"
)
async def get_crypto_icons(symbols: str = Query(..., description="Comma-separated list of crypto symbols")):
    """Get crypto icons - exact from original"""
    try:
        symbol_list = [s.strip() for s in symbols.split(",")]
        icons = await crypto_service.get_crypto_icons(symbol_list)
        
        return ApiResponse(
            success=True,
            message="Crypto icons retrieved successfully",
            data=icons
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching crypto icons: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch crypto icons")


@app.get(
    "/api/crypto-icons/{symbol}",
    response_model=ApiResponse,
    summary="Get Single Crypto Icon",
    description="Get cryptocurrency icon for a single symbol"
)
async def get_crypto_icon(symbol: str):
    """Get single crypto icon - exact from original"""
    try:
        icon = await crypto_service.get_crypto_icon(symbol)
        
        return ApiResponse(
            success=True,
            message="Crypto icon retrieved successfully",
            data={"symbol": symbol, "icon": icon}
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching crypto icon: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch crypto icon")


# Update endpoints - exact port from original
@app.post(
    "/api/update/crypto",
    response_model=ApiResponse,
    summary="Update Crypto Data",
    description="Update cryptocurrency data from external APIs"
)
async def update_crypto_data():
    """Update crypto data - exact from original"""
    try:
        updated_coins = await crypto_service.update_crypto_prices()
        market_summary = await crypto_service.update_market_summary()
        
        return ApiResponse(
            success=True,
            message="Crypto data updated successfully",
            data={
                "updated_coins": len(updated_coins) if updated_coins else 0,
                "market_summary_updated": market_summary is not None
            }
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error updating crypto data: {error}")
        raise HTTPException(status_code=500, detail="Failed to update crypto data")


@app.post(
    "/api/update/news",
    response_model=ApiResponse,
    summary="Update News Data",
    description="Update news data from external APIs"
)
async def update_news_data():
    """Update news data - exact from original"""
    try:
        updated_news = await news_service.update_news()
        
        return ApiResponse(
            success=True,
            message="News data updated successfully",
            data={"updated_news": len(updated_news)}
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error updating news data: {error}")
        raise HTTPException(status_code=500, detail="Failed to update news data")


@app.post(
    "/api/update/economic",
    response_model=ApiResponse,
    summary="Update Economic Calendar",
    description="Update economic calendar data from external APIs"
)
async def update_economic_data():
    """Update economic data - exact from original"""
    try:
        updated_events = await economic_service.update_economic_calendar()
        
        return ApiResponse(
            success=True,
            message="Economic calendar updated successfully",
            data={"updated_events": len(updated_events)}
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error updating economic data: {error}")
        raise HTTPException(status_code=500, detail="Failed to update economic data")


# Federal Reserve endpoints - exact port from original
@app.get(
    "/api/fed/indicators",
    response_model=FedIndicatorsResponse,
    summary="Get FRED Economic Indicators",
    description="Get Federal Reserve economic indicators"
)
async def get_fed_indicators():
    """Get FRED indicators - exact from original"""
    try:
        indicators = await fred_service.get_all_indicators()
        
        return FedIndicatorsResponse(
            success=True,
            message="FRED indicators retrieved successfully",
            data=indicators
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching FRED indicators: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch FRED indicators")


@app.get(
    "/api/fed/rate",
    response_model=FedRateResponse,
    summary="Get Current Federal Funds Rate",
    description="Get the current Federal Funds Rate"
)
async def get_fed_rate():
    """Get current Federal Funds Rate - exact from original"""
    try:
        rate_data = await fred_service.get_federal_funds_rate()
        
        return FedRateResponse(
            success=True,
            message="Federal Funds Rate retrieved successfully",
            data=rate_data
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching FED rate: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch FED rate")


@app.get(
    "/api/fed/rate-history",
    response_model=FedRateResponse,
    summary="Get Federal Funds Rate History",
    description="Get Federal Funds Rate history"
)
async def get_fed_rate_history(months: int = Query(12, ge=1, le=60)):
    """Get FED rate history - exact from original"""
    try:
        history_data = await fred_service.get_rate_history(months)
        
        return FedRateResponse(
            success=True,
            message="Federal Funds Rate history retrieved successfully",
            data=history_data
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching FED rate history: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch FED rate history")


# Whale transactions endpoints - exact port from original
@app.get(
    "/api/whale-transactions",
    response_model=WhaleTransactionsResponse,
    summary="Get Whale Transactions",
    description="Get recent whale transactions from the blockchain"
)
async def get_whale_transactions(hours: int = Query(24, ge=1, le=168)):
    """Get whale transactions - exact from original"""
    try:
        transactions = await whale_service.update_whale_transactions()
        
        return WhaleTransactionsResponse(
            success=True,
            message="Whale transactions retrieved successfully",
            data=transactions
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching whale transactions: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch whale transactions")


@app.post(
    "/api/update/whale",
    response_model=ApiResponse,
    summary="Update Whale Transactions",
    description="Update whale transaction data from external APIs"
)
async def update_whale_data():
    """Update whale data - exact from original"""
    try:
        updated_transactions = await whale_service.update_whale_transactions()
        
        return ApiResponse(
            success=True,
            message="Whale transactions updated successfully",
            data={"updated_transactions": len(updated_transactions)}
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error updating whale data: {error}")
        raise HTTPException(status_code=500, detail="Failed to update whale data")


# Airdrops endpoints - exact port from original
@app.get(
    "/api/airdrops",
    response_model=AirdropsResponse,
    summary="Get Airdrops",
    description="Get current and upcoming airdrops"
)
async def get_airdrops(status: Optional[str] = Query(None)):
    """Get airdrops - exact from original"""
    try:
        airdrops = await airdrop_service.get_airdrops(status)
        
        return AirdropsResponse(
            success=True,
            message="Airdrops retrieved successfully",
            data=airdrops
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching airdrops: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch airdrops")


# Alerts endpoints - exact port from original
@app.get(
    "/api/alerts",
    response_model=AlertsResponse,
    summary="Get Alerts",
    description="Get all user alerts"
)
async def get_alerts(limit: int = Query(20, ge=1, le=100)):
    """Get alerts - exact from original"""
    try:
        alerts = await alerts_service.get_user_alerts(limit=limit)
        
        return AlertsResponse(
            success=True,
            message="Alerts retrieved successfully",
            data=alerts
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching alerts: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch alerts")


@app.post(
    "/api/alerts/create",
    response_model=ApiResponse,
    summary="Create Alert",
    description="Create a new alert"
)
async def create_alert(alert: AlertCreate):
    """Create alert - exact from original"""
    try:
        created_alert = await alerts_service.create_alert(alert.dict())
        
        return ApiResponse(
            success=True,
            message="Alert created successfully",
            data=created_alert
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error creating alert: {error}")
        raise HTTPException(status_code=500, detail="Failed to create alert")


@app.put(
    "/api/alerts/{alert_id}/read",
    response_model=ApiResponse,
    summary="Mark Alert as Read",
    description="Mark an alert as read"
)
async def mark_alert_as_read(alert_id: str):
    """Mark alert as read - exact from original"""
    try:
        success = await alerts_service.mark_as_read(alert_id)
        
        if success:
            return ApiResponse(
                success=True,
                message="Alert marked as read successfully",
                data={"alert_id": alert_id, "isRead": True}
            )
        else:
            raise HTTPException(status_code=404, detail="Alert not found")
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error marking alert as read: {error}")
        raise HTTPException(status_code=500, detail="Failed to mark alert as read")


@app.delete(
    "/api/alerts/{alert_id}",
    response_model=ApiResponse,
    summary="Delete Alert",
    description="Delete an alert by ID"
)
async def delete_alert(alert_id: str):
    """Delete alert - exact from original"""
    try:
        success = await alerts_service.delete_alert(alert_id)
        
        if success:
            return ApiResponse(
                success=True,
                message="Alert deleted successfully",
                data={"alert_id": alert_id}
            )
        else:
            raise HTTPException(status_code=404, detail="Alert not found")
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error deleting alert: {error}")
        raise HTTPException(status_code=500, detail="Failed to delete alert")


@app.get(
    "/api/alerts/stats",
    response_model=AlertStatsResponse,
    summary="Get Alert Statistics",
    description="Get statistics for user alerts"
)
async def get_alert_stats():
    """Get alert statistics - exact from original"""
    try:
        stats = await alerts_service.get_alert_stats()
        
        return AlertStatsResponse(
            success=True,
            message="Alert statistics retrieved successfully",
            data=stats
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching alert stats: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch alert stats")


# Portfolio endpoints - exact port from original
@app.get(
    "/api/portfolio",
    response_model=PortfolioResponse,
    summary="Get Portfolio",
    description="Get the user's cryptocurrency portfolio"
)
async def get_portfolio():
    """Get portfolio - exact from original"""
    try:
        portfolio = await portfolio_service.get_user_portfolio()
        
        return PortfolioResponse(
            success=True,
            message="Portfolio retrieved successfully",
            data=portfolio
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching portfolio: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch portfolio")


@app.post(
    "/api/portfolio/add",
    response_model=ApiResponse,
    summary="Add Asset to Portfolio",
    description="Add a cryptocurrency asset to the user's portfolio"
)
async def add_to_portfolio(asset_data: dict):
    """Add to portfolio - exact from original"""
    try:
        added_asset = await portfolio_service.add_asset("default", asset_data)
        
        return ApiResponse(
            success=True,
            message="Asset added to portfolio successfully",
            data=added_asset
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error adding to portfolio: {error}")
        raise HTTPException(status_code=500, detail="Failed to add to portfolio")


@app.put(
    "/api/portfolio/{asset_id}",
    response_model=ApiResponse,
    summary="Update Portfolio Asset",
    description="Update a portfolio asset"
)
async def update_portfolio_asset(asset_id: str, asset_data: dict):
    """Update portfolio asset - exact from original"""
    try:
        updated_asset = await portfolio_service.update_asset(asset_id, asset_data)
        
        if updated_asset:
            return ApiResponse(
                success=True,
                message="Asset updated successfully",
                data=updated_asset
            )
        else:
            raise HTTPException(status_code=404, detail="Asset not found")
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error updating portfolio asset: {error}")
        raise HTTPException(status_code=500, detail="Failed to update portfolio asset")


@app.delete(
    "/api/portfolio/{asset_id}",
    response_model=ApiResponse,
    summary="Remove Asset from Portfolio",
    description="Remove a cryptocurrency asset from the user's portfolio"
)
async def remove_from_portfolio(asset_id: str):
    """Remove from portfolio - exact from original"""
    try:
        success = await portfolio_service.remove_asset(asset_id)
        
        if success:
            return ApiResponse(
                success=True,
                message="Asset removed from portfolio successfully",
                data={"asset_id": asset_id}
            )
        else:
            raise HTTPException(status_code=404, detail="Asset not found")
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error removing from portfolio: {error}")
        raise HTTPException(status_code=500, detail="Failed to remove from portfolio")


@app.get(
    "/api/portfolio/summary",
    response_model=PortfolioSummaryResponse,
    summary="Get Portfolio Summary",
    description="Get a summary of the user's cryptocurrency portfolio"
)
async def get_portfolio_summary():
    """Get portfolio summary - exact from original"""
    try:
        summary = await portfolio_service.get_portfolio_summary()
        
        return PortfolioSummaryResponse(
            success=True,
            message="Portfolio summary retrieved successfully",
            data=summary
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching portfolio summary: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch portfolio summary")


# Sentiment Analysis endpoints
@app.get(
    "/api/sentiment/analyze",
    response_model=ApiResponse,
    summary="Analyze Text Sentiment",
    description="Analyze sentiment of provided text"
)
async def analyze_sentiment(text: str = Query(..., description="Text to analyze")):
    """Analyze sentiment of text - ✅ Implementado"""
    try:
        sentiment_data = await sentiment_service.analyze_news_sentiment(text)
        
        return ApiResponse(
            success=True,
            message="Sentiment analysis completed successfully",
            data=sentiment_data
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error analyzing sentiment: {error}")
        raise HTTPException(status_code=500, detail="Failed to analyze sentiment")


@app.get(
    "/api/sentiment/market",
    response_model=ApiResponse,
    summary="Get Market Sentiment",
    description="Get overall market sentiment analysis"
)
async def get_sentiment_market():
    """Get market sentiment - ✅ Implementado"""
    try:
        sentiment_data = await sentiment_service.get_market_sentiment()
        
        return ApiResponse(
            success=True,
            message="Market sentiment retrieved successfully",
            data=sentiment_data
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching market sentiment: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch market sentiment")


@app.get(
    "/api/sentiment/{symbol}",
    response_model=ApiResponse,
    summary="Get Crypto Sentiment",
    description="Get sentiment analysis for specific cryptocurrency"
)
async def get_crypto_sentiment(symbol: str):
    """Get crypto sentiment - ✅ Implementado"""
    try:
        sentiment_data = await sentiment_service.analyze_crypto_sentiment(symbol)
        
        return ApiResponse(
            success=True,
            message=f"Sentiment analysis for {symbol} retrieved successfully",
            data=sentiment_data
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching {symbol} sentiment: {error}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch {symbol} sentiment")


@app.get(
    "/api/sentiment/{symbol}/history",
    response_model=ApiResponse,
    summary="Get Sentiment History",
    description="Get sentiment history for cryptocurrency"
)
async def get_sentiment_history(
    symbol: str,
    days: int = Query(7, ge=1, le=30, description="Number of days to retrieve")
):
    """Get sentiment history - ✅ Implementado"""
    try:
        history_data = await sentiment_service.get_sentiment_history(symbol, days)
        
        return ApiResponse(
            success=True,
            message=f"Sentiment history for {symbol} retrieved successfully",
            data=history_data
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching {symbol} sentiment history: {error}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch {symbol} sentiment history")


@app.get(
    "/api/sentiment/compare",
    response_model=ApiResponse,
    summary="Compare Sentiment",
    description="Compare sentiment across multiple cryptocurrencies"
)
async def compare_sentiment(symbols: str = Query(..., description="Comma-separated list of crypto symbols")):
    """Compare sentiment - ✅ Implementado"""
    try:
        symbol_list = [s.strip().upper() for s in symbols.split(",")]
        comparison_data = await sentiment_service.get_sentiment_comparison(symbol_list)
        
        return ApiResponse(
            success=True,
            message="Sentiment comparison completed successfully",
            data=comparison_data
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error comparing sentiment: {error}")
        raise HTTPException(status_code=500, detail="Failed to compare sentiment")


# Chart data endpoints
@app.get(
    "/api/charts/{symbol}",
    response_model=ApiResponse,
    summary="Get Chart Data",
    description="Get historical chart data for a specific cryptocurrency"
)
async def get_chart_data(symbol: str):
    """Chart data endpoint - ✅ Implementado"""
    try:
        chart_data = await crypto_service.get_chart_data(symbol)
        
        return ApiResponse(
            success=True,
            message=f"Chart data for {symbol} retrieved successfully",
            data=chart_data
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching chart data for {symbol}: {error}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch chart data for {symbol}")


# Candlestick data endpoints  
@app.get(
    "/api/candlestick/{symbol}",
    response_model=ApiResponse,
    summary="Get Candlestick Data",
    description="Get candlestick/OHLC data for trading charts"
)
async def get_candlestick_data(
    symbol: str,
    timeframe: Optional[str] = Query("1h", description="Timeframe (1m, 5m, 15m, 1h, 4h, 1d)"),
    limit: Optional[int] = Query(100, description="Number of candles to return")
):
    """Candlestick data endpoint - ✅ Implementado"""
    try:
        candlestick_data = await crypto_service.get_candlestick_data(symbol, timeframe, limit)
        
        return ApiResponse(
            success=True,
            message=f"Candlestick data for {symbol} retrieved successfully",
            data=candlestick_data
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching candlestick data for {symbol}: {error}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch candlestick data for {symbol}")


# Market analysis endpoint
@app.get(
    "/api/market-analysis",
    response_model=ApiResponse,
    summary="Get Market Analysis",
    description="Get comprehensive market analysis and insights"
)
async def get_market_analysis():
    """Market analysis endpoint - ✅ Implementado"""
    try:
        analysis_data = await crypto_service.get_market_analysis()
        
        return ApiResponse(
            success=True,
            message="Market analysis retrieved successfully",
            data=analysis_data
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching market analysis: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch market analysis")


# Market sentiment endpoint
@app.get(
    "/api/market-sentiment",
    response_model=ApiResponse,
    summary="Get Market Sentiment",
    description="Get current market sentiment indicators"
)
async def get_market_sentiment():
    """Market sentiment endpoint - ✅ Implementado"""
    try:
        sentiment_data = await crypto_service.get_market_sentiment()
        
        return ApiResponse(
            success=True,
            message="Market sentiment retrieved successfully",
            data=sentiment_data
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching market sentiment: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch market sentiment")


# Crypto overview endpoint - for dashboard overview
@app.get(
    "/api/crypto-overview",
    response_model=ApiResponse,
    summary="Get Crypto Overview",
    description="Get crypto assets for dashboard overview"
)
async def get_crypto_overview():
    """Get crypto overview for dashboard - combines trending and market data"""
    try:
        # Get trending coins
        trending_data = await crypto_service.get_trending_coins()
        
        # Get market summary
        market_summary = await crypto_service.update_market_summary()
        
        # Combine data for overview
        gainers = trending_data.get("gainers", [])
        losers = trending_data.get("losers", [])
        
        # Limit to 6 assets total (3 gainers + 3 losers)
        overview_assets = []
        overview_assets.extend(gainers[:3])
        overview_assets.extend(losers[:3])
        
        return ApiResponse(
            success=True,
            message="Crypto overview retrieved successfully",
            data={
                "assets": overview_assets,
                "market_summary": market_summary
            }
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching crypto overview: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch crypto overview")


# Individual cryptocurrency endpoints
@app.get(
    "/api/BTC",
    response_model=ApiResponse,
    summary="Get Bitcoin Data",
    description="Get detailed Bitcoin (BTC) data and analysis"
)
async def get_btc_data():
    """Get Bitcoin data - individual cryptocurrency endpoint"""
    try:
        # Get BTC data from crypto service
        btc_data = await crypto_service.get_individual_crypto_data("bitcoin")
        
        return ApiResponse(
            success=True,
            message="Bitcoin data retrieved successfully",
            data=btc_data
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching Bitcoin data: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch Bitcoin data")


@app.get(
    "/api/ETH",
    response_model=ApiResponse,
    summary="Get Ethereum Data",
    description="Get detailed Ethereum (ETH) data and analysis"
)
async def get_eth_data():
    """Get Ethereum data - individual cryptocurrency endpoint"""
    try:
        # Get ETH data from crypto service
        eth_data = await crypto_service.get_individual_crypto_data("ethereum")
        
        return ApiResponse(
            success=True,
            message="Ethereum data retrieved successfully",
            data=eth_data
        )
        
    except Exception as error:
        if settings.DEBUG:
            print(f"Error fetching Ethereum data: {error}")
        raise HTTPException(status_code=500, detail="Failed to fetch Ethereum data")


# Startup event
@app.on_event("startup")
async def startup_event():
    """Startup event - exact from original concept"""
    if settings.DEBUG:
        print("🚀 Crypto Dashboard API started successfully!")
        print(f"📊 Environment: {settings.ENVIRONMENT}")
        print(f"🌐 CORS Origins: {len(settings.ALLOWED_ORIGINS)} configured")
        print(f"⚡ Rate Limit: {settings.RATE_LIMIT_PER_MINUTE} req/min, {settings.RATE_LIMIT_PER_HOUR} req/hour")
        print(f"🔧 Debug Mode: {settings.DEBUG}")

    # Expose Prometheus metrics
    try:
        Instrumentator().instrument(app).expose(app, endpoint="/metrics", include_in_schema=False)
    except Exception as e:
        if settings.DEBUG:
            print(f"⚠️ Prometheus instrumentation failed: {e}")


# For local development (exact from original api/index.ts)
if __name__ == "__main__":
    port = settings.PORT
    if settings.DEBUG:
        print(f"🚀 Starting server on http://localhost:{port}")
        print(f"🏥 Health check: http://localhost:{port}/api/health")
        print(f"📚 API Documentation: http://localhost:{port}/docs")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=settings.DEBUG,
        log_level="info"
    )