import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingCoinsSkeleton } from '@/components/ui/loading-skeleton';
import { CryptoIcon } from '@/components/ui/crypto-icon';
import { t } from '@/lib/i18n';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TrendingCoins } from '@/types';

interface TrendingCoinsProps {
  trendingCoins: TrendingCoins | null;
  isLoading: boolean;
}

interface CoinListProps {
  title: string;
  icon: React.ReactNode;
  coins: Array<{
    id: string;
    name: string;
    symbol: string;
    price: string;
    priceChange24h: string;
  }>;
  isGainers: boolean;
}

function CoinList({ title, icon, coins, isGainers }: CoinListProps) {
  return (
    <Card className="glassmorphism card-hover">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {coins.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            {t('common.loading')}
          </p>
        ) : (
          (Array.isArray(coins) ? coins : []).map((coin, index) => (
            <div
              key={coin.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer table-row-hover"
            >
              <div className="flex items-center space-x-3">
                <CryptoIcon symbol={coin.symbol} size="md" />
                <div>
                  <p className="font-medium text-foreground text-sm">
                    {coin.symbol.toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {coin.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground text-sm">
                  ${parseFloat(coin.price).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: parseFloat(coin.price) > 1 ? 2 : 6,
                  })}
                </p>
                <p className={cn(
                  'text-xs font-medium',
                  isGainers ? 'text-green-500' : 'text-red-500'
                )}>
                  {isGainers ? '+' : ''}{parseFloat(coin.priceChange24h).toFixed(2)}%
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function TrendingCoins({ trendingCoins, isLoading }: TrendingCoinsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Trending Coins</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              24H
            </button>
            <button className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground">
              1H
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glassmorphism">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div className="w-32 h-6 bg-muted rounded" />
              </div>
            </CardHeader>
            <CardContent>
              <TrendingCoinsSkeleton />
            </CardContent>
          </Card>
          <Card className="glassmorphism">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <div className="w-32 h-6 bg-muted rounded" />
              </div>
            </CardHeader>
            <CardContent>
              <TrendingCoinsSkeleton />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!trendingCoins || (!trendingCoins.gainers && !trendingCoins.losers)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Trending Coins</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glassmorphism">
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center">
                {t('common.noData')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Trending Coins</h2>
          <p className="text-muted-foreground">
            Top movers in the last 24 hours
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            24H
          </button>
          <button className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground">
            1H
          </button>
          <button className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            7D
          </button>
        </div>
      </div>

      {/* Trending Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glassmorphism rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Gainers</p>
              <p className="text-lg font-bold text-green-500">
                {trendingCoins?.gainers?.length || 0}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </div>

        <div className="glassmorphism rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Losers</p>
              <p className="text-lg font-bold text-red-500">
                {trendingCoins?.losers?.length || 0}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
          </div>
        </div>

        <div className="glassmorphism rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Change</p>
              <p className="text-lg font-bold text-foreground">
                {trendingCoins?.gainers?.length > 0 ? 
                  (trendingCoins.gainers.reduce((acc, coin) => acc + parseFloat(coin.priceChange24h), 0) / trendingCoins.gainers.length).toFixed(2) : '0.00'}%
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-500 text-sm">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coins Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CoinList
          title={t('dashboard.topGainers')}
          icon={<TrendingUp className="w-5 h-5 text-green-500 mr-2" />}
          coins={trendingCoins?.gainers || []}
          isGainers={true}
        />
        
        <CoinList
          title={t('dashboard.topLosers')}
          icon={<TrendingDown className="w-5 h-5 text-red-500 mr-2" />}
          coins={trendingCoins?.losers || []}
          isGainers={false}
        />
      </div>
    </div>
  );
}
