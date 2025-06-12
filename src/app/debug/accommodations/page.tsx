'use client';

import { useEffect, useState } from 'react';

export default function DebugAccommodations() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use absolute URL to avoid locale issues
        const response = await fetch('/api/debug/accommodations');
        if (!response.ok) {
          throw new Error('Failed to fetch debug data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading debug data...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Accommodations Debug</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Accommodations ({data?.accommodations?.length || 0})</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(data?.accommodations, null, 2)}
        </pre>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Rooms ({data?.rooms?.length || 0})</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(data?.rooms, null, 2)}
        </pre>
      </div>
    </div>
  );
}
