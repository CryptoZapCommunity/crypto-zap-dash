import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { CryptoIcon } from '@/components/ui/crypto-icon';
import { t } from '@/lib/i18n';
import { Bell, TrendingUp, TrendingDown, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface Alert {
  id: string;
  type: 'price_target' | 'volume_spike' | 'whale_movement' | 'news_sentiment' | 'technical_indicator';
  priority: 'low' | 'medium' | 'high' | 'critical';
  asset?: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  value?: string;
  change?: number;
}

interface AlertsPanelProps {
  alerts?: Alert[];
  isLoading?: boolean;
}

// Mock data for demonstration
const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'price_target',
    priority: 'high',
    asset: 'BTC',
    title: 'Bitcoin alcançou meta de preço',
    message: 'BTC subiu acima de $102,000, conforme configurado no seu alerta.',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    isRead: false,
    value: '$102,347',
    change: 3.2,
  },
  {
    id: '2',
    type: 'whale_movement',
    priority: 'critical',
    asset: 'ETH',
    title: 'Movimentação de Baleia Detectada',
    message: '15,000 ETH (≈$52M) transferidos para Binance.',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    isRead: false,
    value: '$52M',
  },
  {
    id: '3',
    type: 'volume_spike',
    priority: 'medium',
    asset: 'SOL',
    title: 'Pico de Volume Incomum',
    message: 'Solana registrou volume 340% acima da média em 1h.',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    isRead: true,
    change: 340,
  },
  {
    id: '4',
    type: 'news_sentiment',
    priority: 'low',
    title: 'Sentimento de Mercado Positivo',
    message: 'Análise de notícias indica 78% de sentimento positivo nas últimas 4h.',
    timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    isRead: true,
  },
  {
    id: '5',
    type: 'technical_indicator',
    priority: 'medium',
    asset: 'BTC',
    title: 'Sinal de Indicador Técnico',
    message: 'RSI do Bitcoin entrou em zona de sobrecompra (>70).',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    isRead: false,
  },
];

function AlertItem({ alert }: { alert: Alert }) {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'price_target':
        return <DollarSign className="w-4 h-4" />;
      case 'volume_spike':
        return <TrendingUp className="w-4 h-4" />;
      case 'whale_movement':
        return <AlertTriangle className="w-4 h-4" />;
      case 'news_sentiment':
        return <Bell className="w-4 h-4" />;
      case 'technical_indicator':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'low':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Agora';
      if (diffInMinutes < 60) return `${diffInMinutes}min`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
      return `${Math.floor(diffInMinutes / 1440)}d`;
    } catch {
      return 'Recente';
    }
  };

  return (
    <div className={cn(
      'p-3 rounded-lg transition-colors cursor-pointer border',
      alert.isRead 
        ? 'bg-muted/30 hover:bg-muted/50 border-border/50' 
        : 'bg-accent/50 hover:bg-accent/70 border-accent/70'
    )}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          {alert.asset && <CryptoIcon symbol={alert.asset} size="sm" />}
          <div className={cn(
            'p-1 rounded-full',
            getPriorityColor(alert.priority)
          )}>
            {getAlertIcon(alert.type)}
          </div>
          <Badge
            variant="outline"
            className={cn('text-xs px-2 py-1', getPriorityColor(alert.priority))}
          >
            {alert.priority.toUpperCase()}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(alert.timestamp)}
          </span>
          {!alert.isRead && (
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          )}
        </div>
      </div>
      
      <div className="space-y-1">
        <h4 className="font-medium text-sm text-foreground">
          {alert.title}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {alert.message}
        </p>
        
        {(alert.value || alert.change !== undefined) && (
          <div className="flex items-center space-x-2 mt-2">
            {alert.value && (
              <span className="text-xs font-medium text-foreground bg-muted px-2 py-1 rounded">
                {alert.value}
              </span>
            )}
            {alert.change !== undefined && (
              <span className={cn(
                'text-xs font-medium px-2 py-1 rounded',
                alert.change >= 0 ? 'text-green-600 bg-green-500/20' : 'text-red-600 bg-red-500/20'
              )}>
                {alert.change >= 0 ? '+' : ''}{alert.change}%
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function AlertsPanel({ alerts = mockAlerts, isLoading = false }: AlertsPanelProps) {
  if (isLoading) {
    return (
      <Card className="glassmorphism">
        <CardHeader>
          <Skeleton className="w-36 h-6" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <Skeleton className="w-16 h-5 rounded-full" />
                </div>
                <Skeleton className="w-12 h-3" />
              </div>
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-3" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const unreadCount = (Array.isArray(alerts) ? alerts : []).filter(alert => !alert.isRead).length;
  const criticalAlerts = (Array.isArray(alerts) ? alerts : []).filter(alert => alert.priority === 'critical');

  return (
    <Card className="glassmorphism">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-500" />
            Alertas de Mercado
          </div>
          <div className="flex items-center space-x-2">
            {(Array.isArray(criticalAlerts) ? criticalAlerts : []).length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {criticalAlerts.length} Crítico{criticalAlerts.length > 1 ? 's' : ''}
              </Badge>
            )}
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} Novo{unreadCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {(Array.isArray(alerts) ? alerts : []).length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhum alerta ativo no momento
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Suas configurações de alerta estão funcionando normalmente
            </p>
          </div>
        ) : (
          (Array.isArray(alerts) ? alerts : [])
            .sort((a, b) => {
              // Sort by read status (unread first), then by priority, then by timestamp
              if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
              
              const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
              const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
              if (priorityDiff !== 0) return priorityDiff;
              
              return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            })
            .map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))
        )}
        
        {(Array.isArray(alerts) ? alerts : []).length > 0 && (
          <div className="pt-3 border-t border-border/50">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Marcar todos como lidos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}