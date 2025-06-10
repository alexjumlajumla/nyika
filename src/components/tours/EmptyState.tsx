import { Button } from '@/components/ui/button';
import { FiCompass, FiRefreshCw } from 'react-icons/fi';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  isLoading?: boolean;
}

export function EmptyState({
  title,
  description,
  actionText = 'Try again',
  onAction,
  isLoading = false,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg bg-gray-50 p-8 text-center">
      <div className="mb-4 rounded-full bg-primary-100 p-4">
        <FiCompass className="h-8 w-8 text-primary-600" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mb-6 max-w-md text-gray-600">{description}</p>
      {onAction && (
        <Button
          onClick={onAction}
          disabled={isLoading}
          className="inline-flex items-center gap-2"
        >
          {isLoading && <FiRefreshCw className="h-4 w-4 animate-spin" />}
          {actionText}
        </Button>
      )}
    </div>
  );
}
