'use client';

import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function HeroSearchButton() {
  const router = useRouter();

  return (
    <Button 
      size="lg" 
      className="bg-primary px-8 py-6 text-lg text-white hover:bg-primary/90"
      onClick={() => router.push('/tours')}
    >
      <Search className="mr-2 h-5 w-5" />
      Explore Tours
    </Button>
  );
}
