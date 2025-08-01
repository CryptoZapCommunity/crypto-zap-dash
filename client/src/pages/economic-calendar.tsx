import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { Calendar, Clock, TrendingUp, TrendingDown, AlertTriangle, Globe, Filter, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isTomorrow, addDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

interface EconomicEvent {
  id: string;
  title: string;
  description: string;
  country: string;
  currency: string;
  datetime: string;
  impact: 'high' | 'medium' | 'low';
  category: 'central_bank' | 'employment' | 'inflation' | 'gdp' | 'trade' | 'other';
  previous?: string;
  forecast?: string;
  actual?: string;
  unit?: string;
}

// Mock data for demonstration
const mockEvents: EconomicEvent[] = [
  {
    id: '1',
    title: 'Taxa de Juros Fed',
    description: 'Decisão do Federal Reserve sobre a taxa básica de juros dos Estados Unidos',
    country: 'US',
    currency: 'USD',
    datetime: new Date().toISOString(),
    impact: 'high',
    category: 'central_bank',
    previous: '5.25%',
    forecast: '5.50%',
    unit: '%',
  },
  {
    id: '2',
    title: 'Índice de Preços ao Consumidor (CPI)',
    description: 'Medida da inflação baseada no custo de vida dos consumidores',
    country: 'US',
    currency: 'USD',
    datetime: new Date(Date.now() + 2 * 60 * 60000).toISOString(),
    impact: 'high',
    category: 'inflation',
    previous: '3.2%',
    forecast: '3.1%',
    actual: '3.0%',
    unit: '%',
  },
  {
    id: '3',
    title: 'Taxa de Desemprego',
    description: 'Percentual da força de trabalho que está desempregada',
    country: 'US',
    currency: 'USD',
    datetime: new Date(Date.now() + 24 * 60 * 60000).toISOString(),
    impact: 'medium',
    category: 'employment',
    previous: '3.8%',
    forecast: '3.7%',
    unit: '%',
  },
  {
    id: '4',
    title: 'PIB Trimestral',
    description: 'Crescimento do Produto Interno Bruto no trimestre',
    country: 'US',
    currency: 'USD',
    datetime: new Date(Date.now() + 48 * 60 * 60000).toISOString(),
    impact: 'high',
    category: 'gdp',
    previous: '2.1%',
    forecast: '2.3%',
    unit: '%',
  },
  {
    id: '5',
    title: 'Decisão do BCE',
    description: 'Banco Central Europeu anuncia decisão sobre política monetária',
    country: 'EU',
    currency: 'EUR',
    datetime: new Date(Date.now() + 72 * 60 * 60000).toISOString(),
    impact: 'high',
    category: 'central_bank',
    previous: '4.00%',
    forecast: '4.25%',
    unit: '%',
  },
];

function EventCard({ event }: { event: EconomicEvent }) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-green-500 bg-green-500/20 border-green-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'central_bank': return <TrendingUp className="w-4 h-4" />;
      case 'employment': return <Globe className="w-4 h-4" />;
      case 'inflation': return <AlertTriangle className="w-4 h-4" />;
      case 'gdp': return <TrendingDown className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'US': '🇺🇸',
      'EU': '🇪🇺',
      'GB': '🇬🇧',
      'JP': '🇯🇵',
      'CN': '🇨🇳',
      'CA': '🇨🇦',
      'AU': '🇦🇺',
    };
    return flags[country] || '🌍';
  };

  const formatTime = (datetime: string) => {
    try {
      return format(new Date(datetime), 'HH:mm', { locale: ptBR });
    } catch {
      return '--:--';
    }
  };

  const getActualColor = (actual?: string, forecast?: string) => {
    if (!actual || !forecast) return 'text-foreground';
    const actualVal = parseFloat(actual.replace('%', ''));
    const forecastVal = parseFloat(forecast.replace('%', ''));
    if (actualVal > forecastVal) return 'text-green-500';
    if (actualVal < forecastVal) return 'text-red-500';
    return 'text-foreground';
  };

  return (
    <Card className="glassmorphism hover:bg-accent/50 transition-colors cursor-pointer">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getCountryFlag(event.country)}</span>
                <Badge className={cn('text-xs', getImpactColor(event.impact))}>
                  {event.impact.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                {getCategoryIcon(event.category)}
                <span className="text-xs font-medium">{event.currency}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{formatTime(event.datetime)}</span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Data */}
          {(event.previous || event.forecast || event.actual) && (
            <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Anterior</p>
                <p className="font-semibold text-sm">
                  {event.previous || '--'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Previsão</p>
                <p className="font-semibold text-sm">
                  {event.forecast || '--'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Atual</p>
                <p className={cn('font-semibold text-sm', getActualColor(event.actual, event.forecast))}>
                  {event.actual || '--'}
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <Badge variant="outline" className="text-xs">
              {event.category.replace('_', ' ').toUpperCase()}
            </Badge>
            <Button variant="ghost" size="sm" className="text-xs">
              Ver Detalhes
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DaySection({ title, events, date }: { title: string; events: EconomicEvent[]; date: Date }) {
  const highImpactCount = (Array.isArray(events) ? events : []).filter(e => e.impact === 'high').length;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-bold">{title}</h2>
          <span className="text-sm text-muted-foreground">
            {format(date, 'dd/MM/yyyy', { locale: ptBR })}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">{events.length} eventos</span>
          {highImpactCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {highImpactCount} Alto Impacto
            </Badge>
          )}
        </div>
      </div>
      
      {events.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {(Array.isArray(events) ? events : []).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <Card className="glassmorphism">
          <CardContent className="py-8 text-center">
            <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Nenhum evento programado para este dia</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function EconomicCalendarPage() {
  const [selectedImpact, setSelectedImpact] = useState<string>('all');

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['/api/economic-calendar'],
    select: () => mockEvents,
  });

  const filteredEvents = (Array.isArray(eventsData) ? eventsData : []).filter(event => {
    return selectedImpact === 'all' || event.impact === selectedImpact;
  });

  // Group events by day
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const dayAfterTomorrow = addDays(today, 2);

  const todayEvents = (Array.isArray(filteredEvents) ? filteredEvents : []).filter(event => 
    isToday(new Date(event.datetime))
  );

  const tomorrowEvents = (Array.isArray(filteredEvents) ? filteredEvents : []).filter(event => 
    isTomorrow(new Date(event.datetime))
  );

  const laterEvents = (Array.isArray(filteredEvents) ? filteredEvents : []).filter(event => {
    const eventDate = new Date(event.datetime);
    return eventDate >= dayAfterTomorrow;
  });

  const impacts = [
    { value: 'all', label: 'Todos', color: 'text-foreground' },
    { value: 'high', label: 'Alto', color: 'text-red-500' },
    { value: 'medium', label: 'Médio', color: 'text-yellow-500' },
    { value: 'low', label: 'Baixo', color: 'text-green-500' },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-32 h-10" />
        </div>
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Calendário Econômico</h1>
          <p className="text-muted-foreground">Principais eventos econômicos que impactam os mercados</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Tabs value={selectedImpact} onValueChange={setSelectedImpact}>
            <TabsList>
              {(Array.isArray(impacts) ? impacts : []).map((impact) => (
                <TabsTrigger key={impact.value} value={impact.value} className={impact.color}>
                  {impact.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Events by Day */}
      <div className="space-y-8">
        <DaySection 
          title="Hoje" 
          events={todayEvents} 
          date={today}
        />
        
        <DaySection 
          title="Amanhã" 
          events={tomorrowEvents} 
          date={tomorrow}
        />
        
        <DaySection 
          title="Próximos Dias" 
          events={laterEvents} 
          date={dayAfterTomorrow}
        />
      </div>
    </div>
  );
}