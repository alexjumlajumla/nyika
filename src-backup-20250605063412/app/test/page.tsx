'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">Test Page</h1>
    </div>
  );
}
