'use client';

import { ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';

// Default fallback component
const DefaultFallback: React.FC<FallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
      <h2 className="text-xl font-semibold text-red-800 mb-2">Something went wrong</h2>
      <p className="text-red-600 mb-4">
        {error?.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Reload Page
      </button>
    </div>
  </div>
);

interface ErrorBoundaryProps {
  children: ReactNode;
  FallbackComponent?: React.ComponentType<FallbackProps>;
  onError?: (error: Error, info: { componentStack?: string | null }) => void;
}

/**
 * Error boundary component that catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI.
 */
export function ErrorBoundary({ 
  children, 
  FallbackComponent = DefaultFallback,
  onError
}: ErrorBoundaryProps) {
  const handleError = (error: Error, info: { componentStack?: string | null }) => {
    console.error('ErrorBoundary caught an error:', error, info.componentStack);
    onError?.(error, { componentStack: info.componentStack || 'No component stack available' });
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={handleError}
    >
      {children}
    </ReactErrorBoundary>
  );
}

export default ErrorBoundary;
