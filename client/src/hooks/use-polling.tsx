import { useEffect, useRef, useState, useCallback } from 'react';
import { queryClient } from '@/lib/queryClient';
import { apiClient } from '@/lib/api';

interface UsePollingOptions {
  onUpdate?: () => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  interval?: number;
  queries?: string[]; // React Query keys, e.g., 'market-summary'
}

export function usePolling(options: UsePollingOptions = {}) {
  const {
    onUpdate,
    onConnect,
    onDisconnect,
    onError,
    interval = import.meta.env.VITE_POLLING_INTERVAL ? parseInt(import.meta.env.VITE_POLLING_INTERVAL) : 5 * 60 * 1000, // 5 minutes default (reduced)
    // Default to the React Query keys used by hooks
    queries = ['market-summary', 'trending-coins'],
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (intervalRef.current) {
      return;
    }

    setConnectionStatus('connecting');

    try {
      setIsConnected(true);
      setConnectionStatus('connected');
      onConnect?.();
      
      // Start polling interval
      intervalRef.current = setInterval(() => {
        try {
          // Invalidate queries to trigger refetch
          queries.forEach(queryKey => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
          });
          // Clear ApiClient localStorage cache for corresponding endpoints to force network fetch
          const keyToEndpointMap: Record<string, string> = {
            'market-summary': '/market-summary',
            'trending-coins': '/trending-coins',
            'crypto-overview': '/crypto-overview',
            news: '/news',
            'whale-transactions': '/whale-transactions',
          };
          queries.forEach(qk => {
            const ep = keyToEndpointMap[qk];
            if (ep) {
              apiClient.clearCacheForEndpoint(ep);
            }
          });
          
          onUpdate?.();
        } catch (error) {
          console.error('Polling error:', error);
          onError?.(error as Error);
        }
      }, interval);

    } catch (error) {
      setConnectionStatus('error');
      console.error('Polling connection error:', error);
      onError?.(error as Error);
    }
  }, [onConnect, onDisconnect, onError, onUpdate, interval, queries]);

  const disconnect = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
    onDisconnect?.();
  }, [onDisconnect]);

  const startPolling = useCallback(() => {
    connect();
  }, [connect]);

  const stopPolling = useCallback(() => {
    disconnect();
  }, [disconnect]);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    connectionStatus,
    startPolling,
    stopPolling,
    disconnect,
  };
}
