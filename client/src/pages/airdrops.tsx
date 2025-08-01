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
  Gift, 
  Calendar, 
  DollarSign, 
  ExternalLink,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Star,
  StarOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';
import type { Airdrop } from '@/types';

export default function Airdrops() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'ended'>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'value' | 'name'>('deadline');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Fetch airdrops
  const { data: airdrops, isLoading, error } = useQuery({
    queryKey: ['/api/airdrops'],
    queryFn: () => apiClient.getAirdrops(),
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    staleTime: 5 * 60 * 1000,
  });

  const airdropsList: Airdrop[] = (airdrops as Airdrop[]) || [];

  // Filter and sort airdrops
  const filteredAirdrops = airdropsList
    .filter(airdrop => {
      const matchesSearch = 
        airdrop.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airdrop.tokenSymbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airdrop.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || airdrop.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'value':
          const aValue = parseFloat(a.estimatedValue?.replace(/[^0-9.]/g, '') || '0');
          const bValue = parseFloat(b.estimatedValue?.replace(/[^0-9.]/g, '') || '0');
          return bValue - aValue;
        case 'name':
          return a.projectName.localeCompare(b.projectName);
        default:
          return 0;
      }
    });

  const toggleFavorite = (airdropId: string) => {
    setFavorites(prev => 
      prev.includes(airdropId) 
        ? prev.filter(id => id !== airdropId)
        : [...prev, airdropId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-500 bg-blue-500/10';
      case 'ongoing':
        return 'text-green-500 bg-green-500/10';
      case 'ended':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      case 'ongoing':
        return <CheckCircle className="w-4 h-4" />;
      case 'ended':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return 'No deadline';
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diff < 0) return 'Ended';
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return 'Ending soon';
  };

  const isUrgent = (deadline: string | null) => {
    if (!deadline) return false;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    return diff > 0 && diff < 24 * 60 * 60 * 1000; // Less than 24 hours
  };

  // Calculate statistics
  const totalAirdrops = filteredAirdrops.length;
  const upcomingCount = filteredAirdrops.filter(a => a.status === 'upcoming').length;
  const ongoingCount = filteredAirdrops.filter(a => a.status === 'ongoing').length;
  const endedCount = filteredAirdrops.filter(a => a.status === 'ended').length;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">
            {t('common.error')}
          </p>
          <p className="text-muted-foreground">
            Failed to load airdrop data. Please try again later.
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
          <h1 className="text-3xl font-bold text-foreground">Airdrops</h1>
          <p className="text-muted-foreground">
            Discover and track cryptocurrency airdrops and token distributions
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Total Airdrops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAirdrops}</div>
            <p className="text-xs text-muted-foreground">Available opportunities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{upcomingCount}</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Ongoing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{ongoingCount}</div>
            <p className="text-xs text-muted-foreground">Active now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              Ended
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{endedCount}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search airdrops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="ended">Ended</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="value">Estimated Value</SelectItem>
                <SelectItem value="name">Project Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Airdrops List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Available Airdrops</h2>
          <Badge variant="secondary">
            {filteredAirdrops.length} airdrops
          </Badge>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Array.isArray(filteredAirdrops) ? filteredAirdrops : []).map((airdrop) => (
              <Card 
                key={airdrop.id} 
                className={cn(
                  "hover:shadow-lg transition-shadow",
                  isUrgent(airdrop.deadline) && "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20"
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-green-500 rounded-lg flex items-center justify-center">
                        <Gift className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{airdrop.projectName}</CardTitle>
                        {airdrop.tokenSymbol && (
                          <CardDescription className="text-sm">{airdrop.tokenSymbol}</CardDescription>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(airdrop.id)}
                    >
                      {favorites.includes(airdrop.id) ? (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      ) : (
                        <StarOff className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {airdrop.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {airdrop.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(airdrop.status)}
                      <Badge className={getStatusColor(airdrop.status)}>
                        {airdrop.status}
                      </Badge>
                    </div>
                    {airdrop.estimatedValue && (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{airdrop.estimatedValue}</span>
                      </div>
                    )}
                  </div>
                  
                  {airdrop.deadline && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Deadline:</span>
                      <span className={cn(
                        "font-medium",
                        isUrgent(airdrop.deadline) && "text-orange-600 dark:text-orange-400"
                      )}>
                        {formatDeadline(airdrop.deadline)}
                      </span>
                    </div>
                  )}
                  
                  {airdrop.eligibility && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Requirements: </span>
                      <span className="font-medium">{airdrop.eligibility}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                    {airdrop.website && (
                      <Button variant="outline" size="sm" className="flex-1 mr-2">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Website
                      </Button>
                    )}
                    <Button variant="default" size="sm" className="flex-1">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredAirdrops.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No airdrops found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Tips */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                Airdrop Tips
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                <li>• Always verify the official project website before participating</li>
                <li>• Be cautious of scams and never share private keys</li>
                <li>• Check eligibility requirements carefully</li>
                <li>• Some airdrops may require specific wallet holdings or actions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 