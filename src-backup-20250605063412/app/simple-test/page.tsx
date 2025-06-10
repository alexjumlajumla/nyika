export default function SimpleTest() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">Simple Test Page</h1>
        <p className="mb-6 text-gray-600">If you can see this, routing is working!</p>
        <div className="text-sm text-gray-500">
          <p>Try navigating to:</p>
          <ul className="mt-2 space-y-1">
            <li><a href="/en" className="text-blue-500 hover:underline">/en</a> - English home</li>
            <li><a href="/sw" className="text-blue-500 hover:underline">/sw</a> - Swahili home</li>
            <li><a href="/de" className="text-blue-500 hover:underline">/de</a> - German home</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
