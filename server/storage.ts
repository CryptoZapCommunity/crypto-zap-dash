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
  type InsertMarketSummary
} from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private cryptoAssets: Map<string, CryptoAsset>;
  private marketSummary: MarketSummary | undefined;
  private news: Map<string, News>;
  private economicEvents: Map<string, EconomicEvent>;
  private whaleTransactions: Map<string, WhaleTransaction>;
  private airdrops: Map<string, Airdrop>;
  private fedUpdates: Map<string, FedUpdate>;

  constructor() {
    this.cryptoAssets = new Map();
    this.news = new Map();
    this.economicEvents = new Map();
    this.whaleTransactions = new Map();
    this.airdrops = new Map();
    this.fedUpdates = new Map();
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
      sparklineData: asset.sparklineData || null,
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
}

export const storage = new MemStorage();
