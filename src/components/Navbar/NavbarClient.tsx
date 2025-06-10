'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/providers/AuthProvider';
import { useUIStore } from '@/store/useUIStore';
import { LanguageSwitcher } from '../LanguageSwitcher';

// Button component with TypeScript types
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm';
  className?: string;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', className = '', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    const variantStyles = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    } as const;
    const sizeStyles = {
      default: 'h-10 py-2 px-4',
      sm: 'h-9 px-3 rounded-md',
    } as const;

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// NavItem type is no longer needed as we're using inline types
// type NavItem = {
//   name: string;
//   path: `/${string}`;
//   href: `/${string}`;
//   current: boolean;
// };

export default function NavbarClient() {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, theme: uiTheme, toggleTheme: toggleUITheme } = useUIStore();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { user, signOut } = useAuth();
  const isAuthenticated = !!user;
  const t = useTranslations('Navigation');
  const locale = useLocale();

  // Check if a path is active (supports both with and without locale prefix)
  const isActive = (path: string): boolean => {
    if (!pathname) return false;
    const pathWithoutLocale = pathname.split('/').slice(2).join('/') || '/';
    const normalizedPath = path === '/' ? '/' : path.replace(/^\//, '');
    return pathWithoutLocale === normalizedPath;
  };

  // Navigation items with locale prefix
  const navItems = [
    { 
      name: t('home'), 
      path: '/',
      current: isActive('/') 
    },
    { 
      name: t('destinations'), 
      path: '/destinations',
      current: isActive('/destinations') 
    },
    { 
      name: t('tours'), 
      path: '/tours',
      current: isActive('/tours') 
    },
    { 
      name: t('accommodations'), 
      path: '/accommodations',
      current: isActive('/accommodations') 
    },
    { 
      name: t('blog'), 
      path: '/blog',
      current: isActive('/blog') 
    },
    { 
      name: t('contact'), 
      path: '/contact',
      current: isActive('/contact') 
    }
  ] as const;
  
  // Active link detection now works with the path directly
  // as Next.js handles the locale prefixing automatically

  // Check authentication status
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push(`/${locale}`);
    } catch (error) {
      // Log error in development only
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Error signing out:', error);
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme !== uiTheme) {
      toggleUITheme();
    }
  };

  // This function is no longer needed as we're using Link components directly
  // Keeping it commented in case it's needed in the future
  // const handleMobileLinkClick = (href: `/${string}`) => {
  //   closeMobileMenu();
  //   router.push(href);
  // };

  const isActiveLink = (navPath: string) => {
    if (!pathname) return 'text-foreground/80';
    // Remove locale prefix for comparison if present
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '') || '/';
    const normalizedPath = navPath === '/' ? '/' : navPath;
    
    const isActive = pathWithoutLocale === normalizedPath || 
                   (normalizedPath !== '/' && pathWithoutLocale.startsWith(normalizedPath));
    
    return isActive 
      ? 'text-primary font-medium border-b-2 border-primary' 
      : 'text-foreground/80 hover:text-primary transition-colors';
  };

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex w-full items-center justify-between">
          <Link href={`/${locale}`} className="flex-shrink-0">
            <span className="text-xl font-bold">Nyika Safaris</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="ml-10 hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors ${isActiveLink(item.path)}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="rounded-md p-2 hover:bg-muted"
                aria-label={t('themeToggle')}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <LanguageSwitcher />
            </div>
            
            {isAuthenticated ? (
              <div className="hidden items-center space-x-4 md:flex">
                <Link
                  href={`/${locale}/dashboard`}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {t('dashboard')}
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                >
                  {t('signOut')}
                </Button>
              </div>
            ) : (
              <div className="hidden items-center space-x-2 md:flex">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignIn}
                  className="text-sm font-medium"
                >
                  {t('signIn')}
                </Button>
                <Link 
                  href={`/register`}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  {t('signUp')}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-gray-200 dark:hover:bg-gray-800"
                aria-expanded={isMobileMenuOpen}
                aria-label={t('menuToggle')}
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
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
          {/* Main navigation items */}
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`block w-full rounded-md px-3 py-2 text-left text-base font-medium ${
                item.current
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
              aria-current={item.current ? 'page' : undefined}
              onClick={closeMobileMenu}
            >
              {item.name}
            </Link>
          ))}

          {/* Auth navigation items */}
          <div className="border-t border-gray-200 pb-3 pt-4 dark:border-gray-700">
            {isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  href={`/${locale}/dashboard`}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={closeMobileMenu}
                >
                  {t('dashboard')}
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  {t('signOut')}
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  href={`/${locale}/login`}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={closeMobileMenu}
                >
                  {t('signIn')}
                </Link>
                <Link
                  href={`/register`}
                  className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-base font-medium text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                  onClick={closeMobileMenu}
                >
                  {t('signUp')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
