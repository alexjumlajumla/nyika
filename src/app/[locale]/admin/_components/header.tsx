'use client';

import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { UserNav } from '../../../../components/user-nav';
import { Search } from 'lucide-react';
import { LanguageCurrencyDropdowns } from '@/components/language-currency-dropdown';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  user?: User | null;
  children?: React.ReactNode;
  className?: string;
}

export function DashboardHeader({
  title,
  description,
  user,
  children,
  className,
}: DashboardHeaderProps) {
  return (
    <div className={cn(
      'flex flex-col justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0 md:h-16 px-6 py-4 border-b',
      className
    )}>
      <div className="flex items-center space-x-2">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="hidden text-sm text-muted-foreground md:block">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-full flex-1 md:max-w-xs">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
        </div>
        {children}
        <div className="flex items-center gap-2">
          <LanguageCurrencyDropdowns />
          <UserNav user={user} />
        </div>
      </div>
    </div>
  );
}
