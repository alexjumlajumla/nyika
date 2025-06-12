import { useState, useCallback, useEffect } from 'react';

export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const [isVisible, setIsVisible] = useState(initialState);
  const [isMounted, setIsMounted] = useState(initialState);

  const open = useCallback(() => {
    setIsMounted(true);
    requestAnimationFrame(() => {
      setIsVisible(true);
      setIsOpen(true);
    });
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    // Wait for the animation to complete before unmounting
    const timer = setTimeout(() => {
      setIsOpen(false);
      setIsMounted(false);
    }, 300); // Match this with your CSS transition duration

    return () => clearTimeout(timer);
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  return {
    isOpen,
    isVisible,
    isMounted,
    open,
    close,
    toggle,
  };
}

export default useModal;
