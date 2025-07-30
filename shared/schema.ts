import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cryptoAssets = pgTable("crypto_assets", {
  id: varchar("id").primaryKey(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  priceChange24h: decimal("price_change_24h", { precision: 10, scale: 4 }),
  marketCap: decimal("market_cap", { precision: 20, scale: 2 }),
  volume24h: decimal("volume_24h", { precision: 20, scale: 2 }),
  sparklineData: jsonb("sparkline_data").$type<number[]>(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const news = pgTable("news", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  summary: text("summary"),
  content: text("content"),
  source: text("source").notNull(),
  sourceUrl: text("source_url"),
  category: text("category").notNull(), // geopolitics, macro, crypto
  country: text("country"),
  impact: text("impact").notNull(), // low, medium, high
  sentiment: text("sentiment"), // positive, negative, neutral
  publishedAt: timestamp("published_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const economicEvents = pgTable("economic_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  country: text("country").notNull(),
  currency: text("currency"),
  impact: text("impact").notNull(), // low, medium, high
  forecast: text("forecast"),
  previous: text("previous"),
  actual: text("actual"),
  eventDate: timestamp("event_date").notNull(),
  sourceUrl: text("source_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const whaleTransactions = pgTable("whale_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionHash: text("transaction_hash").notNull(),
  asset: text("asset").notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  valueUsd: decimal("value_usd", { precision: 20, scale: 2 }),
  type: text("type").notNull(), // inflow, outflow, transfer
  fromAddress: text("from_address"),
  toAddress: text("to_address"),
  fromExchange: text("from_exchange"),
  toExchange: text("to_exchange"),
  timestamp: timestamp("timestamp").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const airdrops = pgTable("airdrops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectName: text("project_name").notNull(),
  tokenSymbol: text("token_symbol"),
  description: text("description"),
  estimatedValue: text("estimated_value"),
  eligibility: text("eligibility"),
  deadline: timestamp("deadline"),
  status: text("status").notNull(), // upcoming, ongoing, ended
  website: text("website"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fedUpdates = pgTable("fed_updates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  type: text("type").notNull(), // rate_decision, fomc_minutes, speech, projection
  content: text("content"),
  interestRate: decimal("interest_rate", { precision: 5, scale: 4 }),
  speaker: text("speaker"),
  sourceUrl: text("source_url"),
  publishedAt: timestamp("published_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketSummary = pgTable("market_summary", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalMarketCap: decimal("total_market_cap", { precision: 20, scale: 2 }).notNull(),
  totalVolume24h: decimal("total_volume_24h", { precision: 20, scale: 2 }).notNull(),
  btcDominance: decimal("btc_dominance", { precision: 5, scale: 2 }),
  fearGreedIndex: integer("fear_greed_index"),
  marketChange24h: decimal("market_change_24h", { precision: 10, scale: 4 }),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Insert schemas
export const insertCryptoAssetSchema = createInsertSchema(cryptoAssets).omit({
  lastUpdated: true,
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true,
});

export const insertEconomicEventSchema = createInsertSchema(economicEvents).omit({
  id: true,
  createdAt: true,
});

export const insertWhaleTransactionSchema = createInsertSchema(whaleTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertAirdropSchema = createInsertSchema(airdrops).omit({
  id: true,
  createdAt: true,
});

export const insertFedUpdateSchema = createInsertSchema(fedUpdates).omit({
  id: true,
  createdAt: true,
});

export const insertMarketSummarySchema = createInsertSchema(marketSummary).omit({
  id: true,
  lastUpdated: true,
});

// Types
export type CryptoAsset = typeof cryptoAssets.$inferSelect;
export type InsertCryptoAsset = z.infer<typeof insertCryptoAssetSchema>;

export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;

export type EconomicEvent = typeof economicEvents.$inferSelect;
export type InsertEconomicEvent = z.infer<typeof insertEconomicEventSchema>;

export type WhaleTransaction = typeof whaleTransactions.$inferSelect;
export type InsertWhaleTransaction = z.infer<typeof insertWhaleTransactionSchema>;

export type Airdrop = typeof airdrops.$inferSelect;
export type InsertAirdrop = z.infer<typeof insertAirdropSchema>;

export type FedUpdate = typeof fedUpdates.$inferSelect;
export type InsertFedUpdate = z.infer<typeof insertFedUpdateSchema>;

export type MarketSummary = typeof marketSummary.$inferSelect;
export type InsertMarketSummary = z.infer<typeof insertMarketSummarySchema>;
