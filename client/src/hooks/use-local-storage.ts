import { useState, useEffect, useCallback } from 'react';

interface StorageItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  ttl: number = 5 * 60 * 1000 // 5 minutes default
) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const parsed: StorageItem<T> = JSON.parse(item);
      const isExpired = Date.now() - parsed.timestamp > parsed.ttl;

      if (isExpired) {
        window.localStorage.removeItem(key);
        return initialValue;
      }

      return parsed.data;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      const item: StorageItem<T> = {
        data: valueToStore,
        timestamp: Date.now(),
        ttl
      };

      window.localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, ttl]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  const isExpired = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return true;

      const parsed: StorageItem<T> = JSON.parse(item);
      return Date.now() - parsed.timestamp > parsed.ttl;
    } catch {
      return true;
    }
  }, [key, ttl]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    isExpired: isExpired()
  };
}

// Hook específico para dados da API
export function useApiStorage<T = any>(
  key: string,
  initialValue: T,
  ttl: number = 5 * 60 * 1000
) {
  const { value, setValue, removeValue, isExpired } = useLocalStorage<T>(
    `api_${key}`,
    initialValue,
    ttl
  );

  const updateData = useCallback((data: any) => {
    setValue(data as T);
  }, [setValue]);

  const clearData = useCallback(() => {
    removeValue();
  }, [removeValue]);

  return {
    data: value,
    updateData,
    clearData,
    isExpired,
    hasData: value !== null && value !== undefined
  };
} 