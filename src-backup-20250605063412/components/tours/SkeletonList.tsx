export default function SkeletonList() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-xl bg-white shadow">
          <div className="h-48 bg-gray-200" />
          <div className="space-y-2 p-4">
            <div className="h-6 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-1/2 rounded bg-gray-200" />
            <div className="bg-safari-brown/10 h-10 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
