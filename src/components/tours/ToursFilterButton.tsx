'use client';

import { Button } from '@/components/ui/button';
import { FiFilter } from 'react-icons/fi';

interface ToursFilterButtonProps {
  filterCount: number;
  onClick: () => void;
  className?: string;
}

export function ToursFilterButton({ 
  filterCount, 
  onClick, 
  className = '' 
}: ToursFilterButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={`flex items-center gap-2 ${className}`}
    >
      <FiFilter className="h-4 w-4" />
      <span>Filters</span>
      {filterCount > 0 && (
        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          {filterCount}
        </span>
      )}
    </Button>
  );
}
