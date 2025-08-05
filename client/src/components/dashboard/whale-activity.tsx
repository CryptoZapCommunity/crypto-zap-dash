import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { CryptoIcon } from '@/components/ui/crypto-icon';
import { t } from '@/lib/i18n';
import { Fish, ExternalLink, ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import type { WhaleTransaction } from '@/types';

interface WhaleActivityProps {
  whaleTransactions: WhaleTransaction[];
  isLoading: boolean;
}

function WhaleTransactionItem({ transaction }: { transaction: WhaleTransaction }) {

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'inflow':
        return <ArrowDownLeft className="w-3 h-3" />;
      case 'outflow':
        return <ArrowUpRight className="w-3 h-3" />;
      case 'transfer':
        return <ArrowLeftRight className="w-3 h-3" />;
      default:
        return <ArrowLeftRight className="w-3 h-3" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'inflow':
        return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'outflow':
        return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'transfer':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getTypeText = (type: string) => {
    const translations = {
      inflow: t('whale.inflow'),
      outflow: t('whale.outflow'),
      transfer: t('whale.transfer'),
    };
    return translations[type?.toLowerCase() as keyof typeof translations] || type;
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      
      if (diffInMinutes < 60) {
        return `${diffInMinutes} ${t('whale.minutes')}`;
      } else if (diffInMinutes < 1440) {
        return `${Math.floor(diffInMinutes / 60)} ${t('whale.hours')}`;
      } else {
        return `${Math.floor(diffInMinutes / 1440)} ${t('whale.days')}`;
      }
    } catch {
      return 'Recently';
    }
  };

  const formatAmount = (amount: string, asset: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return `0 ${asset}`;
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M ${asset}`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K ${asset}`;
    } else {
      return `${num.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${asset}`;
    }
  };

  const formatValue = (valueUsd: string | null) => {
    if (!valueUsd) return null;
    const num = parseFloat(valueUsd);
    if (isNaN(num)) return '$0';
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    } else {
      return `$${num.toLocaleString()}`;
    }
  };

  const getTransactionDescription = () => {
    if (transaction.fromExchange && transaction.toExchange) {
      return `${transaction.fromExchange} → ${transaction.toExchange}`;
    } else if (transaction.fromExchange) {
      return `${transaction.fromExchange} → Wallet`;
    } else if (transaction.toExchange) {
      return `Wallet → ${transaction.toExchange}`;
    } else {
      return 'Wallet → Wallet';
    }
  };

  const openTransaction = () => {
    if (transaction.transactionHash) {
      // This would open a blockchain explorer - for now just log
      if (import.meta.env.DEV) {
      console.log('Opening transaction:', transaction.transactionHash);
    }
    }
  };

  return (
    <div className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <CryptoIcon symbol={transaction.asset} size="sm" />
          <span className="font-medium text-foreground text-sm">
            {formatAmount(transaction.amount, transaction.asset)}
          </span>
          <Badge
            variant="outline"
            className={cn('text-xs px-2 py-1 rounded-full flex items-center space-x-1', getTypeColor(transaction.type))}
          >
            {getTypeIcon(transaction.type)}
            <span>{getTypeText(transaction.type)}</span>
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(transaction.timestamp)}
          </span>
          {transaction.transactionHash && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={openTransaction}
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {getTransactionDescription()}
        </span>
        {transaction.valueUsd && (
          <span className="text-foreground font-medium">
            {formatValue(transaction.valueUsd)}
          </span>
        )}
      </div>
    </div>
  );
}

export function WhaleActivity({ whaleTransactions, isLoading }: WhaleActivityProps) {
  if (isLoading) {
    return (
      <Card className="glassmorphism">
        <CardHeader>
          <Skeleton className="w-36 h-6" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-16 h-5 rounded-full" />
                </div>
                <Skeleton className="w-12 h-3" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="w-32 h-3" />
                <Skeleton className="w-16 h-3" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Sort transactions by timestamp, newest first
  const sortedTransactions = [...whaleTransactions].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card className="glassmorphism">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center">
          <Fish className="w-5 h-5 mr-2" />
          {t('dashboard.whaleActivity')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedTransactions.length === 0 ? (
          <div className="text-center py-8">
            <Fish className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              No recent whale activity
            </p>
          </div>
        ) : (
          (Array.isArray(sortedTransactions) ? sortedTransactions : []).slice(0, 5).map((transaction) => (
            <WhaleTransactionItem key={transaction.id} transaction={transaction} />
          ))
        )}
      </CardContent>
    </Card>
  );
}
