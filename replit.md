# Financial Dashboard - replit.md

## Overview

This is a comprehensive financial dashboard application built with a modern full-stack architecture. The application provides real-time cryptocurrency market data, news feeds, economic calendar events, whale transaction tracking, and other financial market insights. It features a React-based frontend with TypeScript, an Express.js backend, and PostgreSQL database integration using Drizzle ORM.

**Recent Update (January 30, 2025):** Complete multi-page navigation system implemented with four essential investor pages: Market Analysis, News, Economic Calendar, and Settings. All pages feature professional Bloomberg Terminal-inspired design with glassmorphism styling and full functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with custom styling
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Updates**: WebSocket integration for live data updates

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **WebSocket**: Native WebSocket server for real-time data streaming
- **API Integration**: Multiple external APIs for crypto, news, and economic data

### Database Design
The application uses a PostgreSQL database with the following main entities:
- **crypto_assets**: Store cryptocurrency market data with price history
- **news**: Financial and geopolitical news articles with categorization
- **economic_events**: Economic calendar events with impact ratings
- **whale_transactions**: Large cryptocurrency transactions tracking
- **airdrops**: Cryptocurrency airdrop information
- **fed_updates**: Federal Reserve policy updates
- **market_summary**: Overall market statistics and metrics

## Key Components

### Data Services
- **CryptoService**: Integrates with CoinGecko API for cryptocurrency data
- **NewsService**: Fetches news from NewsAPI and CryptoPanic
- **EconomicService**: Retrieves economic calendar data from Trading Economics
- **WhaleService**: Tracks large transactions via Whale Alert API

### Storage Layer
- **IStorage Interface**: Abstraction layer for data persistence
- **MemStorage**: In-memory storage implementation for development
- **Database Schema**: Drizzle schema definitions with TypeScript types

### Frontend Components
- **Dashboard**: Main overview with market summary, trending coins, news, and charts
- **Market Analysis**: Complete technical analysis with indicators, support/resistance levels, and sentiment scoring
- **News Page**: Professional news feed with categorization, sentiment analysis, and impact ratings
- **Economic Calendar**: Comprehensive economic events calendar with impact ratings and real-time data
- **Settings Page**: Complete configuration panel for notifications, display preferences, security settings, and API management
- **Sidebar Navigation**: Professional navigation system with proper routing and active state management

### Real-time Features
- **WebSocket Manager**: Handles client connections and data broadcasting
- **Live Price Updates**: Real-time cryptocurrency price streaming
- **News Alerts**: Instant notification of high-impact news
- **Market Data Refresh**: Automatic data synchronization across clients

## Data Flow

1. **External API Integration**: Backend services fetch data from multiple financial APIs
2. **Data Processing**: Raw API data is normalized and stored in PostgreSQL
3. **WebSocket Broadcasting**: Real-time updates are pushed to connected clients
4. **React Query Caching**: Frontend caches API responses with automatic invalidation
5. **UI Updates**: Components reactively update when data changes

## External Dependencies

### APIs and Services
- **CoinGecko**: Cryptocurrency market data and pricing
- **NewsAPI**: Financial news aggregation
- **CryptoPanic**: Crypto-specific news and sentiment
- **Trading Economics**: Economic calendar and indicators
- **Whale Alert**: Large cryptocurrency transaction monitoring
- **Neon Database**: Serverless PostgreSQL hosting

### Key Libraries
- **Frontend**: React, TypeScript, Vite, TanStack Query, Radix UI, Tailwind CSS
- **Backend**: Express.js, Drizzle ORM, WebSocket, date-fns
- **Development**: ESBuild, PostCSS, Replit integration tools

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement for fast development
- **TypeScript Compilation**: Real-time type checking and compilation
- **Database Migrations**: Drizzle Kit for schema management
- **Environment Variables**: Separate configuration for API keys and database URLs

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: PostgreSQL with connection pooling via Neon
- **Static Assets**: Served directly by Express in production

### Configuration
- **Environment Variables**: Database URL, API keys for external services
- **Build Scripts**: Separate development and production workflows
- **Path Aliases**: TypeScript path mapping for clean imports
- **Asset Handling**: Vite handles static asset optimization and bundling

The application is designed for deployment on Replit with automatic scaling and includes proper error handling, logging, and graceful degradation when external APIs are unavailable.