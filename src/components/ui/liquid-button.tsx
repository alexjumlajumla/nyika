'use client';

import LiquidGlass from 'liquid-glass-react';
import { ComponentProps, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  glassEffect?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'default',
    size = 'default',
    isLoading = false,
    glassEffect = true,
    children,
    ...props
  }, ref) => {
    const variantClasses = {
      default: 'bg-amber-600 text-white hover:bg-amber-700',
      outline:
        'border border-amber-600 bg-transparent text-amber-600 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-500 dark:hover:bg-amber-900/30',
      ghost: 'hover:bg-amber-100 dark:hover:bg-amber-900/30',
      link: 'text-amber-600 underline-offset-4 hover:underline dark:text-amber-500',
    };

    const sizeClasses = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    };

    const button = (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant as keyof typeof variantClasses],
          sizeClasses[size as keyof typeof sizeClasses],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
        ) : null}
        {children}
      </button>
    );

    if (!glassEffect) {
      return button;
    }

    return (
      <LiquidGlass
        className={cn(
          'inline-block',
          variant === 'outline' || variant === 'ghost' || variant === 'link' ? 'bg-transparent' : ''
        )}
        cornerRadius={8}
        blurAmount={8}
        overLight={variant === 'outline' || variant === 'ghost' || variant === 'link'}
      >
        {button}
      </LiquidGlass>
    );
  }
);

Button.displayName = 'Button';
