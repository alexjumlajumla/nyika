'use client';

import dynamic from 'next/dynamic';
import { Tour, ToursListClientProps } from './ToursListClient';
import SkeletonList from './SkeletonList';

interface ToursListWrapperProps {
  initialTours: Tour[];
}

// This is a client component that wraps the dynamic import
export default function ToursListWrapper({ initialTours }: ToursListWrapperProps) {
  const ToursListClient = dynamic<ToursListClientProps>(
    async () => {
      const mod = await import('./ToursListClient.tsx');
      // Use double assertion to handle the component type
      const Component = mod.default as unknown as React.ComponentType<ToursListClientProps>;
      return { default: Component };
    },
    {
      ssr: false,
      loading: () => <SkeletonList />,
    }
  );

  return <ToursListClient initialTours={initialTours} />;
}
