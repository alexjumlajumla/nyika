'use client';

import { useState } from 'react';
import { User as UserIcon, LogOut, Settings, BookOpen, LayoutDashboard, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { Badge } from '@/components/ui/badge';

type ExtendedUser = User & {
  role?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
};

export interface UserMenuProps {
  user: ExtendedUser | null;
}

export function UserMenu({ user }: UserMenuProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      // Get the current locale from the URL or default to 'en'
      const locale = window.location.pathname.split('/')[1] || 'en';
      // Redirect to sign-out page which will handle the sign-out process
      router.push(`/${locale}/signout`);
    } catch {
      // In case of error, still try to redirect to sign-in
      const locale = window.location.pathname.split('/')[1] || 'en';
      router.push(`/${locale}/signin`);
    }
  };

  if (!user) {
    return (
      <Button 
        variant="ghost" 
        onClick={() => {
          const pathSegments = window.location.pathname.split('/');
          const locale = pathSegments[1] === 'auth' ? 'en' : pathSegments[1] || 'en';
          router.push(`/${locale}/signin`);
        }}
      >
        Sign In
      </Button>
    );
  }

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const userAvatar = user.user_metadata?.avatar_url || '';
  const userRole = user.role || 'user';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt={userName} 
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <UserIcon className="h-4 w-4" />
            )}
          </div>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-56 rounded-md bg-white p-1 shadow-lg" align="end" sideOffset={5}>
        <DropdownMenu.Label className="px-2 py-1.5 text-sm font-semibold">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium leading-none">
                {userName}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
              <Badge variant="outline" className="text-xs capitalize">
                {userRole}
              </Badge>
            </div>
          </div>
        </DropdownMenu.Label>
        <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
        <DropdownMenu.Group>
          {/* Dashboard Link - Shown for all roles but leads to different dashboards */}
          <DropdownMenu.Item 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              const locale = window.location.pathname.split('/')[1] || 'en';
              const dashboardPath = userRole === 'admin' 
                ? `/${locale}/dashboard` 
                : `/${locale}/my-bookings`;
              router.push(dashboardPath);
            }}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>{userRole === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}</span>
          </DropdownMenu.Item>

          {/* Admin-only links */}
          {userRole === 'admin' && (
            <>
              <DropdownMenu.Item 
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  const locale = window.location.pathname.split('/')[1] || 'en';
                  router.push(`/${locale}/dashboard/users`);
                }}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Manage Users</span>
              </DropdownMenu.Item>
            </>
          )}

          {/* Regular user links */}
          <DropdownMenu.Item 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              const locale = window.location.pathname.split('/')[1] || 'en';
              router.push(`/${locale}/my-bookings`);
            }}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            <span>My Bookings</span>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
          <DropdownMenu.Item 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              const locale = window.location.pathname.split('/')[1] || 'en';
              router.push(`/${locale}/settings`);
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
        <DropdownMenu.Item 
          className="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-gray-100 cursor-pointer"
          onSelect={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoading ? 'Signing out...' : 'Sign out'}</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

