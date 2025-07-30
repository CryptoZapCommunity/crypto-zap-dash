import fetch from 'node-fetch';
import type { CryptoAsset, TrendingCoin } from '@/types';

export class CryptoService {
  private baseUrl = 'https://api.coingecko.com/api/v3';
  private apiKey = process.env.COINGECKO_API_KEY || 'demo';
  private coinsCache: Map<string, string> = new Map(); // symbol -> id
  private cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
  private lastCacheUpdate = 0;

  async getTrendingCoins(): Promise<TrendingCoin[]> {
    try {
      console.log('🪙 Fetching trending coins...');
      const response = await fetch(
        `${this.baseUrl}/search/trending?x_cg_demo_api_key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      const coins = data.coins || [];

      console.log(`✅ Found ${coins.length} trending coins`);
      return coins.slice(0, 10).map((coin: any) => ({
        id: coin.item.id,
        symbol: coin.item.symbol?.toUpperCase(),
        name: coin.item.name,
        price: coin.item.price_btc,
        marketCapRank: coin.item.market_cap_rank,
        image: coin.item.large,
        priceChange24h: coin.item.data?.price_change_percentage_24h?.usd || 0,
      }));
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      return [];
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

      const data = await response.json();
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
      // This would typically update prices in storage
      // For now, we'll just log the action
      console.log('✅ Crypto prices update completed');
    } catch (error) {
      console.error('Error updating crypto prices:', error);
    }
  }

  async updateMarketSummary(): Promise<void> {
    try {
      console.log('🔄 Updating market summary...');
      // This would typically update market summary in storage
      // For now, we'll just log the action
      console.log('✅ Market summary update completed');
    } catch (error) {
      console.error('Error updating market summary:', error);
    }
  }
}
