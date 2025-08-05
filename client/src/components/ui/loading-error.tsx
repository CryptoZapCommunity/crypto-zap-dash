import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { t } from '@/lib/i18n';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin`} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  children: React.ReactNode;
}

export function LoadingOverlay({ isLoading, text, children }: LoadingOverlayProps) {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <LoadingSpinner text={text || t('common.loading')} />
      </div>
    </div>
  );
}

interface ErrorDisplayProps {
  error?: Error | null;
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  className?: string;
}

export function ErrorDisplay({ 
  error, 
  title, 
  message, 
  onRetry, 
  showRetry = true,
  className = '' 
}: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title || t('common.error')}
      </h3>
      
      <p className="text-muted-foreground mb-4 max-w-md">
        {message || error.message || t('common.errorMessage')}
      </p>
      
      {showRetry && onRetry && (
        <Button onClick={onRetry} className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4" />
          <span>{t('common.retry')}</span>
        </Button>
      )}
    </div>
  );
}

interface LoadingErrorProps {
  isLoading: boolean;
  error?: Error | null;
  onRetry?: () => void;
  loadingText?: string;
  errorTitle?: string;
  errorMessage?: string;
  children: React.ReactNode;
  className?: string;
}

export function LoadingError({ 
  isLoading, 
  error, 
  onRetry, 
  loadingText, 
  errorTitle, 
  errorMessage, 
  children, 
  className = '' 
}: LoadingErrorProps) {
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
        <LoadingSpinner text={loadingText} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay 
        error={error}
        title={errorTitle}
        message={errorMessage}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  return <>{children}</>;
}

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  message, 
  action, 
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      {Icon && <Icon className="w-12 h-12 text-muted-foreground mb-4" />}
      
      {title && (
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>
      )}
      
      {message && (
        <p className="text-muted-foreground mb-4 max-w-md">
          {message}
        </p>
      )}
      
      {action && action}
    </div>
  );
}

interface LoadingButtonProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function LoadingButton({ 
  isLoading, 
  loadingText, 
  children, 
  disabled, 
  className = '', 
  onClick, 
  variant = 'default',
  size = 'default'
}: LoadingButtonProps) {
  return (
    <Button 
      onClick={onClick}
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {loadingText || t('common.loading')}
        </>
      ) : (
        children
      )}
    </Button>
  );
} 