import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Skeleton } from './skeleton';

interface CryptoIconProps {
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fallback?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

// Cache local para ícones com TTL
const iconCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas

// Mapeamento de símbolos para IDs do CoinGecko (sem duplicatas)
const COINGECKO_IDS: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
  'ADA': 'cardano',
  'DOT': 'polkadot',
  'LINK': 'chainlink',
  'LTC': 'litecoin',
  'BCH': 'bitcoin-cash',
  'XLM': 'stellar',
  'XRP': 'ripple',
  'USDT': 'tether',
  'USDC': 'usd-coin',
  'DAI': 'dai',
  'UNI': 'uniswap',
  'AAVE': 'aave',
  'COMP': 'compound',
  'YFI': 'yearn-finance',
  'SUSHI': 'sushi',
  'CRV': 'curve-dao-token',
  'BAL': 'balancer',
  'SNX': 'havven',
  'MKR': 'maker',
  'ZRX': '0x',
  'BAT': 'basic-attention-token',
  'REP': 'augur',
  'ZEC': 'zcash',
  'XMR': 'monero',
  'DASH': 'dash',
  'ETC': 'ethereum-classic',
  'VET': 'vechain',
  'TRX': 'tron',
  'EOS': 'eos',
  'NEO': 'neo',
  'QTUM': 'qtum',
  'ICX': 'icon',
  'WAVES': 'waves',
  'OMG': 'omisego',
  'ZIL': 'zilliqa',
  'ONT': 'ontology',
  'NANO': 'nano',
  'IOTA': 'iota',
  'XEM': 'nem',
  'DOGE': 'dogecoin',
  'SHIB': 'shiba-inu',
  'MATIC': 'matic-network',
  'AVAX': 'avalanche-2',
  'FTM': 'fantom',
  'NEAR': 'near',
  'ALGO': 'algorand',
  'ATOM': 'cosmos',
  'THETA': 'theta-token',
  'FIL': 'filecoin',
  'ICP': 'internet-computer',
  'APT': 'aptos',
  'SUI': 'sui',
  'OP': 'optimism',
  'ARB': 'arbitrum',
  'BASE': 'base',
  'BLUR': 'blur',
  'PEPE': 'pepe',
  'BONK': 'bonk',
  'WIF': 'dogwifhat',
  'JUP': 'jupiter',
  'PYTH': 'pyth-network',
  'JTO': 'jito',
  'WEN': 'wen',
  'BOME': 'book-of-meme',
  'MYRO': 'myro',
  'POPCAT': 'popcat',
  'BOOK': 'book-of-meme',
  'SLERF': 'slerf',
  'TOSHI': 'toshi',
  'NINJA': 'ninja',
  'SAMO': 'samoyedcoin',
  'RAY': 'raydium',
  'SRM': 'serum',
  'ORCA': 'orca',
  'MNGO': 'mango-markets',
  'STEP': 'step-finance',
  'COPE': 'cope',
  'MEDIA': 'media-network',
  'ROPE': 'rope',
  'CREAM': 'cream-2',
  'ALPHA': 'alpha-finance',
  'PERP': 'perpetual-protocol',
  'RAD': 'radicle',
  'FORTH': 'ampleforth-governance-token',
  'RLC': 'iexec-rlc',
  'STORJ': 'storj',
  'SKL': 'skale',
  'ANKR': 'ankr',
  'COTI': 'coti',
  'CELO': 'celo',
  'CHZ': 'chiliz',
  'HOT': 'holochain',
  'ENJ': 'enjincoin',
  'MANA': 'decentraland',
  'SAND': 'the-sandbox',
  'AXS': 'axie-infinity',
  'GALA': 'gala',
  'FLOW': 'flow',
  'DYDX': 'dydx',
  'IMX': 'immutable-x',
  'AR': 'arweave',
  'REN': 'republic-protocol',
  'RSR': 'reserve-rights',
  'OGN': 'origin-protocol',
  'NMR': 'numeraire',
  'MLN': 'melon',
  'KNC': 'kyber-network-crystal',
  'BAND': 'band-protocol',
  'UMA': 'uma',
  'API3': 'api3',
  'BADGER': 'badger-dao',
  'FARM': 'harvest-finance',
  'KP3R': 'keep3rv1',
  'HEGIC': 'hegic',
  'PICKLE': 'pickle-finance',
  'COVER': 'cover-protocol',
  'AKRO': 'akropolis',
  'POND': 'marlin',
  'PHA': 'pha',
  'LINA': 'linear',
  'LIT': 'litentry',
};

function getFallbackText(symbol: string): string {
  if (!symbol || typeof symbol !== 'string') return '??';
  return symbol.slice(0, 2).toUpperCase();
}

function getCoinGeckoUrl(symbol: string): string {
  const coinId = COINGECKO_IDS[symbol.toUpperCase()];
  if (coinId) {
    return `https://assets.coingecko.com/coins/images/1/large/${coinId}.png?1696501400`;
  }
  // Fallback para Bitcoin se não encontrar o símbolo
  return 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400';
}

export function CryptoIcon({ 
  symbol, 
  size = 'md', 
  className = '',
  fallback
}: CryptoIconProps) {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchIcon = async () => {
      if (!symbol) {
        if (isMounted) {
          setIsLoading(false);
          setHasError(true);
        }
        return;
      }

      // Check cache first
      const cached = iconCache.get(symbol);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        if (isMounted) {
          setIconUrl(cached.url);
          setIsLoading(false);
        }
        return;
      }

      try {
        const url = getCoinGeckoUrl(symbol);
        
        // Test if image loads successfully
        const img = new Image();
        img.onload = () => {
          if (isMounted) {
            setIconUrl(url);
            setIsLoading(false);
            setHasError(false);
            
            // Cache the successful URL
            iconCache.set(symbol, {
              url,
              timestamp: Date.now()
            });
          }
        };
        
        img.onerror = () => {
          if (isMounted) {
            setHasError(true);
            setIsLoading(false);
          }
        };
        
        img.src = url;
      } catch (error) {
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    fetchIcon();

    return () => {
      isMounted = false;
    };
  }, [symbol]);

  if (isLoading) {
    return (
      <Skeleton className={`${sizeClasses[size]} rounded-full ${className}`} />
    );
  }

  if (hasError || !iconUrl) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground ${className}`}>
        {fallback || getFallbackText(symbol)}
      </div>
    );
  }

  return (
    <img
      src={iconUrl}
      alt={`${symbol} icon`}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      onError={() => {
        setHasError(true);
        setIconUrl(null);
      }}
    />
  );
}

interface CryptoIconsProps {
  symbols: string[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CryptoIcons({ symbols, size = 'md', className = '' }: CryptoIconsProps) {
  const [iconUrls, setIconUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIcons = async () => {
      const urls: Record<string, string> = {};
      
      for (const symbol of symbols) {
        const url = getCoinGeckoUrl(symbol);
        urls[symbol] = url;
      }
      
      setIconUrls(urls);
      setIsLoading(false);
    };

    fetchIcons();
  }, [symbols]);

  if (isLoading) {
    return (
      <div className={`flex -space-x-2 ${className}`}>
        {symbols.map((symbol, index) => (
          <Skeleton key={index} className={`${sizeClasses[size]} rounded-full`} />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {symbols.map((symbol, index) => (
        <CryptoIcon key={index} symbol={symbol} size={size} />
      ))}
    </div>
  );
}