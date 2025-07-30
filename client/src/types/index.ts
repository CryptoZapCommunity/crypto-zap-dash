export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  price: string;
  priceChange24h: string | null;
  marketCap: string | null;
  volume24h: string | null;
  sparklineData: number[] | null;
  lastUpdated: string | null;
}

export interface MarketSummary {
  id: string;
  totalMarketCap: string;
  totalVolume24h: string;
  btcDominance: string | null;
  fearGreedIndex: number | null;
  marketChange24h: string | null;
  lastUpdated: string | null;
}

export interface News {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  source: string;
  sourceUrl: string | null;
  category: string;
  country: string | null;
  impact: string;
  sentiment: string | null;
  publishedAt: string;
  createdAt: string | null;
}

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  currency: string | null;
  impact: string;
  forecast: string | null;
  previous: string | null;
  actual: string | null;
  eventDate: string;
  sourceUrl: string | null;
  createdAt: string | null;
}

export interface WhaleTransaction {
  id: string;
  transactionHash: string;
  asset: string;
  amount: string;
  valueUsd: string | null;
  type: string;
  fromAddress: string | null;
  toAddress: string | null;
  fromExchange: string | null;
  toExchange: string | null;
  timestamp: string;
  createdAt: string | null;
}

export interface Airdrop {
  id: string;
  projectName: string;
  tokenSymbol: string | null;
  description: string | null;
  estimatedValue: string | null;
  eligibility: string | null;
  deadline: string | null;
  status: string;
  website: string | null;
  createdAt: string | null;
}

export interface FedUpdate {
  id: string;
  title: string;
  type: string;
  content: string | null;
  sourceUrl: string | null;
  publishedAt: string;
  createdAt: string | null;
  interestRate: string | null;
  speaker: string | null;
}

export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  marketCapRank?: number;
  image?: string;
  priceChange24h: number;
}

export interface TrendingCoins {
  gainers: TrendingCoin[];
  losers: TrendingCoin[];
}

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

export type Language = 'en' | 'pt';

export type Theme = 'light' | 'dark';

export interface CountryFlag {
  [key: string]: string;
}

export const COUNTRY_FLAGS: CountryFlag = {
  US: '🇺🇸',
  EU: '🇪🇺',
  DE: '🇩🇪',
  JP: '🇯🇵',
  UK: '🇬🇧',
  CN: '🇨🇳',
  CA: '🇨🇦',
  AU: '🇦🇺',
  FR: '🇫🇷',
  IT: '🇮🇹',
  ES: '🇪🇸',
  BR: '🇧🇷',
};
