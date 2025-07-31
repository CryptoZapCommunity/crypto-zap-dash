import fetch from 'node-fetch';
import type { CryptoAsset } from '../../shared/schema.js';

interface TrendingCoin {
  id: string;
  symbol: string;
  name: string;
  price: number;
  marketCapRank: number;
  image: string;
  priceChange24h: number;
}

export class CryptoService {
  private baseUrl = 'https://api.coingecko.com/api/v3';
  private apiKey = process.env.COINGECKO_API_KEY || 'demo';
  private coinsCache: Map<string, string> = new Map(); // symbol -> id
  private cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
  private lastCacheUpdate = 0;

  async getTrendingCoins(): Promise<{ gainers: TrendingCoin[], losers: TrendingCoin[] }> {
    try {
      console.log('🪙 Fetching trending coins...');
      const response = await fetch(
        `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h&x_cg_demo_api_key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const coins = await response.json() as any[];

      console.log(`✅ Found ${coins.length} coins`);
      
      const trendingCoins = coins.slice(0, 10).map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol?.toUpperCase(),
        name: coin.name,
        price: coin.current_price || 0,
        marketCapRank: coin.market_cap_rank,
        image: coin.image,
        priceChange24h: coin.price_change_percentage_24h || 0,
      }));

      // Split into gainers and losers
      const gainers = trendingCoins.filter(coin => coin.priceChange24h > 0);
      const losers = trendingCoins.filter(coin => coin.priceChange24h < 0);

      return { gainers, losers };
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      return { gainers: [], losers: [] };
    }
  }

  async getCryptoIcon(symbol: string): Promise<string | null> {
    try {
      const coinId = await this.getCoinId(symbol);
      if (!coinId) {
        console.log(`❌ No coin found for symbol: ${symbol}`);
        return null;
      }

      console.log(`🪙 Fetching icon for: ${symbol}`);
      const response = await fetch(
        `${this.baseUrl}/coins/${coinId}?x_cg_demo_api_key=${this.apiKey}`
      );

      if (!response.ok) {
        console.log(`❌ Icon not found for: ${symbol}`);
        return null;
      }

      const data = await response.json() as any;
      const iconUrl = data.image?.large || data.image?.small;
      
      if (iconUrl) {
        console.log(`✅ Icon found: Yes`);
        return iconUrl;
      } else {
        console.log(`❌ Icon not found for: ${symbol}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching icon for ${symbol}:`, error);
      return null;
    }
  }

  async getCryptoIcons(symbols: string[]): Promise<Record<string, string>> {
    try {
      console.log(`🪙 Fetching icons for: ${symbols.join(', ')}`);
      const icons: Record<string, string> = {};

      // Fetch icons in parallel with rate limiting
      const promises = symbols.map(async (symbol, index) => {
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, index * 100));
        const icon = await this.getCryptoIcon(symbol);
        if (icon) {
          icons[symbol.toUpperCase()] = icon;
        }
      });

      await Promise.all(promises);
      console.log(`✅ Found ${Object.keys(icons).length} icons`);
      return icons;
    } catch (error) {
      console.error('Error fetching crypto icons:', error);
      return {};
    }
  }

  private async getCoinId(symbol: string): Promise<string | null> {
    // Check cache first
    if (this.coinsCache.has(symbol.toUpperCase())) {
      return this.coinsCache.get(symbol.toUpperCase()) || null;
    }

    // Update cache if expired
    if (Date.now() - this.lastCacheUpdate > this.cacheExpiry) {
      await this.updateCoinsCache();
    }

    // Try to find in cache again
    if (this.coinsCache.has(symbol.toUpperCase())) {
      return this.coinsCache.get(symbol.toUpperCase()) || null;
    }

    // If still not found, try fuzzy matching
    return this.findCoinByFuzzyMatch(symbol);
  }

  private async updateCoinsCache(): Promise<void> {
    try {
      console.log('🔄 Updating coins cache...');
      const response = await fetch(
        `${this.baseUrl}/coins/list?include_platform=false&x_cg_demo_api_key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch coins list: ${response.status}`);
      }

      const coins = await response.json();
      
      // Clear existing cache
      this.coinsCache.clear();
      
      // Build new cache
      coins.forEach((coin: any) => {
        if (coin.symbol) {
          this.coinsCache.set(coin.symbol.toUpperCase(), coin.id);
        }
      });

      this.lastCacheUpdate = Date.now();
      console.log(`✅ Updated coins cache with ${this.coinsCache.size} coins`);
    } catch (error) {
      console.error('Error updating coins cache:', error);
    }
  }

  private findCoinByFuzzyMatch(symbol: string): string | null {
    const upperSymbol = symbol.toUpperCase();
    
    // Try exact match first
    if (this.coinsCache.has(upperSymbol)) {
      return this.coinsCache.get(upperSymbol) || null;
    }

    // Try common variations
    const variations = [
      upperSymbol,
      upperSymbol.replace('-', ''),
      upperSymbol.replace('_', ''),
      upperSymbol.replace('USD', ''),
      upperSymbol.replace('USDT', ''),
      upperSymbol.replace('USDC', ''),
    ];

    for (const variation of variations) {
      if (this.coinsCache.has(variation)) {
        return this.coinsCache.get(variation) || null;
      }
    }

    // Try partial matches for popular coins
    const popularCoins: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'SOL': 'solana',
      'ADA': 'cardano',
      'DOT': 'polkadot',
      'LINK': 'chainlink',
      'UNI': 'uniswap',
      'MATIC': 'matic-network',
      'AVAX': 'avalanche-2',
      'ATOM': 'cosmos',
      'FTM': 'fantom',
      'NEAR': 'near',
      'ALGO': 'algorand',
      'VET': 'vechain',
      'ICP': 'internet-computer',
      'FIL': 'filecoin',
      'TRX': 'tron',
      'XLM': 'stellar',
      'XMR': 'monero',
      'LTC': 'litecoin',
      'BCH': 'bitcoin-cash',
      'ETC': 'ethereum-classic',
      'XRP': 'ripple',
      'DOGE': 'dogecoin',
      'SHIB': 'shiba-inu',
      'LUNC': 'terra-luna-2',
      'APT': 'aptos',
      'SUI': 'sui',
      'TIA': 'celestia',
      'JUP': 'jupiter',
      'PYTH': 'pyth-network',
      'BONK': 'bonk',
      'WIF': 'dogwifhat',
      'PEPE': 'pepe',
      'FLOKI': 'floki',
      'BABYDOGE': 'babydoge-coin',
    };

    if (popularCoins[upperSymbol]) {
      return popularCoins[upperSymbol];
    }

    return null;
  }

  async updateCryptoPrices(): Promise<void> {
    try {
      console.log('🔄 Updating crypto prices...');
      
      // Fetch top cryptocurrencies from CoinGecko with sparkline data
      const response = await fetch(
        `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h&x_cg_demo_api_key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const coins = await response.json() as any[];
      
      // Import storage here to avoid circular dependency
      const { storage } = await import('../storage');
      
      // Save each coin to storage
      console.log(`📊 Saving ${coins.length} coins to storage...`);
      for (const coin of coins) {
        try {
          const asset = await storage.upsertCryptoAsset({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            price: coin.current_price.toString(),
            priceChange24h: coin.price_change_percentage_24h?.toString() || null,
            marketCap: coin.market_cap?.toString() || null,
            volume24h: coin.total_volume?.toString() || null,
            sparklineData: coin.sparkline_in_7d?.price || null,
            lastUpdated: new Date().toISOString(),
          });
          console.log(`✅ Saved: ${asset.symbol} - $${asset.price} - Sparkline: ${asset.sparklineData?.length || 0} points`);
        } catch (error) {
          console.error(`❌ Error saving ${coin.symbol}:`, error);
        }
      }

      console.log(`✅ Updated ${coins.length} crypto prices`);
    } catch (error) {
      console.error('Error updating crypto prices:', error);
    }
  }

  async updateMarketSummary(): Promise<void> {
    try {
      console.log('🔄 Updating market summary...');
      
      // Fetch global market data
      const response = await fetch(
        `${this.baseUrl}/global?x_cg_demo_api_key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json() as any;
      const globalData = data.data;

      // Import storage here to avoid circular dependency
      const { storage } = await import('../storage');
      
      // Update market summary
      await storage.updateMarketSummary({
        totalMarketCap: globalData.total_market_cap.usd.toString(),
        totalVolume24h: globalData.total_volume.usd.toString(),
        btcDominance: globalData.market_cap_percentage.btc.toString(),
        fearGreedIndex: null, // Would need separate API
        marketChange24h: globalData.market_cap_change_percentage_24h_usd?.toString() || null,
        lastUpdated: new Date().toISOString(),
      });

      console.log('✅ Market summary updated');
    } catch (error) {
      console.error('Error updating market summary:', error);
    }
  }
}
