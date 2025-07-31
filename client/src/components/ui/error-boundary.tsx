import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Error Boundary caught an error:', error);
    console.error('🚨 Error Info:', errorInfo);
    console.error('🚨 Component Stack:', errorInfo.componentStack);
    
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="text-red-600 dark:text-red-400 text-xl font-semibold mb-4">
            🚨 Something went wrong
          </div>
          <div className="text-red-500 dark:text-red-300 text-sm text-center mb-6 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred'}
          </div>
          
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details className="w-full max-w-2xl mb-6">
              <summary className="cursor-pointer text-red-600 dark:text-red-400 font-medium mb-2">
                🔍 Debug Information (Development)
              </summary>
              <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded text-xs font-mono text-red-800 dark:text-red-200 overflow-auto max-h-60">
                <div className="mb-2">
                  <strong>Error:</strong> {this.state.error?.toString()}
                </div>
                <div className="mb-2">
                  <strong>Component Stack:</strong>
                  <pre className="whitespace-pre-wrap mt-1">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </div>
            </details>
          )}
          
          <div className="flex gap-4">
            <button
              onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 