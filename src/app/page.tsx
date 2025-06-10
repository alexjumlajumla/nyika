import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/routing';

export default function RootPage() {
  redirect(`/${defaultLocale}`);
  return null;
}

// Ensure this route is never cached or statically generated
export const dynamic = 'force-dynamic';
export const revalidate = 0;
