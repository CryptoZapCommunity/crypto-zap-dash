import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { t } from '@/lib/i18n';
import { COUNTRY_FLAGS } from '@/types';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns';
import type { EconomicEvent } from '@/types';

interface EconomicCalendarProps {
  events: EconomicEvent[];
  isLoading: boolean;
}

function EconomicEventItem({ event }: { event: EconomicEvent }) {
  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'border-red-500 bg-red-500/10 text-red-600';
      case 'medium':
        return 'border-yellow-500 bg-yellow-500/10 text-yellow-600';
      case 'low':
        return 'border-blue-500 bg-blue-500/10 text-blue-600';
      default:
        return 'border-gray-500 bg-gray-500/10 text-gray-600';
    }
  };

  const getCountryFlag = (country: string) => {
    return COUNTRY_FLAGS[country.toUpperCase()] || '🌐';
  };

  const formatEventTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isToday(date)) {
        return `Today, ${format(date, 'HH:mm')}`;
      } else if (isTomorrow(date)) {
        return `Tomorrow, ${format(date, 'HH:mm')}`;
      } else {
        return format(date, 'MMM dd, HH:mm');
      }
    } catch {
      return 'TBD';
    }
  };

  const getImpactText = (impact: string) => {
    const translations = {
      high: t('impact.high'),
      medium: t('impact.medium'),
      low: t('impact.low'),
    };
    return translations[impact.toLowerCase() as keyof typeof translations] || impact;
  };

  const getBorderColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'border-red-500';
      case 'medium':
        return 'border-yellow-500';
      case 'low':
        return 'border-blue-500';
      default:
        return 'border-gray-500';
    }
  };

  return (
    <div className={cn(
      'flex items-center justify-between p-3 rounded-lg bg-muted/50 border-l-4 transition-colors hover:bg-muted',
      getBorderColor(event.impact)
    )}>
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <span className="text-lg flex-shrink-0">
          {getCountryFlag(event.country)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground text-sm truncate">
            {event.title}
          </p>
          <p className="text-xs text-muted-foreground flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {formatEventTime(event.eventDate)}
          </p>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-3">
        {(event.forecast || event.previous) && (
          <div className="flex items-center space-x-2 mb-1">
            {event.forecast && (
              <>
                <span className="text-xs text-muted-foreground">{t('market.forecast')}:</span>
                <span className="text-xs font-medium text-foreground">{event.forecast}</span>
              </>
            )}
            {event.previous && (
              <>
                <span className="text-xs text-muted-foreground">{t('market.prev')}:</span>
                <span className="text-xs font-medium text-foreground">{event.previous}</span>
              </>
            )}
          </div>
        )}
        <Badge
          variant="outline"
          className={cn('text-xs px-2 py-1 rounded-full', getImpactColor(event.impact))}
        >
          {getImpactText(event.impact)}
        </Badge>
      </div>
    </div>
  );
}

export function EconomicCalendar({ events, isLoading }: EconomicCalendarProps) {
  if (isLoading) {
    return (
      <Card className="glassmorphism">
        <CardHeader>
          <Skeleton className="w-40 h-6" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border-l-4 border-gray-300">
              <div className="flex items-center space-x-3 flex-1">
                <Skeleton className="w-6 h-6 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="w-3/4 h-4" />
                  <Skeleton className="w-1/2 h-3" />
                </div>
              </div>
              <div className="text-right space-y-2">
                <Skeleton className="w-16 h-3" />
                <Skeleton className="w-12 h-5 rounded-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Sort events by date, showing upcoming events first
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
  );

  return (
    <Card className="glassmorphism">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          {t('dashboard.economicCalendar')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              No upcoming economic events
            </p>
          </div>
        ) : (
          (Array.isArray(sortedEvents) ? sortedEvents : []).slice(0, 5).map((event) => (
            <EconomicEventItem key={event.id} event={event} />
          ))
        )}
      </CardContent>
    </Card>
  );
}
