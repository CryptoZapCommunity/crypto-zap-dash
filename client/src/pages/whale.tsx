import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
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

  // Fetch whale transactions
  const { data: whaleTransactions, isLoading, error } = useQuery({
    queryKey: ['/api/whale-movements'],
    queryFn: () => apiClient.getWhaleMovements(100),
    refetchInterval: false, // WebSocket handles updates
    staleTime: 10 * 60 * 1000, // 10 minutes (increased)
  });

  const transactions: WhaleTransaction[] = (whaleTransactions as WhaleTransaction[]) || [];

  // Filter transactions
  const filteredTransactions = transactions
    .filter(tx => {
      // Search filter
      const matchesSearch = 
        tx.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.fromAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.toAddress?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Type filter
      const matchesType = filterType === 'all' || tx.type === filterType;
      
      // Amount filter
      const matchesAmount = !minAmount || parseFloat(tx.valueUsd || '0') >= parseFloat(minAmount);
      
      // Asset filter
      const matchesAsset = selectedAsset === 'all' || tx.asset.toLowerCase() === selectedAsset.toLowerCase();
      
      return matchesSearch && matchesType && matchesAmount && matchesAsset;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Get unique assets for filter
  const uniqueAssets = Array.from(new Set((Array.isArray(transactions) ? transactions : []).map(tx => tx.asset)));

  // Calculate statistics
  const totalValue = filteredTransactions.reduce((sum, tx) => sum + parseFloat(tx.valueUsd || '0'), 0);
  const inflowValue = filteredTransactions
    .filter(tx => tx.type === 'inflow')
    .reduce((sum, tx) => sum + parseFloat(tx.valueUsd || '0'), 0);
  const outflowValue = filteredTransactions
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
        return 'text-muted-foreground bg-muted';
    }
  };

  const formatAddress = (address: string | null) => {
    if (!address || typeof address !== 'string') return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const txDate = new Date(timestamp);
    const diff = now.getTime() - txDate.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
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
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Whale Tracker</h1>
          <p className="text-muted-foreground">
            Monitor large cryptocurrency transactions and whale movements
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Fish className="w-4 h-4" />
              Total Value Tracked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(typeof totalValue === 'number' ? (totalValue / 1e6).toFixed(2) : '0.00')}M
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredTransactions.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Inflow Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              ${(typeof inflowValue === 'number' ? (inflowValue / 1e6).toFixed(2) : '0.00')}M
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredTransactions.filter(tx => tx.type === 'inflow').length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              Outflow Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              ${(typeof outflowValue === 'number' ? (outflowValue / 1e6).toFixed(2) : '0.00')}M
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredTransactions.filter(tx => tx.type === 'outflow').length} transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search addresses or assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="inflow">Inflow</SelectItem>
                <SelectItem value="outflow">Outflow</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Min amount (USD)"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              type="number"
            />
            
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assets</SelectItem>
                {(Array.isArray(uniqueAssets) ? uniqueAssets : []).map(asset => (
                  <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Whale Transactions</h2>
          <Badge variant="secondary">
            {filteredTransactions.length} transactions
          </Badge>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-5 w-20 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {(Array.isArray(filteredTransactions) ? filteredTransactions : []).map((tx) => (
              <Card key={tx.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-green-500 rounded-full flex items-center justify-center">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{tx.asset}</span>
                          <Badge className={getTransactionColor(tx.type)}>
                            {tx.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center space-x-2">
                            <span>From: {formatAddress(tx.fromAddress)}</span>
                            {tx.fromExchange && (
                              <Badge variant="outline" className="text-xs">
                                {tx.fromExchange}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>To: {formatAddress(tx.toAddress)}</span>
                            {tx.toExchange && (
                              <Badge variant="outline" className="text-xs">
                                {tx.toExchange}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-lg font-bold">
                          ${parseFloat(tx.valueUsd || '0').toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {parseFloat(tx.amount).toLocaleString()} {tx.asset}
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(tx.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {tx.transactionHash && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Hash: {(typeof tx.transactionHash === 'string' ? tx.transactionHash.slice(0, 20) : 'Unknown')}...
                        </span>
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredTransactions.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Fish className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No whale transactions found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Alerts */}
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                Whale Activity Alert
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Large transactions can significantly impact market prices. Monitor these movements carefully 
                and consider their potential impact on your investment strategy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 