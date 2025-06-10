'use client';

import { useCallback, useEffect } from 'react';
import { useStore } from '@/store/useStore';

export function useMobileMenu() {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useStore();
  
  // Close menu when route changes
  const handleRouteChange = useCallback(() => {
    closeMobileMenu();
  }, [closeMobileMenu]);
  
  // Close menu when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const menu = document.getElementById('mobile-menu');
    const button = document.getElementById('mobile-menu-button');
    
    if (isMobileMenuOpen && menu && button && 
        !menu.contains(target) && !button.contains(target)) {
      closeMobileMenu();
    }
  }, [isMobileMenuOpen, closeMobileMenu]);
  
  // Close menu when pressing Escape key
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isMobileMenuOpen) {
      closeMobileMenu();
    }
  }, [isMobileMenuOpen, closeMobileMenu]);
  
  // Add event listeners
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleClickOutside, handleEscapeKey]);
  
  return {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    handleRouteChange,
  };
}
