import { ReactNode, Suspense } from 'react';
import { Skeleton } from './skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type DataLoaderProps<T> = {
  data: T | undefined;
  error: string | null;
  isLoading: boolean;
  loadingComponent?: ReactNode;
  errorComponent?: (error: string) => ReactNode;
  children: (data: T) => ReactNode;
};

export function DataLoader<T>({
  data,
  error,
  isLoading,
  loadingComponent,
  errorComponent,
  children,
}: DataLoaderProps<T>) {
  // Show loading state
  if (isLoading) {
    return loadingComponent || (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return errorComponent ? (
      errorComponent(error)
    ) : (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Show no data state
  if (!data) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Render children with data
  return <>{children(data)}</>;
}

type SuspenseLoaderProps = {
  fallback?: ReactNode;
  children: ReactNode;
};

export function SuspenseLoader({ fallback, children }: SuspenseLoaderProps) {
  return (
    <Suspense fallback={fallback || <DataLoaderSkeleton />}>
      {children}
    </Suspense>
  );
}

export function DataLoaderSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  );
}
