'use client';

import { User } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Settings, User as UserIcon, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/supabase/client';
import { useState, useRef, useEffect } from 'react';

interface UserNavProps {
  user: User | null | undefined;
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/sign-in');
  };

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || 'User'} />
          <AvatarFallback>{user?.email ? getInitials(user.email) : 'U'}</AvatarFallback>
        </Avatar>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover p-1 shadow-lg z-50">
          <div className="px-3 py-2">
            <p className="text-sm font-medium">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
          
          <div className="h-px bg-border my-1" />
          
          <div className="space-y-1">
            <button
              onClick={() => {
                setIsOpen(false);
                // Handle profile click
              }}
              className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
            >
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <span className="ml-auto text-xs opacity-60">⇧⌘P</span>
            </button>
            
            <button
              onClick={() => {
                setIsOpen(false);
                // Handle settings click
              }}
              className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <span className="ml-auto text-xs opacity-60">⌘S</span>
            </button>
          </div>
          
          <div className="h-px bg-border my-1" />
          
          <button
            onClick={() => {
              setIsOpen(false);
              handleSignOut();
            }}
            className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            <span className="ml-auto text-xs opacity-60">⇧⌘Q</span>
          </button>
        </div>
      )}
    </div>
  );
}
