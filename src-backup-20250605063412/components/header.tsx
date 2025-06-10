'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import { useMobileMenu } from '@/hooks/useMobileMenu';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CurrencySwitcher } from './CurrencySwitcher';
import { Menu, X, User, LogIn, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  lang: string;
}

export function Header({ lang: initialLang }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const lang = pathname?.split('/')[1] || initialLang || 'en';
  
  const navigation = [
    { name: 'Home', href: `/${lang}` },
    { name: 'Destinations', href: `/${lang}/destinations` },
    { name: 'Tours', href: `/${lang}/tours` },
    { name: 'Accommodations', href: `/${lang}/accommodations` },
    { name: 'About Us', href: `/${lang}/about` },
    { name: 'Blog', href: `/${lang}/blog` },
    { name: 'Contact', href: `/${lang}/contact` },
  ];

  const { isAuthenticated, session, isLoading } = useAuth();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, handleRouteChange } = useMobileMenu();
  const [isScrolled, setIsScrolled] = useState(false);
  
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push(`/${lang}`);
    router.refresh();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  return (
    <header 
      className={cn(
        'fixed w-full z-50 transition-all duration-300',
        isScrolled ? 'bg-background/90 backdrop-blur-sm shadow-sm py-2' : 'bg-background/80 py-4',
        'border-b border-border/40'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex h-12 items-center justify-between md:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2"
              onClick={handleRouteChange}
            >
              <span className="from-primary-600 to-accent-500 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
                Nyika Safaris
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-1 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground/80',
                  'hover:bg-accent/50'
                )}
                onClick={handleRouteChange}
              >
                {item.name}
              </Link>
            ))}
            <Button 
              asChild
              className="ml-4 bg-primary text-white hover:bg-primary/90"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>

          {/* Right side - Theme Toggle, Language, Currency and Mobile Menu */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <LanguageSwitcher />
              <CurrencySwitcher />
              {isLoading ? (
                <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
              ) : isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                        <AvatarFallback>
                          {session?.user?.name?.charAt(0) || <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session?.user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/dashboard">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem 
                      className="cursor-pointer text-destructive"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-2"
                  onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </Button>
              )}
            </div>
            <Button size="sm" className="ml-2 hidden sm:flex">
              Book Now
            </Button>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="focus:ring-primary-500 inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden absolute top-full left-0 right-0 bg-background shadow-lg transition-all duration-300 overflow-hidden',
          isMobileMenuOpen ? 'max-h-96 border-t border-border' : 'max-h-0'
        )}
      >
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'block px-3 py-2 rounded-md text-base font-medium',
                pathname === item.href
                  ? 'bg-accent/50 text-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                'transition-colors'
              )}
              onClick={handleRouteChange}
            >
              {item.name}
            </Link>
          ))}
          <div className="space-y-2 pt-2">
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => signIn()}
            >
              Sign In
            </Button>
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => signIn()}
            >
              Sign Up
            </Button>
            <Button 
              asChild
              variant="ghost"
              className="w-full"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
