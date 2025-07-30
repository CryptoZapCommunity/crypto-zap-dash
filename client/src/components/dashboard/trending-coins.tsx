import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/loading-skeleton';
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
    price: number;
    priceChange24h: number;
  }>;
  isGainers: boolean;
}

function CoinList({ title, icon, coins, isGainers }: CoinListProps) {

  return (
    <Card className="glassmorphism">
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
          coins.map((coin, index) => (
            <div
              key={coin.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
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
                  ${coin.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: coin.price > 1 ? 2 : 6,
                  })}
                </p>
                <p className={cn(
                  'text-xs font-medium',
                  isGainers ? 'text-green-500' : 'text-red-500'
                )}>
                  {isGainers ? '+' : ''}{coin.priceChange24h.toFixed(2)}%
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glassmorphism">
          <CardHeader>
            <Skeleton className="w-32 h-6" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="w-full h-16 rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="glassmorphism">
          <CardHeader>
            <Skeleton className="w-32 h-6" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="w-full h-16 rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!trendingCoins || (!trendingCoins.gainers && !trendingCoins.losers)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glassmorphism">
          <CardContent className="p-6">
            <p className="text-muted-foreground text-center">
              {t('common.noData')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
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
  );
}
