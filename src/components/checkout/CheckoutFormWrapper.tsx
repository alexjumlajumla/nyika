'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const CheckoutForm = dynamic(
  () => import('./CheckoutForm').then((mod) => mod.CheckoutForm),
  {
    loading: () => (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    ),
  }
);

export function CheckoutFormWrapper() {
  return <CheckoutForm />;
}
