'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export function useMobileMenu() {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useStore();
  
  // Close menu when route changes
  const handleRouteChange = () => {
    closeMobileMenu();
  };
  
  // Close menu when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const menu = document.getElementById('mobile-menu');
    const button = document.getElementById('mobile-menu-button');
    
    if (isMobileMenuOpen && menu && button && 
        !menu.contains(target) && !button.contains(target)) {
      closeMobileMenu();
    }
  };
  
  // Close menu when pressing Escape key
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isMobileMenuOpen) {
      closeMobileMenu();
    }
  };
  
  // Add event listeners
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMobileMenuOpen]);
  
  return {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    handleRouteChange,
  };
}
