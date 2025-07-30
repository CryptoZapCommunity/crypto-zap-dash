import { cn } from '@/lib/utils';

interface CryptoIconProps {
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CRYPTO_ICONS: Record<string, string> = {
  BTC: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg',
  ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
  SOL: 'https://cryptologos.cc/logos/solana-sol-logo.svg',
  USDT: 'https://cryptologos.cc/logos/tether-usdt-logo.svg',
  USDC: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg',
  BNB: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg',
  XRP: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg',
  ADA: 'https://cryptologos.cc/logos/cardano-ada-logo.svg',
  DOGE: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg',
  AVAX: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg',
  DOT: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.svg',
  MATIC: 'https://cryptologos.cc/logos/polygon-matic-logo.svg',
  LINK: 'https://cryptologos.cc/logos/chainlink-link-logo.svg',
  UNI: 'https://cryptologos.cc/logos/uniswap-uni-logo.svg',
  LTC: 'https://cryptologos.cc/logos/litecoin-ltc-logo.svg',
  BCH: 'https://cryptologos.cc/logos/bitcoin-cash-bch-logo.svg',
  ATOM: 'https://cryptologos.cc/logos/cosmos-atom-logo.svg',
  FTT: 'https://cryptologos.cc/logos/ftx-token-ftt-logo.svg',
  NEAR: 'https://cryptologos.cc/logos/near-protocol-near-logo.svg',
  ALGO: 'https://cryptologos.cc/logos/algorand-algo-logo.svg',
};

const FALLBACK_ICONS: Record<string, string> = {
  BTC: '₿',
  ETH: 'Ξ',
  SOL: '◎',
  USDT: '₮',
  USDC: '⊡',
  BNB: 'Ⓑ',
  XRP: '✕',
  ADA: '₳',
  DOGE: 'Ð',
  AVAX: '△',
  DOT: '●',
  MATIC: '⬟',
  LINK: '⧉',
  UNI: '🦄',
  LTC: 'Ł',
  BCH: '₿',
  ATOM: '⚛',
  FTT: 'Ⓕ',
  NEAR: 'Ⓝ',
  ALGO: '△',
};

const CRYPTO_COLORS: Record<string, string> = {
  BTC: 'bg-orange-500',
  ETH: 'bg-blue-500',
  SOL: 'bg-purple-500',
  USDT: 'bg-green-500',
  USDC: 'bg-blue-600',
  BNB: 'bg-yellow-500',
  XRP: 'bg-blue-400',
  ADA: 'bg-blue-700',
  DOGE: 'bg-yellow-400',
  AVAX: 'bg-red-500',
  DOT: 'bg-pink-500',
  MATIC: 'bg-purple-600',
  LINK: 'bg-blue-500',
  UNI: 'bg-pink-400',
  LTC: 'bg-gray-400',
  BCH: 'bg-green-400',
  ATOM: 'bg-indigo-500',
  FTT: 'bg-cyan-500',
  NEAR: 'bg-black',
  ALGO: 'bg-gray-700',
};

export function CryptoIcon({ symbol, size = 'md', className }: CryptoIconProps) {
  const normalizedSymbol = symbol.toUpperCase();
  const iconUrl = CRYPTO_ICONS[normalizedSymbol];
  const fallbackIcon = FALLBACK_ICONS[normalizedSymbol] || normalizedSymbol.charAt(0);
  const colorClass = CRYPTO_COLORS[normalizedSymbol] || 'bg-gray-500';

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  if (iconUrl) {
    return (
      <div className={cn('relative rounded-full overflow-hidden flex-shrink-0', sizeClasses[size], className)}>
        <img
          src={iconUrl}
          alt={`${symbol} logo`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to text icon if image fails to load
            const target = e.target as HTMLImageElement;
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="${cn('w-full h-full rounded-full flex items-center justify-center text-white font-bold', colorClass)}">
                  ${fallbackIcon}
                </div>
              `;
            }
          }}
        />
      </div>
    );
  }

  // Fallback to text icon
  return (
    <div className={cn(
      'rounded-full flex items-center justify-center text-white font-bold flex-shrink-0',
      sizeClasses[size],
      colorClass,
      className
    )}>
      {fallbackIcon}
    </div>
  );
}

export function getCryptoColor(symbol: string): string {
  return CRYPTO_COLORS[symbol.toUpperCase()] || 'bg-gray-500';
}

export function getCryptoIcon(symbol: string): string {
  return FALLBACK_ICONS[symbol.toUpperCase()] || symbol.charAt(0);
}