import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { CryptoService } from './services/crypto-service';
import { NewsService } from './services/news-service';
import { EconomicService } from './services/economic-service';
import { WhaleService } from './services/whale-service';
import { FredService } from './services/fred-service';

import { apiRateLimiter } from './rate-limiter';
import { requestMonitor } from './monitoring';
import { apiCache } from './api-cache';

export async function registerRoutes(app: Express): Promise<Server> {
  const cryptoService = new CryptoService();
  const newsService = new NewsService();
  const economicService = new EconomicService();
  const whaleService = new WhaleService();
  const fredService = new FredService();

  // Rate limiting middleware
  const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown';
    
    if (!apiRateLimiter.isAllowed(clientId)) {
      return res.status(429).json({ 
        message: 'Too many requests. Please try again later.',
        retryAfter: 60
      });
    }
    
    res.setHeader('X-RateLimit-Remaining', apiRateLimiter.getRemainingRequests(clientId));
    next();
  };

  // Apply rate limiting to all API routes
  app.use('/api', rateLimitMiddleware);

  // Market Summary endpoint
  app.get("/api/market-summary", async (req, res) => {
    const startTime = Date.now();
    
    try {
      const [marketSummary, cryptoAssets] = await Promise.all([
        storage.getMarketSummary(),
        storage.getCryptoAssets(),
      ]);

      const duration = Date.now() - startTime;
      requestMonitor.logRequest('/api/market-summary', 'GET', duration, 200);

      res.json({
        marketSummary,
        cryptoAssets,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      requestMonitor.logRequest('/api/market-summary', 'GET', duration, 500);
      
      console.error('Error fetching market summary:', error);
      res.status(500).json({ message: 'Failed to fetch market summary' });
    }
  });

  // Trending coins endpoint
  app.get("/api/trending-coins", async (req, res) => {
    try {
      const trendingCoins = await cryptoService.getTrendingCoins();
      res.json(trendingCoins);
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      res.status(500).json({ message: 'Failed to fetch trending coins' });
    }
  });

  // Crypto icons endpoint
  app.get("/api/crypto-icons", async (req, res) => {
    const startTime = Date.now();
    
    try {
      const symbols = (req.query.symbols as string)?.split(',') || [];
      
      if (symbols.length === 0) {
        return res.status(400).json({ message: 'Symbols parameter is required' });
      }

      const icons = await cryptoService.getCryptoIcons(symbols);
      
      const duration = Date.now() - startTime;
      requestMonitor.logRequest('/api/crypto-icons', 'GET', duration, 200);
      
      res.json(icons);
    } catch (error) {
      const duration = Date.now() - startTime;
      requestMonitor.logRequest('/api/crypto-icons', 'GET', duration, 500);
      
      console.error('Error fetching crypto icons:', error);
      res.status(500).json({ message: 'Failed to fetch crypto icons' });
    }
  });

  // Single crypto icon endpoint
  app.get("/api/crypto-icons/:symbol", async (req, res) => {
    const startTime = Date.now();
    
    try {
      const { symbol } = req.params;
      const iconUrl = await cryptoService.getCryptoIcon(symbol);
      
      const duration = Date.now() - startTime;
      requestMonitor.logRequest('/api/crypto-icons/:symbol', 'GET', duration, 200);
      
      if (iconUrl) {
        res.json({ symbol: symbol.toUpperCase(), iconUrl });
      } else {
        res.status(404).json({ message: 'Icon not found' });
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      requestMonitor.logRequest('/api/crypto-icons/:symbol', 'GET', duration, 500);
      
      console.error('Error fetching crypto icon:', error);
      res.status(500).json({ message: 'Failed to fetch crypto icon' });
    }
  });

  // News endpoints
  app.get("/api/news/geopolitics", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const news = await storage.getNews('geopolitics', limit);
      res.json(news);
    } catch (error) {
      console.error('Error fetching geopolitical news:', error);
      res.status(500).json({ message: 'Failed to fetch geopolitical news' });
    }
  });

  app.get("/api/news/macro", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const news = await storage.getNews('macro', limit);
      res.json(news);
    } catch (error) {
      console.error('Error fetching macroeconomic news:', error);
      res.status(500).json({ message: 'Failed to fetch macroeconomic news' });
    }
  });

  app.get("/api/news", async (req, res) => {
    const startTime = Date.now();
    
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const category = req.query.category as string;
      
      console.log('📰 Fetching news - Category:', category, 'Limit:', limit);
      
      const news = await storage.getNews(category, limit);
      
      console.log('📰 News found:', news.length);
      
      const duration = Date.now() - startTime;
      requestMonitor.logRequest('/api/news', 'GET', duration, 200);
      
      res.json(news);
    } catch (error) {
      const duration = Date.now() - startTime;
      requestMonitor.logRequest('/api/news', 'GET', duration, 500);
      
      console.error('❌ Error fetching news:', error);
      res.status(500).json({ message: 'Failed to fetch news' });
    }
  });

  // Economic calendar endpoint
  app.get("/api/economic-calendar", async (req, res) => {
    try {
      const startDate = req.query.start ? new Date(req.query.start as string) : new Date();
      const endDate = req.query.end ? new Date(req.query.end as string) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      const events = await storage.getEconomicEvents(startDate, endDate);
      res.json(events);
    } catch (error) {
      console.error('Error fetching economic calendar:', error);
      res.status(500).json({ message: 'Failed to fetch economic calendar' });
    }
  });

  // Whale movements endpoint
  app.get("/api/whale-movements", async (req, res) => {
    const startTime = Date.now();
    
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const cacheKey = `whale-movements-${limit}`;
      
      // Check cache first
      const cachedData = apiCache.get(cacheKey);
      if (cachedData) {
        const duration = Date.now() - startTime;
        requestMonitor.logRequest('/api/whale-movements', 'GET', duration, 200);
        return res.json(cachedData);
      }
      
      const transactions = await storage.getWhaleTransactions(limit);
      
      // Cache the result for 5 minutes
      apiCache.set(cacheKey, transactions, 5 * 60 * 1000);
      
      const duration = Date.now() - startTime;
      requestMonitor.logRequest('/api/whale-movements', 'GET', duration, 200);
      
      res.json(transactions);
    } catch (error) {
      const duration = Date.now() - startTime;
      requestMonitor.logRequest('/api/whale-movements', 'GET', duration, 500);
      
      console.error('Error fetching whale movements:', error);
      res.status(500).json({ message: 'Failed to fetch whale movements' });
    }
  });

  // Airdrops endpoint
  app.get("/api/airdrops", async (req, res) => {
    try {
      const status = req.query.status as string;
      const airdrops = await storage.getAirdrops(status);
      res.json(airdrops);
    } catch (error) {
      console.error('Error fetching airdrops:', error);
      res.status(500).json({ message: 'Failed to fetch airdrops' });
    }
  });

  // FED updates endpoint
  app.get("/api/fed-updates", async (req, res) => {
    const startTime = Date.now();
    
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const updates = await storage.getFedUpdates(limit);
      
      const duration = Date.now() - startTime;
      requestMonitor.logRequest('/api/fed-updates', 'GET', duration, 200);
      
      res.json(updates);
    } catch (error) {
      const duration = Date.now() - startTime;
      requestMonitor.logRequest('/api/fed-updates', 'GET', duration, 500);
      
      console.error('Error fetching FED updates:', error);
      res.status(500).json({ message: 'Failed to fetch FED updates' });
    }
  });

  // FRED economic indicators endpoint
  app.get("/api/fred/indicators", async (req, res) => {
    const startTime = Date.now();
    
    try {
      const indicators = await fredService.getEconomicIndicators();
      
      const duration = Date.now() - startTime;
      requestMonitor.logRequest('/api/fred/indicators', 'GET', duration, 200);
      
      res.json(indicators);
    } catch (error) {
      const duration = Date.now() - startTime;
      requestMonitor.logRequest('/api/fred/indicators', 'GET', duration, 500);
      
      console.error('Error fetching FRED indicators:', error);
      res.status(500).json({ message: 'Failed to fetch economic indicators' });
    }
  });

  // FRED rate history endpoint
  app.get("/api/fred/rate-history", async (req, res) => {
    const startTime = Date.now();
    
    try {
      const months = parseInt(req.query.months as string) || 12;
      const history = await fredService.getRateHistory(months);
      
      const duration = Date.now() - startTime;
      requestMonitor.logRequest('/api/fred/rate-history', 'GET', duration, 200);
      
      res.json(history);
    } catch (error) {
      const duration = Date.now() - startTime;
      requestMonitor.logRequest('/api/fred/rate-history', 'GET', duration, 500);
      
      console.error('Error fetching rate history:', error);
      res.status(500).json({ message: 'Failed to fetch rate history' });
    }
  });

  // Charts endpoint
  app.get("/api/charts/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const asset = await storage.getCryptoAsset(symbol.toLowerCase());
      
      if (!asset) {
        return res.status(404).json({ message: 'Asset not found' });
      }

      res.json({
        symbol: asset.symbol,
        name: asset.name,
        price: asset.price,
        sparklineData: asset.sparklineData || [],
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
      res.status(500).json({ message: 'Failed to fetch chart data' });
    }
  });

  // Manual update endpoints for testing
  app.post("/api/update/crypto", async (req, res) => {
    try {
      await cryptoService.updateCryptoPrices();
      await cryptoService.updateMarketSummary();
      res.json({ message: 'Crypto data updated successfully' });
    } catch (error) {
      console.error('Error updating crypto data:', error);
      res.status(500).json({ message: 'Failed to update crypto data' });
    }
  });

  app.post("/api/update/news", async (req, res) => {
    try {
      console.log('📰 Starting news update...');
      await Promise.all([
        newsService.updateGeopoliticalNews(),
        newsService.updateCryptoNews(),
        newsService.updateMacroeconomicNews(),
      ]);
      console.log('✅ News update completed');
      res.json({ message: 'News updated successfully' });
    } catch (error) {
      console.error('❌ Error updating news:', error);
      res.status(500).json({ message: 'Failed to update news' });
    }
  });

  app.post("/api/update/economic", async (req, res) => {
    try {
      await Promise.all([
        economicService.updateEconomicCalendar(),
        economicService.updateFedUpdates(),
      ]);
      res.json({ message: 'Economic data updated successfully' });
    } catch (error) {
      console.error('Error updating economic data:', error);
      res.status(500).json({ message: 'Failed to update economic data' });
    }
  });

  app.post("/api/update/whale", async (req, res) => {
    try {
      await whaleService.updateWhaleTransactions();
      res.json({ message: 'Whale data updated successfully' });
    } catch (error) {
      console.error('Error updating whale data:', error);
      res.status(500).json({ message: 'Failed to update whale data' });
    }
  });

  const httpServer = createServer(app);

  // Initialize WebSocket server (removed for Vercel)

  // Initialize data on startup (optimized for Vercel)
  setTimeout(async () => {
    try {
      console.log('Initializing data...');
      // Load essential data first, then others
      await cryptoService.updateCryptoPrices();
      await cryptoService.updateMarketSummary();
      
      // Load other data in background
      Promise.all([
        newsService.updateGeopoliticalNews(),
        economicService.updateEconomicCalendar(),
        whaleService.updateWhaleTransactions(),
      ]).catch(error => {
        console.error('Background data loading error:', error);
      });
      
      console.log('Initial data loaded successfully');
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }, 1000);

  return httpServer;
}
