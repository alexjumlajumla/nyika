'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LanguageCurrencyDropdowns } from '@/components/language-currency-dropdown';
import { Menu, X, LogOut, User as UserIcon, Settings, ChevronDown, Sun, Moon, LayoutDashboard } from 'lucide-react';
import { useLocale, getDashboardPath } from '@/lib/url-utils';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

type NavItem = {
  name: string;
  href: string;
};

const navigation: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Tours', href: '/tours' },
  { name: 'Destinations', href: '/destinations' },
  { name: 'Accommodations', href: '/accommodations' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const locale = useLocale();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const supabase = createClientComponentClient();
  const { theme, setTheme } = useTheme();

  // Get user's initials for avatar
  const getInitials = (email?: string) => {
    return email?.charAt(0).toUpperCase() || 'U';
  };

  // Get dashboard URL based on user role
  const getDashboardUrl = (): string => {
    return `/${locale}${getDashboardPath(user || undefined)}`;
  };

  // Handle dashboard navigation
  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(getDashboardUrl());
  };

  // Get current path for navigation highlighting
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    // This effect runs only on the client side
    if (typeof window !== 'undefined') {
      setCurrentPath(`/${locale}${window.location.pathname.split(locale)[1] || '/'}`);
    }
  }, [locale]);

  // Get user session on mount
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setMounted(true);
    };

    getSession();

    // Set up auth state change listener
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      if (data?.subscription) {
        data.subscription.unsubscribe();
      }
    };
  }, [supabase.auth]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.refresh();
      router.push('/');
    } catch {
      // Error handled silently
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    // Render a placeholder while checking auth state
    return (
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur dark:border-[#3a322d] dark:bg-[#2c2520]/90 supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between text-foreground px-4 sm:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center mr-8 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent transition-all duration-300 group-hover:from-amber-700 group-hover:to-amber-900 dark:group-hover:from-amber-500 dark:group-hover:to-amber-700">
              Nyika Safaris
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'relative px-2 py-1 text-sm font-medium transition-all duration-200',
                  currentPath === `/${locale}${item.href}`
                    ? 'text-amber-700 dark:text-amber-400 font-semibold' 
                    : 'text-gray-700 hover:text-amber-700 dark:text-gray-300 dark:hover:text-amber-400'
                )}
              >
                <span className="relative">
                  {item.name}
                  <span 
                    className={cn(
                      'absolute -bottom-1 left-0 h-0.5 bg-amber-600 dark:bg-amber-400 transition-all duration-300',
                      currentPath === `/${locale}${item.href}` ? 'w-full' : 'w-0 group-hover:w-full'
                    )}
                  />
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* Language and Currency Dropdowns */}
          <div className="hidden md:block">
            <LanguageCurrencyDropdowns />
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            {/* Theme Toggle */}
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-full text-foreground/80 hover:bg-foreground/5 hover:text-foreground" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>

            {/* User Menu */}
            {user ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-amber-600/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-600 dark:text-amber-400 font-medium">
                      {getInitials(user.email)}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      align="end"
                      sideOffset={8}
                      className="min-w-[200px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                      </div>
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                    </div>
                    <DropdownMenu.Item asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left text-sm font-medium text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                        onClick={() => router.push('/profile')}
                      >
                        <UserIcon className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-300" />
                        Profile
                      </Button>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left text-sm font-medium text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                        onClick={() => router.push('/settings')}
                      >
                        <Settings className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-300" />
                        Settings
                      </Button>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left text-sm font-medium text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                        onClick={handleDashboardClick}
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-300" />
                        {user?.user_metadata?.role === 'super_admin' || user?.email?.endsWith('@nyikasafaris.com') 
                          ? 'Admin Dashboard' 
                          : 'My Dashboard'}
                      </Button>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="h-px bg-gray-100 dark:bg-gray-700" />
                    <DropdownMenu.Item asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        onClick={handleSignOut}
                        disabled={isLoading}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {isLoading ? 'Signing out...' : 'Sign out'}
                      </Button>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <Button 
                asChild 
                size="sm" 
                className="rounded-full bg-amber-600 hover:bg-amber-700 text-white px-6"
              >
                <Link href={`/${locale}/auth/signin`}>
                  Sign In / Register
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="md:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute inset-x-0 top-20 z-50 bg-white dark:bg-[#2c2520] border-t border-gray-200 dark:border-[#3a322d] shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-4">
            {navigation.map((navItem) => (
              <Link
                key={navItem.name}
                href={navItem.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground/90 hover:bg-foreground/5 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {navItem.name}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-gray-200 dark:border-[#3a322d] space-y-4">
              <div className="px-3">
                <LanguageCurrencyDropdowns />
              </div>
              
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Theme</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 rounded-full text-foreground/80 hover:bg-foreground/5 hover:text-foreground" 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </div>
              
              <div className="mt-4 space-y-2">
                {user ? (
                  <Button 
                    asChild 
                    className="w-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center"
                  >
                    <Link 
                      href={getDashboardUrl()} 
                      className="flex items-center justify-center w-full"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(false);
                        handleDashboardClick(e as unknown as React.MouseEvent);
                      }}
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      My Dashboard
                    </Link>
                  </Button>
                ) : (
                  <Button 
                    asChild 
                    className="w-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center"
                  >
                    <Link 
                      href={`/${locale}/auth/signin`}
                      className="flex items-center justify-center w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Sign In / Register
                    </Link>
                  </Button>
                )}
                {user && (
                  <Button 
                    variant="outline"
                    className="w-full flex items-center justify-center mt-2"
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    disabled={isLoading}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isLoading ? 'Signing out...' : 'Sign Out'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
