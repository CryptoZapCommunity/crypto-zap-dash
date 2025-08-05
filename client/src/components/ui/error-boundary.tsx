import React from 'react';
import { Button } from './button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { t } from '@/lib/i18n';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry?: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.handleRetry} />;
      }

      return <DefaultErrorFallback error={this.state.error} retry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  retry?: () => void;
  title?: string;
  message?: string;
  showRetry?: boolean;
}

export function ErrorFallback({ 
  error, 
  retry, 
  title, 
  message, 
  showRetry = true 
}: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center p-8 max-w-md">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title || t('common.error')}
        </h3>
        
        <p className="text-muted-foreground mb-4">
          {message || t('common.errorMessage') || 'Something went wrong. Please try again.'}
        </p>
        
        {error && import.meta.env.DEV && (
          <details className="text-left bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
              Error Details (Dev)
            </summary>
            <pre className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap">
              {error.message}
              {error.stack && '\n\n' + error.stack}
            </pre>
          </details>
        )}
        
        {showRetry && retry && (
          <Button onClick={retry} className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>{t('common.retry')}</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export function DefaultErrorFallback({ error, retry }: { error?: Error; retry?: () => void }) {
  return <ErrorFallback error={error} retry={retry} />;
}

// Hook para usar com React Query
export function useErrorHandler() {
  const handleError = (error: any, context?: string) => {
    console.error(`Error in ${context || 'unknown context'}:`, error);
    
    // Log para analytics em produção
    if (import.meta.env.PROD) {
      // Aqui você pode integrar com serviços como Sentry, LogRocket, etc.
      console.error('Production error:', {
        message: error?.message,
        stack: error?.stack,
        context,
        timestamp: new Date().toISOString()
      });
    }
  };

  return { handleError };
}

// Componente para erros de API
export function ApiErrorFallback({ 
  error, 
  retry, 
  endpoint 
}: { 
  error?: Error; 
  retry?: () => void; 
  endpoint?: string;
}) {
  const getErrorMessage = () => {
    if (!error) return t('common.errorMessage') || 'An error occurred while loading data.';
    
    if (error.message.includes('Failed to fetch')) {
      return t('common.networkError') || 'Network error. Please check your connection.';
    }
    
    if (error.message.includes('404')) {
      return t('common.notFound') || 'The requested data was not found.';
    }
    
    if (error.message.includes('500')) {
      return t('common.serverError') || 'Server error. Please try again later.';
    }
    
    return error.message || t('common.errorMessage') || 'An error occurred while loading data.';
  };

  return (
    <ErrorFallback 
      error={error} 
      retry={retry}
      title={t('common.apiError') || 'API Error'}
      message={getErrorMessage()}
    />
  );
}

// Componente para erros de dados vazios
export function EmptyDataFallback({ 
  message, 
  icon: Icon 
}: { 
  message?: string; 
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center p-6">
        {Icon && <Icon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />}
        <p className="text-muted-foreground">
          {message || t('common.noData')}
        </p>
      </div>
    </div>
  );
} 