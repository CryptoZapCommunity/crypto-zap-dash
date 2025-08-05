import { Card, CardContent } from '@/components/ui/card';
import { CryptoAssetSkeleton } from '@/components/ui/loading-skeleton';
import { CryptoIcon } from '@/components/ui/crypto-icon';
import { t } from '@/lib/i18n';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CryptoAsset, MarketSummary } from '@/types';

interface MarketOverviewProps {
  cryptoAssets: CryptoAsset[];
  marketSummary: MarketSummary | null;
  isLoading: boolean;
}

interface SparklineProps {
  data: number[];
  isPositive: boolean;
  className?: string;
}

function Sparkline({ data, isPositive, className }: SparklineProps) {
  if (!data || data.length === 0) {
    return <div className={cn('h-12 bg-muted rounded-lg', className)} />;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  return (
    <div className={cn('h-12 rounded-lg flex items-end space-x-1 px-2', className)}>
      {(Array.isArray(data) ? data : []).slice(-20).map((value, index) => {
        const height = range > 0 ? ((value - min) / range) * 100 : 50;
        return (
          <div
            key={index}
            className={cn(
              'sparkline-bar',
              isPositive ? 'bg-green-500' : 'bg-red-500'
            )}
            style={{ height: `${Math.max(height, 10)}%` }}
          />
        );
      })}
    </div>
  );
}

function CryptoAssetCard({ asset }: { asset: CryptoAsset }) {
  const price = parseFloat(asset.price);
  const change = parseFloat(asset.priceChange24h || '0');
  const isPositive = change >= 0;

  return (
    <Card className="glassmorphism card-hover">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CryptoIcon symbol={asset.symbol} size="md" />
            <div>
              <h3 className="font-semibold text-foreground">{asset.name}</h3>
              <p className="text-sm text-muted-foreground">{asset.symbol.toUpperCase()}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-foreground">
              ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className={cn(
              'text-sm font-medium',
              isPositive ? 'text-green-500' : 'text-red-500'
            )}>
              {isPositive ? '+' : ''}{(typeof change === 'number' ? change.toFixed(2) : '0.00')}%
            </p>
          </div>
        </div>
        
        <Sparkline
          data={asset.sparklineData || []}
          isPositive={isPositive}
          className={cn(
            'bg-gradient-to-r from-opacity-20 to-opacity-40',
            isPositive ? 'from-green-500/20 to-green-500/40' : 'from-red-500/20 to-red-500/40'
          )}
        />
      </CardContent>
    </Card>
  );
}

function FearGreedGauge({ value }: { value: number }) {
  const getGaugeColor = (val: number) => {
    if (val <= 25) return 'text-red-500';
    if (val <= 50) return 'text-orange-500';
    if (val <= 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getGaugeLabel = (val: number) => {
    if (val <= 25) return 'Extreme Fear';
    if (val <= 50) return 'Fear';
    if (val <= 75) return 'Greed';
    return 'Extreme Greed';
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{t('dashboard.fearGreed')}</span>
      <div className="flex items-center space-x-2">
        <div className="w-16 h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ 
              width: '4px',
              marginLeft: `${Math.max(0, Math.min(100, value))}%`,
              transform: 'translateX(-50%)'
            }}
          />
        </div>
        <span className={cn('text-xs font-medium', getGaugeColor(value))}>
          {value}
        </span>
      </div>
    </div>
  );
}

function MarketCapCard({ marketSummary }: { marketSummary: MarketSummary }) {
  const marketCap = parseFloat(marketSummary.totalMarketCap);
  const change = parseFloat(marketSummary.marketChange24h || '0');
  const isPositive = change >= 0;

  return (
    <Card className="glassmorphism card-hover">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-green-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t('market.marketCap')}</h3>
              <p className="text-sm text-muted-foreground">{t('market.total')}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-foreground">
              ${(typeof marketCap === 'number' ? (marketCap / 1e12).toFixed(2) : '0.00')}T
            </p>
            <p className={cn(
              'text-sm font-medium',
              isPositive ? 'text-green-500' : 'text-red-500'
            )}>
              {isPositive ? '+' : ''}{change.toFixed(2)}%
            </p>
          </div>
        </div>
        
        {marketSummary.fearGreedIndex && (
          <FearGreedGauge value={marketSummary.fearGreedIndex} />
        )}
      </CardContent>
    </Card>
  );
}

export function MarketOverview({ cryptoAssets, marketSummary, isLoading }: MarketOverviewProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{t('dashboard.marketOverview')}</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              24H
            </button>
            <button className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground">
              7D
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <CryptoAssetSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const mainAssets = ['bitcoin', 'ethereum', 'solana'];
  const filteredAssets = (Array.isArray(cryptoAssets) ? cryptoAssets : []).filter(asset => mainAssets.includes(asset.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('dashboard.marketOverview')}</h2>
          <p className="text-muted-foreground">
            {marketSummary ? `Market Cap: $${(parseFloat(marketSummary.totalMarketCap) / 1e12).toFixed(2)}T` : 'Loading market data...'}
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            24H
          </button>
          <button className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground">
            7D
          </button>
          <button className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            1M
          </button>
        </div>
      </div>

      {/* Market Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {marketSummary && (
          <>
            <div className="glassmorphism rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="text-lg font-bold text-foreground">
                    ${(parseFloat(marketSummary.totalMarketCap) / 1e12).toFixed(2)}T
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-500 text-sm">📊</span>
                </div>
              </div>
            </div>

            <div className="glassmorphism rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">24h Volume</p>
                  <p className="text-lg font-bold text-foreground">
                    ${(parseFloat(marketSummary.totalVolume24h) / 1e9).toFixed(2)}B
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-green-500 text-sm">📈</span>
                </div>
              </div>
            </div>

            <div className="glassmorphism rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">BTC Dominance</p>
                  <p className="text-lg font-bold text-foreground">
                    {parseFloat(marketSummary.btcDominance || '0').toFixed(1)}%
                  </p>
                </div>
                <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <span className="text-orange-500 text-sm">₿</span>
                </div>
              </div>
            </div>

            <div className="glassmorphism rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Fear & Greed</p>
                  <p className="text-lg font-bold text-foreground">
                    {marketSummary.fearGreedIndex || 50}
                  </p>
                </div>
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <span className="text-purple-500 text-sm">😱</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Crypto Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(Array.isArray(filteredAssets) ? filteredAssets : []).map((asset) => (
          <CryptoAssetCard key={asset.id} asset={asset} />
        ))}
        
        {marketSummary && (
          <MarketCapCard marketSummary={marketSummary} />
        )}
      </div>
    </div>
  );
}
