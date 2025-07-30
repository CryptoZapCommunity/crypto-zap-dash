import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import { CryptoService } from './services/crypto-service';
import { NewsService } from './services/news-service';
import { WhaleService } from './services/whale-service';
import { storage } from './storage';
import { wsRateLimiter } from './rate-limiter';

interface WebSocketMessage {
  type: string;
  data: any;
}

export class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();
  private cryptoService: CryptoService;
  private newsService: NewsService;
  private whaleService: WhaleService;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.cryptoService = new CryptoService();
    this.newsService = new NewsService();
    this.whaleService = new WhaleService();

    this.setupWebSocketServer();
    this.startPeriodicUpdates();
  }

  private setupWebSocketServer(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket connection established');
      this.clients.add(ws);

      // Send initial data to the new client
      this.sendInitialData(ws);

      ws.on('message', (message: Buffer) => {
        try {
          // Rate limiting for WebSocket messages
          const clientId = ws.url || 'unknown';
          if (!wsRateLimiter.isAllowed(clientId)) {
            console.warn('WebSocket rate limit exceeded for client:', clientId);
            return;
          }

          const parsedMessage: WebSocketMessage = JSON.parse(message.toString());
          this.handleMessage(ws, parsedMessage);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        console.log('WebSocket connection closed');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });
  }

  private async sendInitialData(ws: WebSocket): Promise<void> {
    try {
      // Send current market data
      const [cryptoAssets, marketSummary, news, whaleTransactions] = await Promise.all([
        storage.getCryptoAssets(),
        storage.getMarketSummary(),
        storage.getNews(undefined, 10),
        storage.getWhaleTransactions(10),
      ]);

      const initialData = {
        cryptoAssets,
        marketSummary,
        news,
        whaleTransactions,
      };

      this.sendToClient(ws, 'INITIAL_DATA', initialData);
    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  }

  private handleMessage(ws: WebSocket, message: WebSocketMessage): void {
    switch (message.type) {
      case 'PING':
        this.sendToClient(ws, 'PONG', { timestamp: Date.now() });
        break;
      case 'SUBSCRIBE_UPDATES':
        // Client is requesting to subscribe to updates
        this.sendToClient(ws, 'SUBSCRIBED', { subscribed: true });
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  private sendToClient(ws: WebSocket, type: string, data: any): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, data, timestamp: Date.now() }));
    }
  }

  private broadcast(type: string, data: any): void {
    const message = JSON.stringify({ type, data, timestamp: Date.now() });
    
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  private startPeriodicUpdates(): void {
    // Update crypto prices every 60 seconds (reduced from 30)
    this.updateInterval = setInterval(async () => {
      try {
        // Update crypto data
        await this.cryptoService.updateCryptoPrices();
        await this.cryptoService.updateMarketSummary();
        
        // Get updated data
        const [cryptoAssets, marketSummary] = await Promise.all([
          storage.getCryptoAssets(),
          storage.getMarketSummary(),
        ]);

        // Broadcast updates
        this.broadcast('CRYPTO_UPDATE', { cryptoAssets, marketSummary });

        // Update news every 10 minutes (reduced frequency)
        if (Date.now() % (10 * 60 * 1000) < 60000) {
          await this.newsService.updateGeopoliticalNews();
          await this.newsService.updateCryptoNews();
          
          const news = await storage.getNews(undefined, 10);
          this.broadcast('NEWS_UPDATE', news);
        }

        // Update whale transactions every 5 minutes (reduced frequency)
        if (Date.now() % (5 * 60 * 1000) < 60000) {
          await this.whaleService.updateWhaleTransactions();
          
          const whaleTransactions = await storage.getWhaleTransactions(10);
          this.broadcast('WHALE_UPDATE', whaleTransactions);
        }

      } catch (error) {
        console.error('Error in periodic update:', error);
      }
    }, 60000); // 60 seconds (reduced from 30)
  }

  public shutdown(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    this.clients.forEach((client) => {
      client.close();
    });
    
    this.wss.close();
  }
}
