'use client';

import { ReactNode } from 'react';

interface SessionProviderProps {
  children: ReactNode;
  // Add any session-related props you need here
}

export default function SessionProvider({ children }: SessionProviderProps) {
  // If you need to implement session handling later, you can add it here
  return <>{children}</>;
}
