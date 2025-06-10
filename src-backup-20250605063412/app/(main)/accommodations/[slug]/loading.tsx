export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading skeleton for hero image */}
      <div className="h-96 animate-pulse bg-gray-200"></div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Left column loading */}
          <div className="space-y-8 lg:w-2/3">
            {/* Title and rating */}
            <div className="space-y-4">
              <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200"></div>
              <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200"></div>
            </div>
            
            {/* Description */}
            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200"></div>
            </div>
            
            {/* Amenities */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
              ))}
            </div>
            
            {/* Reviews */}
            <div className="space-y-6">
              <div className="h-6 w-1/4 animate-pulse rounded bg-gray-200"></div>
              {[1, 2, 3].map((item) => (
                <div key={item} className="space-y-3 border-b border-gray-100 pb-6">
                  <div className="flex items-center">
                    <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
                    <div className="ml-3 space-y-2">
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                      <div className="h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                    </div>
                  </div>
                  <div className="h-3 w-full animate-pulse rounded bg-gray-200"></div>
                  <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right column - Booking card loading */}
          <div className="lg:w-1/3">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="space-y-6">
                <div className="h-8 w-1/2 animate-pulse rounded bg-gray-200"></div>
                <div className="h-12 animate-pulse rounded bg-gray-200"></div>
                <div className="h-12 animate-pulse rounded bg-gray-200"></div>
                <div className="h-12 animate-pulse rounded bg-gray-200"></div>
                <div className="bg-safari-brown/80 h-12 animate-pulse rounded"></div>
                
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
                  <div className="mt-4 h-6 w-1/3 animate-pulse rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
