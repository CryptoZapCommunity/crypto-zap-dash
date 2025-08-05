import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NewsSkeleton } from '@/components/ui/loading-skeleton';
import { t } from '@/lib/i18n';
import { COUNTRY_FLAGS } from '@/types';
import { Newspaper, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import type { News } from '@/types';

interface NewsSectionProps {
  news: News[];
  isLoading: boolean;
}

function NewsItem({ article }: { article: News }) {
  const getImpactColor = (impact: string) => {
    switch (impact?.toLowerCase()) {
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

  const getSentimentColor = (sentiment: string | null) => {
    if (!sentiment) return '';
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
      default:
        return '';
    }
  };

  const getCountryFlag = (country: string | null) => {
    if (!country) return '🌐';
    return COUNTRY_FLAGS[country.toUpperCase()] || '🌐';
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const getImpactText = (impact: string) => {
    const translations = {
      high: t('impact.high'),
      medium: t('impact.medium'),
      low: t('impact.low'),
    };
    return translations[impact?.toLowerCase() as keyof typeof translations] || impact;
  };

  return (
    <div className="border-l-4 border-primary pl-4 py-3 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors rounded-r-lg table-row-hover">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 text-lg">
          {getCountryFlag(article.country)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground text-sm mb-1 line-clamp-2">
            {article.title}
          </h4>
          {article.summary && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {article.summary}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(article.publishedAt)}
              </span>
              {article.source && (
                <span className="text-xs text-muted-foreground">
                  • {article.source}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className={cn('text-xs px-2 py-1 rounded-full', getImpactColor(article.impact))}
              >
                {getImpactText(article.impact)}
              </Badge>
              {article.sourceUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => window.open(article.sourceUrl!, '_blank')}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NewsSection({ news, isLoading }: NewsSectionProps) {
  if (isLoading) {
    return (
      <Card className="glassmorphism">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Newspaper className="w-5 h-5" />
              <div className="w-32 h-6 bg-muted rounded" />
            </div>
            <div className="w-16 h-4 bg-muted rounded" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <NewsSkeleton />
          <NewsSkeleton />
          <NewsSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glassmorphism card-hover">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center">
            <Newspaper className="w-5 h-5 mr-2" />
            {t('dashboard.latestNews')}
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-sm text-primary hover:underline">
            {t('common.viewAll')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {news.length === 0 ? (
          <div className="text-center py-8">
            <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              No recent news available
            </p>
          </div>
        ) : (
          (Array.isArray(news) ? news : []).slice(0, 5).map((article) => (
            <NewsItem key={article.id} article={article} />
          ))
        )}
      </CardContent>
    </Card>
  );
}
