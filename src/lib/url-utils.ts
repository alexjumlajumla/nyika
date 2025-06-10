import { usePathname } from 'next/navigation';

export function useLocale() {
  const pathname = usePathname();
  return pathname?.split('/')[1] || 'en';
}

export function getLocalizedPath(path: string, locale?: string) {
  const loc = locale || (typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'en');
  return `/${loc}${path}`;
}

export function getDashboardPath(user?: { 
  user_metadata?: { role?: string }, 
  email?: string | null,
  role?: string 
}) {
  if (!user) return '/auth/signin';
  
  // Check for role in different possible locations
  const role = user.role || user.user_metadata?.role;
  const email = user.email || '';
  
  const isAdmin = role === 'super_admin' || role === 'admin' || 
                 email.endsWith('@nyikasafaris.com') ||
                 email.endsWith('@shadows-of-africa.com');
                 
  return isAdmin ? '/admin/dashboard' : '/account/dashboard';
}
