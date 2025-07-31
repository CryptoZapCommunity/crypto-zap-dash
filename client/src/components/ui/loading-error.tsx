import React from 'react';

interface LoadingErrorProps {
  isLoading: boolean;
  error: Error | null;
  children: React.ReactNode;
  loadingMessage?: string;
  errorMessage?: string;
  retry?: () => void;
}

export function LoadingError({
  isLoading,
  error,
  children,
  loadingMessage = 'Loading...',
  errorMessage = 'Failed to load data. Please try again later.',
  retry
}: LoadingErrorProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-600">{loadingMessage}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-red-600 text-lg font-semibold mb-2">
          Error
        </div>
        <div className="text-red-500 text-sm text-center mb-4">
          {errorMessage}
        </div>
        {retry && (
          <button
            onClick={retry}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
} 