'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { LogOut, Settings, User as UserIcon, ChevronDown, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

interface UserNavProps {
  user: User | null | undefined;
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const initials = user?.email?.charAt(0).toUpperCase() || 'U';

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      router.push('/');
    } catch (error) {
      // Log error in development only
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Error signing out:', error);
      }
    } finally {
      setIsSigningOut(false);
      setIsOpen(false);
    }
  };
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          {user?.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt={user.email || 'User'} 
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium">{initials}</span>
          )}
        </div>
        <ChevronDown className="h-4 w-4" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <div className="px-4 py-2">
              <p className="text-sm font-medium">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
            <Link 
              href="/settings/profile" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
            <Link 
              href="/settings" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              role="menuitem"
            >
              {isSigningOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
