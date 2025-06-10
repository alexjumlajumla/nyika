import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="overflow-hidden rounded-xl bg-white shadow-md">
              <Skeleton className="h-48 w-full" />
              <div className="p-6">
                <Skeleton className="mb-4 h-6 w-3/4" />
                <Skeleton className="mb-2 h-4 w-1/2" />
                <Skeleton className="mb-4 h-4 w-1/3" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
