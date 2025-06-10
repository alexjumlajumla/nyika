'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogIn, LogOut, Globe, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { CurrencySwitcher } from '@/components/currency-switcher';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import type { Route } from 'next';
import { supabase } from '@/lib/supabase/client';
import type { NavItem, User } from '@/types/navigation';

export interface MobileMenuProps {
  navigation: NavItem[];
  user: User | null;
}

export function MobileMenu({ navigation, user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = '/';
    } catch {
      // Handle sign out error silently
      // In production, you might want to show a user-friendly error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="relative z-50"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background p-4 pt-20">
          <nav className="flex w-full flex-col items-center space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href as Route}
                className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-foreground/90 hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-8 flex w-full max-w-xs flex-col items-center space-y-6">
            {/* Language and Currency Switchers */}
            <div className="w-full space-y-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>Language</span>
              </div>
              <div className="w-full">
                <LanguageSwitcher />
              </div>
            </div>
            
            <div className="w-full space-y-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Currency</span>
              </div>
              <div className="w-full">
                <CurrencySwitcher />
              </div>
            </div>
            
            <div className="w-full pt-2">
              <ThemeToggle />
            </div>

            {user ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSignOut}
                disabled={isLoading}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </Button>
            ) : (
              <Button asChild variant="outline" className="w-full">
                <Link href={`/${locale}/signin`}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

