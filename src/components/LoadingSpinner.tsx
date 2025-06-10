'use client';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  className?: string;
}

export function LoadingSpinner({ fullScreen = true, className = '' }: LoadingSpinnerProps) {
  const spinner = (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export default LoadingSpinner;
