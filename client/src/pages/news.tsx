import { useNews } from '@/hooks/use-market-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { CryptoIcon } from '@/components/ui/crypto-icon';
import { Newspaper, Search, Filter, TrendingUp, TrendingDown, AlertTriangle, Globe, Clock, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { t } from '@/lib/i18n';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { normalizeNews } from '@/lib/api-utils';
import type { News } from '@/types';

interface NewsArticle extends News {
  description?: string;
  url?: string;
  tags?: string[];
  relatedAssets?: string[];
}

function NewsCard({ article }: { article: NewsArticle }) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-500 bg-green-500/10';
      case 'negative':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-yellow-500 bg-yellow-500/10';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-500 bg-red-500/10';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10';
      default:
        return 'text-blue-500 bg-blue-500/10';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch {
      return 'Unknown time';
    }
  };

  return (
    <Card className="glassmorphism hover:scale-105 transition-transform duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {article.category.toUpperCase()}
              </Badge>
              <Badge className={cn("text-xs", getSentimentColor(article.sentiment || ''))}>
                {article.sentiment || 'Neutral'}
              </Badge>
              <Badge className={cn("text-xs", getImpactColor(article.impact))}>
                <div className="flex items-center gap-1">
                  {getImpactIcon(article.impact)}
                  {article.impact}
                </div>
              </Badge>
            </div>
            <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
              {article.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-3">
          {article.description}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Newspaper className="w-4 h-4" />
              {article.source}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTimeAgo(article.publishedAt)}
            </span>
          </div>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{article.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {article.relatedAssets && article.relatedAssets.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Related:</span>
            <div className="flex gap-1">
              {article.relatedAssets.map((asset: string, index: number) => (
                <CryptoIcon key={index} symbol={asset} size="sm" />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" size="sm" asChild>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              Read More
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');

  // Fetch news data - usando hook personalizado
  const { 
    data: newsData, 
    isLoading, 
    error,
    refetch: refetchNews,
    clearCache: clearNewsCache
  } = useNews(undefined, 20);

  // Converter dados de notícias para NewsArticle (já estão normalizados pelo hook)
  const news: NewsArticle[] = (Array.isArray(newsData) ? newsData : []).map(newsItem => ({
    ...newsItem,
    description: newsItem.summary || undefined,
    url: newsItem.sourceUrl || undefined,
    tags: [newsItem.category, newsItem.impact, newsItem.sentiment]
      .filter((tag): tag is string => tag !== null && tag !== undefined) as string[],
    relatedAssets: []
  }));

  // Filter news based on search and filters
  const filteredNews = news.filter(article => {
    const matchesSearch = 
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags?.some(tag => tag?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSentiment = selectedSentiment === 'all' || article.sentiment === selectedSentiment;
    return matchesSearch && matchesCategory && matchesSentiment;
  });

  const categories = ['all', 'crypto', 'finance', 'tech', 'politics', 'economics'];
  const sentiments = ['all', 'positive', 'negative', 'neutral'];

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">
            {t('common.error')}
          </p>
          <p className="text-muted-foreground">
            Failed to load news data. Please try again later.
          </p>
          <button 
            onClick={() => refetchNews()}
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
            {t('pages.news.title') || 'Crypto News'}
          </h1>
          <p className="text-muted-foreground">
            {t('pages.news.subtitle') || 'Latest cryptocurrency and financial news'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchNews()}
            disabled={isLoading}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearNewsCache()}
          >
            Clear Cache
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder={t('common.search') || 'Search news...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sentiments.map(sentiment => (
                <SelectItem key={sentiment} value={sentiment}>
                  {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* News Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="glassmorphism">
              <CardHeader className="pb-4">
                <div className="space-y-2">
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="w-full h-6" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
                <div className="flex justify-between">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-20 h-8" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {!isLoading && filteredNews.length === 0 && (
        <div className="text-center py-12">
          <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {searchTerm ? 'No news found matching your search.' : 'No news available.'}
          </p>
        </div>
      )}
    </div>
  );
}