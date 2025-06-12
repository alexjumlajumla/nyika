'use client';

import * as React from 'react';
import LiquidGlass from 'liquid-glass-react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glassEffect?: boolean;
  blurAmount?: number;
  border?: boolean;
  cornerRadius?: number;
  padding?: string;
}

export function Card({
  className,
  glassEffect = true,
  blurAmount = 10,
  border = true,
  cornerRadius = 16,
  padding = '1.5rem',
  children,
  ...props
}: CardProps) {
  const card = (
    <div
      className={cn(
        'transition-all duration-300',
        'bg-white/5',
        border && 'border border-white/10',
        className
      )}
      style={{
        borderRadius: `${cornerRadius}px`,
        padding,
      }}
      {...props}
    >
      {children}
    </div>
  );

  if (!glassEffect) {
    return card;
  }

  return (
    <LiquidGlass
      className={cn('block', className)}
      cornerRadius={cornerRadius}
      blurAmount={blurAmount}
      overLight={false}
    >
      {card}
    </LiquidGlass>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn('p-6', className)} {...props} />;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6 pb-0', className)}
      {...props}
    />
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn(
        'text-xl font-semibold leading-none tracking-tight text-foreground',
        className
      )}
      {...props}
    />
  );
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  );
}
