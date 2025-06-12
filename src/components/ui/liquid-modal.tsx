'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './liquid-card';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
  maxWidth = 'md',
}: ModalProps) {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-full',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <Card
          className={cn(
            'relative z-10 w-full overflow-hidden',
            maxWidthClasses[maxWidth],
            className
          )}
          glassEffect={true}
          blurAmount={15}
          cornerRadius={24}
          onClick={(e) => e.stopPropagation()}
        >
          <CardContent className="relative p-8">
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              >
                <X className="h-5 w-5 text-foreground" />
                <span className="sr-only">Close</span>
              </button>
            )}
            {title && (
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                {title}
              </h2>
            )}
            <div className={cn(title ? 'mt-2' : '')}>{children}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
