'use client';

import React, { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';

// Define theme type locally
type ThemeType = 'light' | 'dark' | 'system';

import { useUIStore } from '@/store/useUIStore';

interface NavbarClientProps {
  /**
   * The initial session from the server
   */
  session: any; // Temporarily using any to avoid Session type issues
}

// Using a simple button for now since the UI components might not be available
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm';
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  size = 'default', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variantStyles = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };
  const sizeStyles = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant as keyof typeof variantStyles] || variantStyles.default} ${sizeStyles[size as keyof typeof sizeStyles] || sizeStyles.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * NavbarClient - Client Component
 * Handles client-side interactivity for the navigation bar including:
 * - Authentication state
 * - Theme toggling
 * - Mobile menu
 * - Active route highlighting
 */
// Define menu item type
interface NavItem {
  name: string;
  href: string;
  current: boolean;
}

export default function NavbarClient({ session: initialSession }: NavbarClientProps) {
  // Use the session from the server as initial state
  const { data: session, status } = useSession();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, theme: uiTheme, toggleTheme: toggleUITheme } = useUIStore();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  
  // Check if a path is active
  const isActive = (path: string) => pathname === path;

  // Navigation items
  const navItems: NavItem[] = [
    { name: 'Home', href: '/', current: isActive('/') },
    { name: 'Destinations', href: '/destinations', current: isActive('/destinations') },
    { name: 'Tours', href: '/tours', current: isActive('/tours') },
    { name: 'Attractions', href: '/attractions', current: isActive('/attractions') },
    { name: 'Accommodations', href: '/accommodations', current: isActive('/accommodations') },
    { name: 'Blog', href: '/blog', current: isActive('/blog') },
    { name: 'About', href: '/about', current: isActive('/about') },
    { name: 'Contact', href: '/contact', current: isActive('/contact') },
  ];
  
  // Auth navigation items
  const authNavItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', current: isActive('/dashboard') },
    { name: 'My Bookings', href: '/bookings', current: isActive('/bookings') },
    { name: 'Profile', href: '/profile', current: isActive('/profile') },
  ];

  // Ensure the component is mounted before rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Cleanup function
    return () => {
      setMounted(false);
    };
  }, []);

  // Don't render anything until the component is mounted
  if (!mounted) {
    return null;
  }
  
  // Get the current theme, defaulting to 'light' if undefined
  const currentTheme = (theme as ThemeType) || 'light';

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme !== uiTheme) {
      toggleUITheme();
    }
  };

  const handleMobileLinkClick = (href: string) => {
    closeMobileMenu();
    router.push(href);
  };

  const isActiveLink = (path: string) => {
    if (!pathname) return 'text-foreground/80';
    const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
    return isActive 
      ? 'text-primary font-medium border-b-2 border-primary' 
      : 'text-foreground/80 hover:text-primary transition-colors';
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex w-full items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <span className="text-xl font-bold">Nyika Safaris</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="ml-10 hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${isActiveLink(item.href)}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden items-center space-x-4 md:flex">
          <button
            onClick={toggleTheme}
            className="rounded-md p-2 hover:bg-muted"
            aria-label="Toggle theme"
          >
            {uiTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          {status === 'authenticated' ? (
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Dashboard
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/auth/signin')}
              >
                Sign In
              </Button>
              <Button 
                size="sm"
                onClick={() => router.push('/auth/signup')}
              >
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-gray-200 dark:hover:bg-gray-800"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
          {/* Main navigation items */}
          {navItems.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => handleMobileLinkClick(item.href)}
              className={`w-full rounded-md px-3 py-2 text-left text-base font-medium ${
                item.current
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
              aria-current={item.current ? 'page' : undefined}
            >
              {item.name}
            </button>
          ))}

          {/* Authentication section */}
          <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>
          
          {status === 'authenticated' ? (
            <>
              {/* Authenticated user links */}
              {authNavItems.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleMobileLinkClick(item.href)}
                  className={`w-full rounded-md px-3 py-2 text-left text-base font-medium ${
                    item.current
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-gray-800 dark:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  signOut({ callbackUrl: '/' });
                  closeMobileMenu();
                }}
                className="w-full rounded-md px-3 py-2 text-left text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-800"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleMobileLinkClick('/auth/signin')}
                className="w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleMobileLinkClick('/auth/signup')}
                className="w-full rounded-md px-3 py-2 text-left text-base font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-gray-800"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
