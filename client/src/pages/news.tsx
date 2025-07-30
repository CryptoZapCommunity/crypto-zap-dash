import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { CryptoIcon } from '@/components/ui/crypto-icon';
import { Newspaper, Search, Filter, TrendingUp, TrendingDown, AlertTriangle, Globe, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  author?: string;
  publishedAt: string;
  url: string;
  category: 'crypto' | 'finance' | 'tech' | 'politics' | 'economics';
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  tags: string[];
  relatedAssets?: string[];
}

// Mock data for demonstration
const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Bitcoin atinge novo recorde histórico acima de $100,000',
    description: 'O Bitcoin ultrapassou a marca histórica dos $100,000 pela primeira vez, impulsionado pela crescente adoção institucional e expectativas de políticas favoráveis.',
    source: 'CoinDesk',
    author: 'Michael Chen',
    publishedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    url: '#',
    category: 'crypto',
    sentiment: 'positive',
    impact: 'high',
    tags: ['Bitcoin', 'ATH', 'Instituições'],
    relatedAssets: ['BTC'],
  },
  {
    id: '2',
    title: 'Ethereum se prepara para próxima atualização da rede',
    description: 'A próxima atualização do Ethereum promete melhorar significativamente a escalabilidade e reduzir as taxas de transação.',
    source: 'Ethereum Foundation',
    author: 'Vitalik Buterin',
    publishedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    url: '#',
    category: 'crypto',
    sentiment: 'positive',
    impact: 'medium',
    tags: ['Ethereum', 'Upgrade', 'Escalabilidade'],
    relatedAssets: ['ETH'],
  },
  {
    id: '3',
    title: 'Fed considera mudanças na política monetária',
    description: 'O Federal Reserve dos EUA sinaliza possíveis ajustes na política de juros em resposta aos dados econômicos recentes.',
    source: 'Reuters',
    author: 'Janet Miller',
    publishedAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    url: '#',
    category: 'economics',
    sentiment: 'neutral',
    impact: 'high',
    tags: ['Fed', 'Juros', 'Política Monetária'],
  },
  {
    id: '4',
    title: 'Nova regulamentação cripto aprovada na Europa',
    description: 'O Parlamento Europeu aprova nova legislação para regular criptomoedas, estabelecendo diretrizes claras para o mercado.',
    source: 'Financial Times',
    author: 'Sarah Connor',
    publishedAt: new Date(Date.now() - 4 * 60 * 60000).toISOString(),
    url: '#',
    category: 'politics',
    sentiment: 'neutral',
    impact: 'high',
    tags: ['Regulamentação', 'Europa', 'Criptomoedas'],
  },
  {
    id: '5',
    title: 'Tesla aumenta participação em Bitcoin',
    description: 'A Tesla anuncia aumento significativo em suas reservas de Bitcoin, consolidando sua estratégia de reserva de valor.',
    source: 'Bloomberg',
    author: 'David Kim',
    publishedAt: new Date(Date.now() - 6 * 60 * 60000).toISOString(),
    url: '#',
    category: 'finance',
    sentiment: 'positive',
    impact: 'medium',
    tags: ['Tesla', 'Bitcoin', 'Empresas'],
    relatedAssets: ['BTC'],
  },
];

function NewsCard({ article }: { article: NewsArticle }) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500 bg-green-500/20';
      case 'negative': return 'text-red-500 bg-red-500/20';
      default: return 'text-yellow-500 bg-yellow-500/20';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <TrendingUp className="w-4 h-4" />;
      default: return <TrendingDown className="w-4 h-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch {
      return 'Recente';
    }
  };

  return (
    <Card className="glassmorphism hover:bg-accent/50 transition-colors cursor-pointer">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {article.category.toUpperCase()}
              </Badge>
              <Badge className={cn('text-xs', getSentimentColor(article.sentiment))}>
                {article.sentiment.toUpperCase()}
              </Badge>
              <div className={cn('flex items-center space-x-1', getImpactColor(article.impact))}>
                {getImpactIcon(article.impact)}
                <span className="text-xs font-medium">{article.impact.toUpperCase()}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(article.publishedAt)}</span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors">
              {article.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {article.description}
            </p>
          </div>

          {/* Related Assets */}
          {article.relatedAssets && article.relatedAssets.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Ativos relacionados:</span>
              <div className="flex items-center space-x-1">
                {article.relatedAssets.map((asset) => (
                  <div key={asset} className="flex items-center space-x-1 px-2 py-1 rounded-full bg-muted/50">
                    <CryptoIcon symbol={asset} size="sm" />
                    <span className="text-xs font-medium">{asset}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{article.source}</span>
              {article.author && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{article.author}</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-1">
              {article.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: newsData, isLoading } = useQuery({
    queryKey: ['/api/news'],
    select: () => mockNews,
  });

  const filteredNews = newsData?.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'Todas', icon: Newspaper },
    { value: 'crypto', label: 'Crypto', icon: TrendingUp },
    { value: 'finance', label: 'Finanças', icon: TrendingDown },
    { value: 'economics', label: 'Economia', icon: Globe },
    { value: 'politics', label: 'Política', icon: AlertTriangle },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-64 h-10" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="w-full h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Notícias do Mercado</h1>
          <p className="text-muted-foreground">Últimas notícias e análises do mercado financeiro</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar notícias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger key={category.value} value={category.value} className="flex items-center space-x-2">
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{category.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* News Grid */}
      <div className="space-y-6">
        {filteredNews && filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredNews.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <Card className="glassmorphism">
            <CardContent className="py-12 text-center">
              <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma notícia encontrada</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Tente ajustar sua busca' : 'Nenhuma notícia disponível no momento'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}