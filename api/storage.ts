import { 
  type CryptoAsset, 
  type InsertCryptoAsset,
  type News,
  type InsertNews,
  type EconomicEvent,
  type InsertEconomicEvent,
  type WhaleTransaction,
  type InsertWhaleTransaction,
  type Airdrop,
  type InsertAirdrop,
  type FedUpdate,
  type InsertFedUpdate,
  type MarketSummary,
  type InsertMarketSummary,
  type Alert,
  type InsertAlert
} from "@shared/schema.js";
import { randomUUID } from "crypto";

export interface IStorage {
  // Crypto Assets
  getCryptoAssets(): Promise<CryptoAsset[]>;
  getCryptoAsset(symbol: string): Promise<CryptoAsset | undefined>;
  upsertCryptoAsset(asset: InsertCryptoAsset): Promise<CryptoAsset>;
  
  // Market Summary
  getMarketSummary(): Promise<MarketSummary | undefined>;
  updateMarketSummary(summary: InsertMarketSummary): Promise<MarketSummary>;
  
  // News
  getNews(category?: string, limit?: number): Promise<News[]>;
  createNews(news: InsertNews): Promise<News>;
  
  // Economic Events
  getEconomicEvents(startDate?: Date, endDate?: Date): Promise<EconomicEvent[]>;
  createEconomicEvent(event: InsertEconomicEvent): Promise<EconomicEvent>;
  
  // Whale Transactions
  getWhaleTransactions(limit?: number): Promise<WhaleTransaction[]>;
  createWhaleTransaction(transaction: InsertWhaleTransaction): Promise<WhaleTransaction>;
  
  // Airdrops
  getAirdrops(status?: string): Promise<Airdrop[]>;
  createAirdrop(airdrop: InsertAirdrop): Promise<Airdrop>;
  
  // FED Updates
  getFedUpdates(limit?: number): Promise<FedUpdate[]>;
  createFedUpdate(update: InsertFedUpdate): Promise<FedUpdate>;
  
  // Alerts
  getAlerts(limit?: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: string): Promise<Alert>;
  deleteAlert(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private cryptoAssets: Map<string, CryptoAsset>;
  private marketSummary: MarketSummary | undefined;
  private news: Map<string, News>;
  private economicEvents: Map<string, EconomicEvent>;
  private whaleTransactions: Map<string, WhaleTransaction>;
  private airdrops: Map<string, Airdrop>;
  private fedUpdates: Map<string, FedUpdate>;
  private alerts: Map<string, Alert>;

  constructor() {
    this.cryptoAssets = new Map();
    this.news = new Map();
    this.economicEvents = new Map();
    this.whaleTransactions = new Map();
    this.airdrops = new Map();
    this.fedUpdates = new Map();
    this.alerts = new Map();
  }

  // Crypto Assets
  async getCryptoAssets(): Promise<CryptoAsset[]> {
    return Array.from(this.cryptoAssets.values());
  }

  async getCryptoAsset(symbol: string): Promise<CryptoAsset | undefined> {
    return this.cryptoAssets.get(symbol);
  }

  async upsertCryptoAsset(asset: InsertCryptoAsset): Promise<CryptoAsset> {
    const existingAsset = this.cryptoAssets.get(asset.id);
    const newAsset: CryptoAsset = {
      ...asset,
      priceChange24h: asset.priceChange24h || null,
      marketCap: asset.marketCap || null,
      volume24h: asset.volume24h || null,
      sparklineData: Array.isArray(asset.sparklineData) ? [...asset.sparklineData] : null,
      lastUpdated: new Date(),
    };
    this.cryptoAssets.set(asset.id, newAsset);
    return newAsset;
  }

  // Market Summary
  async getMarketSummary(): Promise<MarketSummary | undefined> {
    return this.marketSummary;
  }

  async updateMarketSummary(summary: InsertMarketSummary): Promise<MarketSummary> {
    const newSummary: MarketSummary = {
      id: randomUUID(),
      ...summary,
      btcDominance: summary.btcDominance || null,
      fearGreedIndex: summary.fearGreedIndex || null,
      marketChange24h: summary.marketChange24h || null,
      lastUpdated: new Date(),
    };
    this.marketSummary = newSummary;
    return newSummary;
  }

  // News
  async getNews(category?: string, limit = 50): Promise<News[]> {
    let newsArray = Array.from(this.news.values());
    
    if (category) {
      newsArray = newsArray.filter(n => n.category === category);
    }
    
    return newsArray
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, limit);
  }

  async createNews(news: InsertNews): Promise<News> {
    const id = randomUUID();
    const newNews: News = {
      id,
      ...news,
      summary: news.summary || null,
      content: news.content || null,
      country: news.country || null,
      sentiment: news.sentiment || null,
      sourceUrl: news.sourceUrl || null,
      createdAt: new Date(),
    };
    this.news.set(id, newNews);
    return newNews;
  }

  // Economic Events
  async getEconomicEvents(startDate?: Date, endDate?: Date): Promise<EconomicEvent[]> {
    let events = Array.from(this.economicEvents.values());
    
    if (startDate) {
      events = events.filter(e => e.eventDate >= startDate);
    }
    
    if (endDate) {
      events = events.filter(e => e.eventDate <= endDate);
    }
    
    return events.sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());
  }

  async createEconomicEvent(event: InsertEconomicEvent): Promise<EconomicEvent> {
    const id = randomUUID();
    const newEvent: EconomicEvent = {
      id,
      ...event,
      previous: event.previous || null,
      actual: event.actual || null,
      currency: event.currency || null,
      sourceUrl: event.sourceUrl || null,
      forecast: event.forecast || null,
      createdAt: new Date(),
    };
    this.economicEvents.set(id, newEvent);
    return newEvent;
  }

  // Whale Transactions
  async getWhaleTransactions(limit = 50): Promise<WhaleTransaction[]> {
    return Array.from(this.whaleTransactions.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createWhaleTransaction(transaction: InsertWhaleTransaction): Promise<WhaleTransaction> {
    const id = randomUUID();
    const newTransaction: WhaleTransaction = {
      id,
      ...transaction,
      valueUsd: transaction.valueUsd || null,
      fromAddress: transaction.fromAddress || null,
      toAddress: transaction.toAddress || null,
      fromExchange: transaction.fromExchange || null,
      toExchange: transaction.toExchange || null,
      createdAt: new Date(),
    };
    this.whaleTransactions.set(id, newTransaction);
    return newTransaction;
  }

  // Airdrops
  async getAirdrops(status?: string): Promise<Airdrop[]> {
    let airdrops = Array.from(this.airdrops.values());
    
    if (status) {
      airdrops = airdrops.filter(a => a.status === status);
    }
    
    return airdrops.sort((a, b) => 
      (b.deadline?.getTime() || 0) - (a.deadline?.getTime() || 0)
    );
  }

  async createAirdrop(airdrop: InsertAirdrop): Promise<Airdrop> {
    const id = randomUUID();
    const newAirdrop: Airdrop = {
      id,
      ...airdrop,
      description: airdrop.description || null,
      tokenSymbol: airdrop.tokenSymbol || null,
      estimatedValue: airdrop.estimatedValue || null,
      eligibility: airdrop.eligibility || null,
      deadline: airdrop.deadline || null,
      website: airdrop.website || null,
      createdAt: new Date(),
    };
    this.airdrops.set(id, newAirdrop);
    return newAirdrop;
  }

  // FED Updates
  async getFedUpdates(limit = 50): Promise<FedUpdate[]> {
    return Array.from(this.fedUpdates.values())
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, limit);
  }

  async createFedUpdate(update: InsertFedUpdate): Promise<FedUpdate> {
    const id = randomUUID();
    const newUpdate: FedUpdate = {
      id,
      ...update,
      content: update.content || null,
      sourceUrl: update.sourceUrl || null,
      interestRate: update.interestRate || null,
      speaker: update.speaker || null,
      createdAt: new Date(),
    };
    this.fedUpdates.set(id, newUpdate);
    return newUpdate;
  }

  // Alerts
  async getAlerts(limit = 50): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const newAlert: Alert = {
      id,
      ...alert,
      value: alert.value || null,
      change: alert.change || null,
      asset: alert.asset || null,
      isRead: alert.isRead || false,
      createdAt: new Date(),
    };
    this.alerts.set(id, newAlert);
    return newAlert;
  }

  async markAlertAsRead(id: string): Promise<Alert> {
    const alert = this.alerts.get(id);
    if (alert) {
      const updatedAlert = { ...alert, isRead: true };
      this.alerts.set(id, updatedAlert);
      return updatedAlert;
    }
    throw new Error(`Alert with ID ${id} not found`);
  }

  async deleteAlert(id: string): Promise<void> {
    this.alerts.delete(id);
  }
}

export const storage = new MemStorage();

// Initialize with mock data
function initializeMockData() {
  // Mock crypto assets
  storage.upsertCryptoAsset({
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '43250.50',
    priceChange24h: '2.5',
    marketCap: '850000000000',
    volume24h: '25000000000',
    sparklineData: [42000, 42500, 43000, 43250]
  });

  storage.upsertCryptoAsset({
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: '2650.75',
    priceChange24h: '1.8',
    marketCap: '320000000000',
    volume24h: '15000000000',
    sparklineData: [2600, 2620, 2640, 2650]
  });

  storage.upsertCryptoAsset({
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: '98.25',
    priceChange24h: '5.2',
    marketCap: '45000000000',
    volume24h: '3000000000',
    sparklineData: [95, 96, 97, 98]
  });

  // Mock market summary
  storage.updateMarketSummary({
    totalMarketCap: '1200000000000',
    totalVolume24h: '45000000000',
    btcDominance: '52.5',
    fearGreedIndex: 65
  });

  // Mock news
  storage.createNews({
    title: 'Bitcoin Surges Past $43,000',
    summary: 'Bitcoin reaches new yearly high as institutional adoption increases',
    content: 'Bitcoin has surged past $43,000 for the first time this year...',
    source: 'CryptoNews',
    sourceUrl: 'https://example.com/bitcoin-surge',
    category: 'crypto',
    country: null,
    impact: 'high',
    sentiment: 'positive',
    publishedAt: new Date()
  });

  storage.createNews({
    title: 'Ethereum ETF Approval Expected Soon',
    summary: 'SEC expected to approve Ethereum ETF applications',
    content: 'The Securities and Exchange Commission is expected to approve...',
    source: 'CryptoInsider',
    sourceUrl: 'https://example.com/eth-etf',
    category: 'crypto',
    country: null,
    impact: 'high',
    sentiment: 'positive',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  });

  storage.createNews({
    title: 'Federal Reserve Maintains Interest Rates',
    summary: 'Fed keeps rates unchanged at 5.25-5.50%',
    content: 'The Federal Reserve maintained its benchmark interest rate...',
    source: 'Reuters',
    sourceUrl: 'https://example.com/fed-rates',
    category: 'macro',
    country: 'US',
    impact: 'high',
    sentiment: 'neutral',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
  });

  // Mock economic events
  storage.createEconomicEvent({
    title: 'US CPI Data Release',
    country: 'US',
    eventDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    previous: '3.1%',
    actual: null,
    currency: 'USD',
    impact: 'high'
  });

  storage.createEconomicEvent({
    title: 'Fed Interest Rate Decision',
    country: 'US',
    eventDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
    previous: '5.50%',
    actual: null,
    currency: 'USD',
    impact: 'high'
  });

  // Mock whale transactions
  storage.createWhaleTransaction({
    transactionHash: '0x1234567890abcdef',
    asset: 'BTC',
    amount: '847.2',
    valueUsd: '36700000',
    type: 'inflow',
    fromAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    toAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    fromExchange: 'Binance',
    toExchange: null,
    timestamp: new Date(Date.now() - 12 * 60 * 1000)
  });

  storage.createWhaleTransaction({
    transactionHash: '0xabcdef1234567890',
    asset: 'ETH',
    amount: '1250',
    valueUsd: '3300000',
    type: 'outflow',
    fromAddress: '0x742d35Cc6637C0532e6C9b3e33f2B9c4C7d3A3E3',
    toAddress: '0x742d35Cc6637C0532e6C9b3e33f2B9c4C7d3A3E4',
    fromExchange: null,
    toExchange: 'Coinbase',
    timestamp: new Date(Date.now() - 24 * 60 * 1000)
  });

  storage.createWhaleTransaction({
    transactionHash: '0x567890abcdef1234',
    asset: 'SOL',
    amount: '50000',
    valueUsd: '4900000',
    type: 'transfer',
    fromAddress: '0x5041ed759dd4afc3a72b8192c143f72f4724081a',
    toAddress: '0x876eabf441b2ee5b5b0554fd502a8e0600950cfa',
    fromExchange: 'Binance',
    toExchange: 'Kraken',
    timestamp: new Date(Date.now() - 45 * 60 * 1000)
  });

  console.log('✅ Mock data initialized');
}

// Initialize mock data
initializeMockData();
