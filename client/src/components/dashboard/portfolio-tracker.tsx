import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { CryptoIcon } from '@/components/ui/crypto-icon';
import { t } from '@/lib/i18n';
import { Briefcase, Eye, Plus, TrendingUp, TrendingDown, MoreVertical, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface PortfolioAsset {
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

interface PortfolioTrackerProps {
  assets?: PortfolioAsset[];
  isLoading?: boolean;
}

export function PortfolioTracker({ assets: propAssets, isLoading: propIsLoading }: PortfolioTrackerProps) {
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (propAssets) {
        setAssets(propAssets);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch('/api/portfolio');
        if (response.ok) {
          const data = await response.json();
          setAssets(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to fetch portfolio');
          setAssets([]);
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        setAssets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [propAssets]);

  const displayIsLoading = propIsLoading !== undefined ? propIsLoading : isLoading;

  if (displayIsLoading) {
    return (
      <Card className="glassmorphism">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="w-32 h-6" />
              <Skeleton className="w-24 h-4" />
            </div>
            <Skeleton className="w-20 h-8 rounded-lg" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-24 rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!Array.isArray(assets) || assets.length === 0) {
    return (
      <Card className="glassmorphism">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                {t('dashboard.portfolioTracker') || 'Portfolio Tracker'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.portfolioTrackerSubtitle') || 'Track your crypto investments'}
              </p>
            </div>
            <Button size="sm" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Asset</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm mb-2">
              No assets in your portfolio
            </p>
            <p className="text-xs text-muted-foreground">
              Add your first crypto asset to start tracking
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glassmorphism">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
              {t('dashboard.portfolioTracker') || 'Portfolio Tracker'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.portfolioTrackerSubtitle') || 'Track your crypto investments'}
            </p>
          </div>
          <Button size="sm" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Asset</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {(Array.isArray(assets) ? assets : []).map((asset) => (
          <PortfolioAssetItem key={asset.id} asset={asset} />
        ))}
        
        <PortfolioSummary assets={assets} />
      </CardContent>
    </Card>
  );
}

function PortfolioAssetItem({ asset }: { asset: PortfolioAsset }) {
  const [isWatching, setIsWatching] = useState(asset.isWatching);
  
  const profitLoss = (asset.currentPrice - asset.avgPrice) * asset.amount;
  const profitLossPercent = ((asset.currentPrice - asset.avgPrice) / asset.avgPrice) * 100;
  
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatAmount = (amount: number, symbol: string) => {
    if (amount >= 1) {
      return `${amount.toFixed(2)} ${symbol}`;
    }
    return `${amount.toFixed(6)} ${symbol}`;
  };

  return (
    <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors border border-border/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <CryptoIcon symbol={asset.symbol} size="md" />
          <div>
            <h4 className="font-semibold text-foreground">{asset.name}</h4>
            <p className="text-sm text-muted-foreground">{asset.symbol.toUpperCase()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsWatching(!isWatching)}
            className={cn(
              'h-8 w-8 p-0',
              isWatching ? 'text-yellow-500' : 'text-muted-foreground'
            )}
          >
            <Star className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-xs text-muted-foreground">Amount</p>
          <p className="font-medium text-foreground">
            {formatAmount(asset.amount, asset.symbol)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Current Price</p>
          <p className="font-medium text-foreground">
            ${asset.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Avg Price</p>
          <p className="font-medium text-foreground">
            ${asset.avgPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Value</p>
          <p className="font-medium text-foreground">
            {formatValue(asset.value)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {profitLoss >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={cn(
            'text-sm font-medium',
            profitLoss >= 0 ? 'text-green-500' : 'text-red-500'
          )}>
            {profitLoss >= 0 ? '+' : ''}{profitLossPercent.toFixed(2)}%
          </span>
        </div>
        <div className="text-right">
          <p className={cn(
            'text-sm font-medium',
            profitLoss >= 0 ? 'text-green-500' : 'text-red-500'
          )}>
            {profitLoss >= 0 ? '+' : ''}{formatValue(Math.abs(profitLoss))}
          </p>
          <p className="text-xs text-muted-foreground">P&L</p>
        </div>
      </div>
    </div>
  );
}

function PortfolioSummary({ assets }: { assets: PortfolioAsset[] }) {
  const totalValue = (Array.isArray(assets) ? assets : []).reduce((sum, asset) => sum + asset.value, 0);
  const totalPnl = (Array.isArray(assets) ? assets : []).reduce((sum, asset) => {
    const pnl = (asset.currentPrice - asset.avgPrice) * asset.amount;
    return sum + pnl;
  }, 0);
  const totalPnlPercent = totalValue > 0 ? (totalPnl / (totalValue - totalPnl)) * 100 : 0;

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="pt-4 border-t border-border/50">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 rounded-lg bg-muted/30">
          <p className="text-xs text-muted-foreground">Total Value</p>
          <p className="text-lg font-semibold text-foreground">
            {formatValue(totalValue)}
          </p>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/30">
          <p className="text-xs text-muted-foreground">Total P&L</p>
          <p className={cn(
            'text-lg font-semibold',
            totalPnl >= 0 ? 'text-green-500' : 'text-red-500'
          )}>
            {totalPnl >= 0 ? '+' : ''}{formatValue(Math.abs(totalPnl))}
          </p>
          <p className={cn(
            'text-xs',
            totalPnl >= 0 ? 'text-green-500' : 'text-red-500'
          )}>
            {totalPnlPercent >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}