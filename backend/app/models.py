"""
Pydantic models for Crypto Dashboard API
Transformed from original Drizzle schema.ts with real examples
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Union
from datetime import datetime
from decimal import Decimal


# Base response models
class ApiResponse(BaseModel):
    """Base API response model"""
    success: bool = True
    message: str
    data: Optional[Union[dict, list]] = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "message": "Operation completed successfully",
                "data": {"result": "example"}
            }
        }
    )


class HealthResponse(ApiResponse):
    """Health check response"""
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "message": "API is healthy",
                "data": {
                    "status": "healthy",
                    "timestamp": "2024-01-15T10:30:00Z",
                    "version": "2.0.0",
                    "database": "connected"
                }
            }
        }
    )


# Domain models (from original schema.ts)
class CryptoAsset(BaseModel):
    """Cryptocurrency asset model - from cryptoAssets table"""
    id: str
    symbol: str
    name: str
    price: str  # Changed from Decimal to str for frontend compatibility
    priceChange24h: Optional[str] = None  # Changed from Decimal to str
    marketCap: Optional[str] = None  # Changed from Decimal to str
    volume24h: Optional[str] = None  # Changed from Decimal to str
    sparklineData: Optional[List[float]] = None
    lastUpdated: Optional[str] = None  # Changed from datetime to str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "bitcoin",
                "symbol": "BTC",
                "name": "Bitcoin",
                "price": "43250.50000000",
                "priceChange24h": "2.5000",
                "marketCap": "850000000000.00",
                "volume24h": "25000000000.00",
                "sparklineData": [42000, 42500, 43000, 43250],
                "lastUpdated": "2024-01-15T10:30:00Z"
            }
        }
    )


class TrendingCoin(BaseModel):
    """Trending coin model for API responses"""
    id: str
    symbol: str
    name: str
    price: float
    priceChange24h: float
    marketCap: float
    volume24h: float
    sparklineData: Optional[List[float]] = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "bitcoin",
                "symbol": "btc",
                "name": "Bitcoin",
                "price": 43250.50,
                "priceChange24h": 2.5,
                "marketCap": 850000000000,
                "volume24h": 25000000000,
                "sparklineData": [42000, 42500, 43000, 43250]
            }
        }
    )


class TrendingCoinsResponse(ApiResponse):
    """Trending coins API response"""
    data: dict  # Changed to dict to support gainers/losers structure

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "message": "Trending coins retrieved successfully",
                "data": [
                    {
                        "id": "bitcoin",
                        "symbol": "btc",
                        "name": "Bitcoin",
                        "price": 43250.50,
                        "priceChange24h": 2.5,
                        "marketCap": 850000000000,
                        "volume24h": 25000000000,
                        "sparklineData": [42000, 42500, 43000, 43250]
                    }
                ]
            }
        }
    )


class News(BaseModel):
    """News article model - from news table"""
    id: str
    title: str
    summary: Optional[str] = None
    content: Optional[str] = None
    source: str
    sourceUrl: Optional[str] = None
    category: str  # geopolitics, macro, crypto
    country: Optional[str] = None
    impact: str  # low, medium, high
    sentiment: Optional[str] = None  # positive, negative, neutral
    publishedAt: datetime
    createdAt: datetime

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "news-001",
                "title": "Bitcoin Reaches New All-Time High",
                "summary": "Bitcoin surpassed its previous record...",
                "source": "CoinDesk",
                "sourceUrl": "https://coindesk.com/bitcoin-ath",
                "category": "crypto",
                "country": "US",
                "impact": "high",
                "sentiment": "positive",
                "publishedAt": "2024-01-15T10:30:00Z",
                "createdAt": "2024-01-15T10:30:00Z"
            }
        }
    )


class NewsResponse(ApiResponse):
    """News API response"""
    data: List[dict]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "message": "News retrieved successfully",
                "data": [
                    {
                        "id": "news-001",
                        "title": "Bitcoin Reaches New All-Time High",
                        "summary": "Bitcoin surpassed its previous record...",
                        "source": "CoinDesk",
                        "category": "crypto",
                        "impact": "high",
                        "sentiment": "positive",
                        "publishedAt": "2024-01-15T10:30:00Z"
                    }
                ]
            }
        }
    )


class EconomicEvent(BaseModel):
    """Economic event model - from economicEvents table"""
    id: str
    title: str
    country: str
    currency: Optional[str] = None
    impact: str  # low, medium, high
    forecast: Optional[str] = None
    previous: Optional[str] = None
    actual: Optional[str] = None
    eventDate: datetime
    sourceUrl: Optional[str] = None
    createdAt: datetime

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "event-001",
                "title": "US CPI Inflation Rate",
                "country": "US",
                "currency": "USD",
                "impact": "high",
                "forecast": "3.2%",
                "previous": "3.1%",
                "actual": "3.3%",
                "eventDate": "2024-01-15T10:30:00Z",
                "createdAt": "2024-01-15T10:30:00Z"
            }
        }
    )


class EconomicCalendarResponse(ApiResponse):
    """Economic calendar API response"""
    data: List[dict]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "message": "Economic calendar retrieved successfully",
                "data": [
                    {
                        "id": "event-001",
                        "title": "US CPI Inflation Rate",
                        "country": "US",
                        "currency": "USD",
                        "impact": "high",
                        "forecast": "3.2%",
                        "previous": "3.1%",
                        "actual": "3.3%",
                        "eventDate": "2024-01-15T10:30:00Z"
                    }
                ]
            }
        }
    )


class WhaleTransaction(BaseModel):
    """Whale transaction model - from whaleTransactions table"""
    id: str
    transactionHash: str
    asset: str
    amount: Decimal
    valueUsd: Optional[Decimal] = None
    type: str  # inflow, outflow, transfer
    fromAddress: Optional[str] = None
    toAddress: Optional[str] = None
    fromExchange: Optional[str] = None
    toExchange: Optional[str] = None
    timestamp: datetime
    createdAt: datetime

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "whale-001",
                "transactionHash": "0x1234567890abcdef...",
                "asset": "BTC",
                "amount": "100.00000000",
                "valueUsd": "4325000.00",
                "type": "inflow",
                "fromAddress": "0xabc123...",
                "toAddress": "0xdef456...",
                "fromExchange": "Binance",
                "toExchange": "Coinbase",
                "timestamp": "2024-01-15T10:30:00Z",
                "createdAt": "2024-01-15T10:30:00Z"
            }
        }
    )


class WhaleTransactionsResponse(ApiResponse):
    """Whale transactions API response"""
    data: List[dict]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "message": "Whale transactions retrieved successfully",
                "data": [
                    {
                        "id": "whale-001",
                        "transactionHash": "0x1234567890abcdef...",
                        "asset": "BTC",
                        "amount": "100.00000000",
                        "valueUsd": "4325000.00",
                        "type": "inflow",
                        "fromExchange": "Binance",
                        "toExchange": "Coinbase",
                        "timestamp": "2024-01-15T10:30:00Z"
                    }
                ]
            }
        }
    )


class Airdrop(BaseModel):
    """Airdrop model - from airdrops table"""
    id: str
    projectName: str
    tokenSymbol: Optional[str] = None
    description: Optional[str] = None
    estimatedValue: Optional[str] = None
    eligibility: Optional[str] = None
    deadline: Optional[datetime] = None
    status: str  # upcoming, ongoing, ended
    website: Optional[str] = None
    createdAt: datetime

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "airdrop-001",
                "projectName": "Jupiter Protocol",
                "tokenSymbol": "JUP",
                "description": "Decentralized exchange aggregator",
                "estimatedValue": "$500-1000",
                "eligibility": "Solana wallet holders",
                "deadline": "2024-02-15T23:59:59Z",
                "status": "ongoing",
                "website": "https://jup.ag",
                "createdAt": "2024-01-15T10:30:00Z"
            }
        }
    )


class AirdropsResponse(ApiResponse):
    """Airdrops API response"""
    data: List[dict]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "message": "Airdrops retrieved successfully",
                "data": [
                    {
                        "id": "airdrop-001",
                        "projectName": "Jupiter Protocol",
                        "tokenSymbol": "JUP",
                        "description": "Decentralized exchange aggregator",
                        "estimatedValue": "$500-1000",
                        "eligibility": "Solana wallet holders",
                        "deadline": "2024-02-15T23:59:59Z",
                        "status": "ongoing"
                    }
                ]
            }
        }
    )


class FedUpdate(BaseModel):
    """Federal Reserve update model - from fedUpdates table"""
    id: str
    title: str
    type: str  # rate_decision, fomc_minutes, speech, projection
    content: Optional[str] = None
    interestRate: Optional[Decimal] = None
    speaker: Optional[str] = None
    sourceUrl: Optional[str] = None
    publishedAt: datetime
    createdAt: datetime

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "fed-001",
                "title": "FOMC Maintains Federal Funds Rate at 5.25-5.50%",
                "type": "rate_decision",
                "content": "The Federal Open Market Committee decided to maintain...",
                "interestRate": "5.3750",
                "speaker": "Jerome Powell",
                "sourceUrl": "https://www.federalreserve.gov/",
                "publishedAt": "2024-01-15T10:30:00Z",
                "createdAt": "2024-01-15T10:30:00Z"
            }
        }
    )


class FedIndicatorsResponse(ApiResponse):
    """FRED indicators API response"""
    data: List[dict]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "message": "FRED indicators retrieved successfully",
                "data": [
                    {
                        "series_id": "DGS10",
                        "title": "10-Year Treasury Constant Maturity Rate",
                        "value": "4.25",
                        "date": "2024-01-15",
                        "frequency": "Daily"
                    }
                ]
            }
        }
    )


class FedRateResponse(ApiResponse):
    """FRED rate API response"""
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "message": "Federal funds rate retrieved successfully",
                "data": {
                    "current_rate": "5.25-5.50%",
                    "last_updated": "2024-01-15",
                    "next_meeting": "2024-02-01",
                    "projection": "5.00-5.25%"
                }
            }
        }
    )


class MarketSummary(BaseModel):
    """Market summary model - from marketSummary table"""
    id: str
    totalMarketCap: str  # Changed from Decimal to str for frontend compatibility
    totalVolume24h: str  # Changed from Decimal to str
    btcDominance: Optional[str] = None  # Changed from Decimal to str
    fearGreedIndex: Optional[int] = None
    marketChange24h: Optional[str] = None  # Changed from Decimal to str
    lastUpdated: Optional[str] = None  # Changed from datetime to str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "market-001",
                "totalMarketCap": "1850000000000.00",
                "totalVolume24h": "85000000000.00",
                "btcDominance": "52.30",
                "fearGreedIndex": 65,
                "marketChange24h": "2.5000",
                "lastUpdated": "2024-01-15T10:30:00Z"
            }
        }
    )


class MarketSummaryResponse(ApiResponse):
    """Market summary API response"""
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "message": "Market summary retrieved successfully",
                "data": {
                    "totalMarketCap": "1850000000000.00",
                    "totalVolume24h": "85000000000.00",
                    "btcDominance": "52.30",
                    "fearGreedIndex": 65,
                    "marketChange24h": "2.5000",
                    "lastUpdated": "2024-01-15T10:30:00Z"
                }
            }
        }
    )


class Alert(BaseModel):
    """Alert model - from alerts table"""
    id: str
    type: str  # price_target, volume_spike, whale_movement, news_sentiment, technical_indicator
    priority: str  # low, medium, high, critical
    asset: Optional[str] = None
    title: str
    message: str
    value: Optional[str] = None
    change: Optional[Decimal] = None
    isRead: bool = False
    timestamp: datetime
    createdAt: datetime

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "alert-001",
                "type": "price_target",
                "priority": "high",
                "asset": "BTC",
                "title": "Bitcoin Price Target Reached",
                "message": "Bitcoin has reached the target price of $45,000",
                "value": "45000",
                "change": "5.2500",
                "isRead": False,
                "timestamp": "2024-01-15T10:30:00Z",
                "createdAt": "2024-01-15T10:30:00Z"
            }
        }
    )


class AlertsResponse(ApiResponse):
    """Alerts API response"""
    data: List[dict]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "message": "Alerts retrieved successfully",
                "data": [
                    {
                        "id": "alert-001",
                        "type": "price_target",
                        "priority": "high",
                        "asset": "BTC",
                        "title": "Bitcoin Price Target Reached",
                        "message": "Bitcoin has reached the target price of $45,000",
                        "value": "45000",
                        "change": "5.2500",
                        "isRead": False,
                        "timestamp": "2024-01-15T10:30:00Z"
                    }
                ]
            }
        }
    )


# Portfolio Models - MISSING from migration
class PortfolioAsset(BaseModel):
    """Portfolio asset model"""
    id: str
    symbol: str
    name: str
    amount: float
    avgPrice: float
    currentPrice: float
    value: float
    change24h: float
    isWatching: bool
    createdAt: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "asset-001",
                "symbol": "BTC",
                "name": "Bitcoin",
                "amount": 0.5,
                "avgPrice": 42000.00,
                "currentPrice": 43250.50,
                "value": 21625.25,
                "change24h": 2.5,
                "isWatching": True,
                "createdAt": "2024-01-15T10:30:00Z"
            }
        }
    )


class PortfolioAssetCreate(BaseModel):
    """Create portfolio asset model"""
    symbol: str
    name: Optional[str] = None
    amount: float
    avgPrice: float
    isWatching: bool = True

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "symbol": "BTC",
                "name": "Bitcoin",
                "amount": 0.5,
                "avgPrice": 42000.00,
                "isWatching": True
            }
        }
    )


class PortfolioAssetUpdate(BaseModel):
    """Update portfolio asset model"""
    amount: Optional[float] = None
    avgPrice: Optional[float] = None
    isWatching: Optional[bool] = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "amount": 0.75,
                "avgPrice": 42500.00,
                "isWatching": False
            }
        }
    )


class PortfolioSummary(BaseModel):
    """Portfolio summary model"""
    totalValue: float
    totalInvested: float
    totalProfit: float
    profitPercentage: float
    assetCount: int
    topAssets: List[dict]
    lastUpdated: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "totalValue": 33164.63,
                "totalInvested": 32500.00,
                "totalProfit": 664.63,
                "profitPercentage": 2.04,
                "assetCount": 3,
                "topAssets": [
                    {
                        "id": "asset-001",
                        "symbol": "BTC",
                        "name": "Bitcoin",
                        "value": 21625.25
                    }
                ],
                "lastUpdated": "2024-01-15T10:30:00Z"
            }
        }
    )


class PortfolioResponse(ApiResponse):
    """Portfolio API response"""
    data: List[PortfolioAsset]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "message": "Portfolio retrieved successfully",
                "data": [
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
                        "createdAt": "2024-01-15T10:30:00Z"
                    }
                ]
            }
        }
    )


class PortfolioSummaryResponse(ApiResponse):
    """Portfolio summary API response"""
    data: PortfolioSummary

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "message": "Portfolio summary retrieved successfully",
                "data": {
                    "totalValue": 33164.63,
                    "totalInvested": 32500.00,
                    "totalProfit": 664.63,
                    "profitPercentage": 2.04,
                    "assetCount": 3,
                    "topAssets": [],
                    "lastUpdated": "2024-01-15T10:30:00Z"
                }
            }
        }
    )


# Alert Create/Update Models - MISSING from migration
class AlertCreate(BaseModel):
    """Create alert model"""
    type: str  # price_target, volume_spike, whale_movement, news_sentiment, technical_indicator
    priority: str  # low, medium, high, critical
    asset: Optional[str] = None
    title: str
    message: str
    value: Optional[str] = None
    change: Optional[float] = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "type": "price_target",
                "priority": "high",
                "asset": "BTC",
                "title": "Bitcoin Price Target",
                "message": "Alert when Bitcoin reaches $50,000",
                "value": "50000",
                "change": 5.25
            }
        }
    )


class AlertUpdate(BaseModel):
    """Update alert model"""
    isRead: bool = True

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "isRead": True
            }
        }
    )


class AlertStats(BaseModel):
    """Alert statistics model"""
    total: int
    unread: int
    read: int
    by_priority: dict

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "total": 10,
                "unread": 3,
                "read": 7,
                "by_priority": {
                    "critical": 1,
                    "high": 3,
                    "medium": 4,
                    "low": 2
                }
            }
        }
    )


class AlertStatsResponse(ApiResponse):
    """Alert stats API response"""
    data: AlertStats

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "message": "Alert statistics retrieved successfully",
                "data": {
                    "total": 10,
                    "unread": 3,
                    "read": 7,
                    "by_priority": {
                        "critical": 1,
                        "high": 3,
                        "medium": 4,
                        "low": 2
                    }
                }
            }
        }
    )