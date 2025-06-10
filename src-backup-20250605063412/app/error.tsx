'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-red-600">Something went wrong!</h2>
        <p className="mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
