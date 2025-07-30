import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { CryptoIcon } from '@/components/ui/crypto-icon';
import { t } from '@/lib/i18n';
import { Briefcase, Eye, Plus, TrendingUp, TrendingDown, MoreVertical, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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

// Mock data for demonstration
const mockAssets: PortfolioAsset[] = [
  {
    id: '1',
    symbol: 'BTC',
    name: 'Bitcoin',
    amount: 0.25,
    avgPrice: 95000,
    currentPrice: 102347,
    value: 25586.75,
    change24h: 3.2,
    isWatching: true,
  },
  {
    id: '2',
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 5.5,
    avgPrice: 3200,
    currentPrice: 3456,
    value: 19008,
    change24h: -1.8,
    isWatching: true,
  },
  {
    id: '3',
    symbol: 'SOL',
    name: 'Solana',
    amount: 100,
    avgPrice: 180,
    currentPrice: 198.45,
    value: 19845,
    change24h: 5.4,
    isWatching: true,
  },
  {
    id: '4',
    symbol: 'AVAX',
    name: 'Avalanche',
    amount: 50,
    avgPrice: 35,
    currentPrice: 41.23,
    value: 2061.5,
    change24h: 2.1,
    isWatching: false,
  },
];

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
          <CryptoIcon symbol={asset.symbol} size="sm" />
          <div>
            <h4 className="font-medium text-sm text-foreground">{asset.name}</h4>
            <p className="text-xs text-muted-foreground">
              {formatAmount(asset.amount, asset.symbol)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsWatching(!isWatching)}
          >
            <Star className={cn('w-3 h-3', isWatching ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground')} />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreVertical className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-muted-foreground">Valor Atual</p>
          <p className="font-medium text-foreground">{formatValue(asset.value)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Preço Médio</p>
          <p className="font-medium text-foreground">{formatValue(asset.avgPrice)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">P&L</p>
          <div className="flex items-center space-x-1">
            {profitLoss >= 0 ? (
              <TrendingUp className="w-3 h-3 text-green-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500" />
            )}
            <span className={cn('font-medium', profitLoss >= 0 ? 'text-green-500' : 'text-red-500')}>
              {formatValue(Math.abs(profitLoss))}
            </span>
          </div>
        </div>
        <div>
          <p className="text-muted-foreground">24h</p>
          <span className={cn(
            'font-medium text-xs px-2 py-1 rounded',
            asset.change24h >= 0 ? 'text-green-600 bg-green-500/20' : 'text-red-600 bg-red-500/20'
          )}>
            {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Performance: 
          </span>
          <span className={cn(
            'text-xs font-medium px-2 py-1 rounded',
            profitLossPercent >= 0 ? 'text-green-600 bg-green-500/20' : 'text-red-600 bg-red-500/20'
          )}>
            {profitLossPercent >= 0 ? '+' : ''}{profitLossPercent.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}

function PortfolioSummary({ assets }: { assets: PortfolioAsset[] }) {
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalProfitLoss = assets.reduce((sum, asset) => {
    return sum + ((asset.currentPrice - asset.avgPrice) * asset.amount);
  }, 0);
  const totalInvested = assets.reduce((sum, asset) => sum + (asset.avgPrice * asset.amount), 0);
  const totalReturn = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
        <div className="flex items-center space-x-2 mb-1">
          <Briefcase className="w-4 h-4 text-blue-500" />
          <span className="text-xs text-muted-foreground">Valor Total</span>
        </div>
        <p className="text-lg font-bold text-foreground">{formatValue(totalValue)}</p>
      </div>

      <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30">
        <div className="flex items-center space-x-2 mb-1">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-xs text-muted-foreground">P&L Total</span>
        </div>
        <p className={cn('text-lg font-bold', totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500')}>
          {totalProfitLoss >= 0 ? '+' : ''}{formatValue(totalProfitLoss)}
        </p>
      </div>

      <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
        <div className="flex items-center space-x-2 mb-1">
          <Eye className="w-4 h-4 text-orange-500" />
          <span className="text-xs text-muted-foreground">Investido</span>
        </div>
        <p className="text-lg font-bold text-foreground">{formatValue(totalInvested)}</p>
      </div>

      <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
        <div className="flex items-center space-x-2 mb-1">
          <TrendingUp className="w-4 h-4 text-purple-500" />
          <span className="text-xs text-muted-foreground">Retorno</span>
        </div>
        <p className={cn('text-lg font-bold', totalReturn >= 0 ? 'text-green-500' : 'text-red-500')}>
          {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}

export function PortfolioTracker({ assets = mockAssets, isLoading = false }: PortfolioTrackerProps) {
  const [filter, setFilter] = useState<'all' | 'watching'>('all');
  
  if (isLoading) {
    return (
      <Card className="glassmorphism">
        <CardHeader>
          <Skeleton className="w-32 h-6" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/50">
                <Skeleton className="w-16 h-4 mb-2" />
                <Skeleton className="w-20 h-6" />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-20 h-4" />
                  </div>
                  <Skeleton className="w-8 h-4" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="w-16 h-3" />
                  <Skeleton className="w-16 h-3" />
                  <Skeleton className="w-16 h-3" />
                  <Skeleton className="w-16 h-3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredAssets = filter === 'watching' ? assets.filter(asset => asset.isWatching) : assets;

  return (
    <Card className="glassmorphism">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center justify-between">
          <div className="flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
            Meu Portfolio
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="text-xs"
            >
              Todos ({assets.length})
            </Button>
            <Button
              variant={filter === 'watching' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('watching')}
              className="text-xs"
            >
              <Star className="w-3 h-3 mr-1" />
              Favoritos ({assets.filter(a => a.isWatching).length})
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Plus className="w-3 h-3 mr-1" />
              Adicionar
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Portfolio Summary */}
        <PortfolioSummary assets={assets} />

        {/* Assets List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {filter === 'watching' ? 'Nenhum ativo favoritado' : 'Nenhum ativo no portfolio'}
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                <Plus className="w-3 h-3 mr-1" />
                Adicionar Primeiro Ativo
              </Button>
            </div>
          ) : (
            filteredAssets.map((asset) => (
              <PortfolioAssetItem key={asset.id} asset={asset} />
            ))
          )}
        </div>

        {/* Footer Actions */}
        {filteredAssets.length > 0 && (
          <div className="pt-4 border-t border-border/50 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {filteredAssets.length} ativo{filteredAssets.length > 1 ? 's' : ''} exibido{filteredAssets.length > 1 ? 's' : ''}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-xs">
                Exportar
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Configurar Alertas
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}