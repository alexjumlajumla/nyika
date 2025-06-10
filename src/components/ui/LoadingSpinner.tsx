'use client';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ 
  className = '', 
  size = 'md', 
  text = 'Loading...' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`
          ${sizeClasses[size]}
          animate-spin rounded-full 
          border-primary-500 border-t-transparent
        `}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">{text}</span>
      </div>
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner size="lg" text="Loading content..." />
    </div>
  );
}
