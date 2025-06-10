'use client';

import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Temporarily bypass all authentication and authorization checks
  return <>{children}</>;
}
