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
  price: string;
  marketCapRank?: number;
  image?: string;
  priceChange24h: string;
}

export interface TrendingCoins {
  gainers: TrendingCoin[];
  losers: TrendingCoin[];
}

export interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  change24h: number;
  isWatching: boolean;
}

export interface Alert {
  id: string;
  type: 'price_target' | 'volume_spike' | 'whale_movement' | 'news_sentiment' | 'technical_indicator';
  priority: 'low' | 'medium' | 'high' | 'critical';
  asset?: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  value?: string;
  change?: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface MarketDataResponse {
  marketSummary: MarketSummary;
  cryptoAssets: CryptoAsset[];
}

export interface NewsResponse {
  news: News[];
  total: number;
  page: number;
  limit: number;
}

export interface EconomicCalendarResponse {
  events: EconomicEvent[];
  total: number;
  page: number;
  limit: number;
}

export interface WhaleTransactionsResponse {
  transactions: WhaleTransaction[];
  total: number;
  page: number;
  limit: number;
}

export interface AirdropsResponse {
  airdrops: Airdrop[];
  total: number;
  page: number;
  limit: number;
}

export interface FedUpdatesResponse {
  updates: FedUpdate[];
  total: number;
  page: number;
  limit: number;
}

// Chart data types
export interface ChartData {
  symbol: string;
  name: string;
  price: string;
  sparklineData: number[];
  timeframes: {
    '1D': number[];
    '7D': number[];
    '1M': number[];
    '1Y': number[];
  };
}

// Market sentiment types
export interface MarketSentiment {
  fearGreedIndex: number;
  sentiment: 'fear' | 'neutral' | 'greed' | 'extreme_fear' | 'extreme_greed';
  timestamp: string;
  description: string;
}

export interface SentimentData {
  overall: number; // 0-100
  fear_greed_index: number; // 0-100
  social_mentions: number;
  news_sentiment: number; // 0-100
  whale_activity: 'bullish' | 'bearish' | 'neutral';
  technical_indicators: 'bullish' | 'bearish' | 'neutral';
  updated_at: string;
}

// Technical indicators
export interface TechnicalIndicator {
  symbol: string;
  indicator: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
  strength: number;
  timestamp: string;
}

// WebSocket message interface (currently not used - polling is used instead)
// export interface WebSocketMessage {
//   type: string;
//   data: any;
//   timestamp: number;
// }

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

// Utility types for validation
export type ValidatedData<T> = {
  data: T;
  isValid: boolean;
  errors: string[];
};

// Hook return types
export interface UseQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  clearCache: () => void;
}

// Component prop types
export interface LoadingProps {
  isLoading: boolean;
  error?: Error | null;
  retry?: () => void;
}

export interface DataProps<T> {
  data: T;
  isLoading: boolean;
  error?: Error | null;
  retry?: () => void;
}
