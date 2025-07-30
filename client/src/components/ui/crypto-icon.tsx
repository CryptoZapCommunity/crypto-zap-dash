import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Skeleton } from './skeleton';

interface CryptoIconProps {
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fallback?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

// Cache local para ícones
const iconCache = new Map<string, string>();

export function CryptoIcon({ 
  symbol, 
  size = 'md', 
  className = '',
  fallback = symbol.slice(0, 2).toUpperCase()
}: CryptoIconProps) {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchIcon = async () => {
      // Check cache first
      const cachedIcon = iconCache.get(symbol);
      if (cachedIcon) {
        if (isMounted) {
          setIconUrl(cachedIcon);
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        setHasError(false);
        
        const response = await apiClient.getCryptoIcon(symbol) as { iconUrl?: string };
        if (isMounted && response?.iconUrl) {
          setIconUrl(response.iconUrl);
          // Cache the icon
          iconCache.set(symbol, response.iconUrl);
        } else if (isMounted) {
          setHasError(true);
        }
      } catch (error) {
        if (isMounted) {
          console.error(`Error fetching icon for ${symbol}:`, error);
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (symbol) {
      fetchIcon();
    }

    return () => {
      isMounted = false;
    };
  }, [symbol]);

  if (isLoading) {
    return (
      <Skeleton className={`${sizeClasses[size]} rounded-full ${className}`} />
    );
  }

  if (hasError || !iconUrl) {
    return (
      <div 
        className={`
          ${sizeClasses[size]} 
          rounded-full 
          bg-gradient-to-br from-primary to-primary/70 
          flex items-center justify-center 
          text-white font-bold text-xs
          ${className}
        `}
        title={symbol}
      >
        {fallback}
      </div>
    );
  }

  return (
    <img
      src={iconUrl}
      alt={`${symbol} icon`}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      onError={() => {
        setHasError(true);
        setIconUrl(null);
      }}
    />
  );
}

interface CryptoIconsProps {
  symbols: string[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CryptoIcons({ symbols, size = 'md', className = '' }: CryptoIconsProps) {
  const [icons, setIcons] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.getCryptoIcons(symbols) as Record<string, string>;
        setIcons(response);
      } catch (error) {
        console.error('Error fetching crypto icons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (symbols.length > 0) {
      fetchIcons();
    }
  }, [symbols]);

  if (isLoading) {
    return (
      <div className={`flex gap-2 ${className}`}>
        {symbols.map((symbol, index) => (
          <Skeleton key={index} className={`${sizeClasses[size]} rounded-full`} />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {symbols.map((symbol) => (
        <CryptoIcon
          key={symbol}
          symbol={symbol}
          size={size}
          fallback={symbol.slice(0, 2).toUpperCase()}
        />
      ))}
    </div>
  );
}