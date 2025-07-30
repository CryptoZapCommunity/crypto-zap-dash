import { useEffect, useRef, useState, useCallback } from 'react';
import { queryClient } from '@/lib/queryClient';

interface UsePollingOptions {
  onUpdate?: () => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  interval?: number;
  queries?: string[];
}

export function usePolling(options: UsePollingOptions = {}) {
  const {
    onUpdate,
    onConnect,
    onDisconnect,
    onError,
    interval = 5 * 60 * 1000, // 5 minutes default
    queries = ['/api/market-summary', '/api/trending-coins'],
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
