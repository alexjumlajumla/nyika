'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface RootLayoutWrapperProps {
  children: React.ReactNode;
  initialLanguage?: string;
}

export function RootLayoutWrapper({ children, initialLanguage = 'en' }: RootLayoutWrapperProps) {
  const { i18n } = useTranslation();
  const pathname = usePathname();
  
  // Update the HTML lang attribute when the language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language || initialLanguage;
  }, [i18n.language, initialLanguage]);

  return <>{children}</>;
}
