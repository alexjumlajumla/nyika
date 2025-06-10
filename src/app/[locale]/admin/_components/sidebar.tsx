'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  Users,
  Calendar,
  MapPin,
  Hotel,
  Settings,
  Menu,
  X,
  LogOut,
  BookOpen,
  MessageSquare,
  BarChart2,
  CreditCard,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/supabase/client';
import { useMediaQuery } from '@/hooks';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Bookings',
    href: '/dashboard/bookings',
    icon: Calendar,
  },
  {
    title: 'Tours',
    href: '/dashboard/tours',
    icon: MapPin,
  },
  {
    title: 'Accommodations',
    href: '/dashboard/accommodations',
    icon: Hotel,
  },
  {
    title: 'Blog',
    href: '/dashboard/blog',
    icon: BookOpen,
  },
  {
    title: 'Testimonials',
    href: '/dashboard/testimonials',
    icon: MessageSquare,
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: Users,
    adminOnly: true,
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: BarChart2,
  },
  {
    title: 'Billing',
    href: '/dashboard/billing',
    icon: CreditCard,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    if (isDesktop) {
      setIsOpen(false);
    }
  }, [isDesktop]);

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/auth/signin');
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-background transition-all duration-300 ease-in-out pt-16',
          isCollapsed ? 'w-16' : 'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          className
        )}
      >
        {/* Collapse button */}
        <div className="absolute right-0 top-4 -mr-10 hidden md:block">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={toggleCollapse}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <nav className="space-y-1 p-2">
            {sidebarItems.map((item) => {
              if (item.adminOnly) return null; // Skip admin-only items for now
              
              const itemContent = (
                <div
                  className={cn(
                    'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    pathname === item.href
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground',
                    isCollapsed ? 'justify-center' : 'justify-start'
                  )}
                >
                  <item.icon className={cn('h-5 w-5', !isCollapsed && 'mr-3')} />
                  <span className={cn(isCollapsed ? 'hidden' : 'inline')}>
                    {item.title}
                  </span>
                </div>
              );

              return isCollapsed ? (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link href={item.href} onClick={() => setIsOpen(false)}>
                      {itemContent}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  {itemContent}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="border-t p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400',
                  isCollapsed ? 'justify-center' : 'justify-start'
                )}
                onClick={handleSignOut}
              >
                <LogOut className={cn('h-5 w-5', !isCollapsed && 'mr-3')} />
                <span className={cn(isCollapsed ? 'hidden' : 'inline')}>Sign out</span>
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" sideOffset={10}>
                Sign out
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>
    </>
  );
}
