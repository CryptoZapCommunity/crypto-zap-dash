import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import { CryptoService } from './services/crypto-service.js';
import { NewsService } from './services/news-service.js';
import { WhaleService } from './services/whale-service.js';
import { storage } from './storage.js';
import { wsRateLimiter } from './rate-limiter.js';

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
          // Rate limiting for WebSocket messages - using connection ID instead of URL
          const clientId = `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
    // DISABLED: Periodic updates to prevent API spam
    // Updates will only happen on manual refresh or initial load
    console.log('WebSocket periodic updates DISABLED to prevent API spam');
    
    // Only send initial data when clients connect
    this.updateInterval = setInterval(async () => {
      // Do nothing - updates disabled
    }, 30 * 60 * 1000); // 30 minutes (effectively disabled)
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
