import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { CryptoIcon } from '@/components/ui/crypto-icon';
import { t } from '@/lib/i18n';
import { Bell, TrendingUp, TrendingDown, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

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

export function AlertsPanel({ alerts: propAlerts, isLoading: propIsLoading }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (propAlerts) {
        setAlerts(propAlerts);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch('/api/alerts?limit=20');
        if (response.ok) {
          const data = await response.json();
          setAlerts(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to fetch alerts');
          setAlerts([]);
        }
      } catch (error) {
        console.error('Error fetching alerts:', error);
        setAlerts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, [propAlerts]);

  const handleMarkAsRead = async (alertId: string) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}/read`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        setAlerts(prev => 
          prev.map(alert => 
            alert.id === alertId ? { ...alert, isRead: true } : alert
          )
        );
      }
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadAlerts = alerts.filter(alert => !alert.isRead);
      await Promise.all(
        unreadAlerts.map(alert => 
          fetch(`/api/alerts/${alert.id}/read`, { method: 'PUT' })
        )
      );
      
      setAlerts(prev => 
        prev.map(alert => ({ ...alert, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all alerts as read:', error);
    }
  };

  const displayIsLoading = propIsLoading !== undefined ? propIsLoading : isLoading;

  if (displayIsLoading) {
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
            {t('alerts.title')}
          </div>
          <div className="flex items-center space-x-2">
            {(Array.isArray(criticalAlerts) ? criticalAlerts : []).length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {criticalAlerts.length} {criticalAlerts.length > 1 ? t('alerts.criticals') : t('alerts.critical')}
              </Badge>
            )}
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} {unreadCount > 1 ? t('alerts.news') : t('alerts.new')}
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
              {t('alerts.noAlerts')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('alerts.noAlertsSubtitle')}
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
              <AlertItem 
                key={alert.id} 
                alert={alert} 
                onMarkAsRead={handleMarkAsRead}
              />
            ))
        )}
        
        {(Array.isArray(alerts) ? alerts : []).length > 0 && (
          <div className="pt-3 border-t border-border/50">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs"
              onClick={handleMarkAllAsRead}
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              {t('alerts.markAllRead')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AlertItem({ alert, onMarkAsRead }: { alert: Alert; onMarkAsRead: (id: string) => void }) {
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
      
      if (diffInMinutes < 1) return t('alerts.now');
      if (diffInMinutes < 60) return `${diffInMinutes}min`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
      return `${Math.floor(diffInMinutes / 1440)}d`;
    } catch {
      return t('alerts.recent');
    }
  };

  return (
    <div 
      className={cn(
        'p-3 rounded-lg transition-colors cursor-pointer border',
        alert.isRead 
          ? 'bg-gray-100/30 dark:bg-gray-800/30 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 border-border/50' 
          : 'bg-accent/50 hover:bg-accent/70 border-accent/70'
      )}
      onClick={() => !alert.isRead && onMarkAsRead(alert.id)}
    >
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