import { useState } from 'react';
import { useWhaleTransactions } from '@/hooks/use-market-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Fish, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft,
  ArrowLeftRight,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  DollarSign,
  Clock,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';
import type { WhaleTransaction } from '@/types';

export default function WhaleTracker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'inflow' | 'outflow' | 'transfer'>('all');
  const [minAmount, setMinAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('all');

  // Fetch whale transactions - usando hook personalizado
  const { 
    data: whaleTransactions, 
    isLoading, 
    error,
    refetch: refetchWhale,
    clearCache: clearWhaleCache
  } = useWhaleTransactions(100);

  const transactions: WhaleTransaction[] = (whaleTransactions as any)?.data || [];

  // Filter transactions
  const filteredTransactions = (Array.isArray(transactions) ? transactions : [])
    .filter(tx => {
      // Search filter
      const matchesSearch = 
        tx.asset?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.fromAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.toAddress?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Type filter
      const matchesType = filterType === 'all' || tx.type === filterType;
      
      // Amount filter
      const matchesAmount = !minAmount || parseFloat(tx.valueUsd || '0') >= parseFloat(minAmount);
      
      // Asset filter
              const matchesAsset = selectedAsset === 'all' || tx.asset?.toLowerCase() === selectedAsset.toLowerCase();
      
      return matchesSearch && matchesType && matchesAmount && matchesAsset;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Get unique assets for filter
  const uniqueAssets = Array.from(new Set((Array.isArray(transactions) ? transactions : []).map(tx => tx.asset)));

  // Calculate statistics
  const totalValue = filteredTransactions.reduce((sum, tx) => sum + parseFloat(tx.valueUsd || '0'), 0);
  const inflowValue = (Array.isArray(filteredTransactions) ? filteredTransactions : [])
    .filter(tx => tx.type === 'inflow')
    .reduce((sum, tx) => sum + parseFloat(tx.valueUsd || '0'), 0);
  const outflowValue = (Array.isArray(filteredTransactions) ? filteredTransactions : [])
    .filter(tx => tx.type === 'outflow')
    .reduce((sum, tx) => sum + parseFloat(tx.valueUsd || '0'), 0);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'inflow':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case 'outflow':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'transfer':
        return <ArrowLeftRight className="w-4 h-4 text-blue-500" />;
      default:
        return <ArrowLeftRight className="w-4 h-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'inflow':
        return 'text-green-500 bg-green-500/10';
      case 'outflow':
        return 'text-red-500 bg-red-500/10';
      case 'transfer':
        return 'text-blue-500 bg-blue-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const formatAddress = (address: string | null) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const txTime = new Date(timestamp);
    const diffMs = now.getTime() - txTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">
            {t('common.error')}
          </p>
          <p className="text-muted-foreground">
            Failed to load whale transaction data. Please try again later.
          </p>
          <button 
            onClick={() => refetchWhale()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('pages.whale.title') || 'Whale Tracker'}
          </h1>
          <p className="text-muted-foreground">
            {t('pages.whale.subtitle') || 'Track large cryptocurrency transactions'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchWhale()}
            disabled={isLoading}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearWhaleCache()}
          >
            Clear Cache
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glassmorphism">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-lg font-semibold">
                  ${(totalValue / 1e6).toFixed(2)}M
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glassmorphism">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inflow</p>
                <p className="text-lg font-semibold text-green-500">
                  ${(inflowValue / 1e6).toFixed(2)}M
                </p>
              </div>
              <ArrowDownLeft className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glassmorphism">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outflow</p>
                <p className="text-lg font-semibold text-red-500">
                  ${(outflowValue / 1e6).toFixed(2)}M
                </p>
              </div>
              <ArrowUpRight className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glassmorphism">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-lg font-semibold">
                  {filteredTransactions.length}
                </p>
              </div>
              <Fish className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder={t('common.search') || 'Search transactions...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="inflow">Inflow</SelectItem>
              <SelectItem value="outflow">Outflow</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedAsset} onValueChange={setSelectedAsset}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assets</SelectItem>
              {uniqueAssets.map(asset => (
                <SelectItem key={asset} value={asset}>
                  {asset}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Min $"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="w-24"
          />
        </div>
      </div>

      {/* Transactions */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="glassmorphism">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="w-32 h-4" />
                      <Skeleton className="w-24 h-3" />
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-16 h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((tx) => (
            <Card key={tx.id} className="glassmorphism hover:scale-105 transition-transform duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-foreground">{tx.asset}</h3>
                        <Badge className={cn("text-xs", getTransactionColor(tx.type))}>
                          {tx.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatAddress(tx.fromAddress)} → {formatAddress(tx.toAddress)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(tx.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {parseFloat(tx.amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 8,
                      })} {tx.asset}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${parseFloat(tx.valueUsd || '0').toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
                
                {tx.transactionHash && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Transaction Hash:</p>
                      <Button variant="ghost" size="sm" asChild>
                        <a 
                          href={`https://etherscan.io/tx/${tx.transactionHash}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:text-blue-600"
                        >
                          {formatAddress(tx.transactionHash)}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <Fish className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {searchTerm ? 'No whale transactions found matching your search.' : 'No whale transactions available.'}
          </p>
        </div>
      )}
    </div>
  );
} 