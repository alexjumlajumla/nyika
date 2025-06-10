import Link from 'next/link';
import Image from 'next/image';

const tours = [
  {
    id: 1,
    name: 'Great Migration Safari',
    duration: '7 Days',
    price: '$3,999',
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    href: '/tours/great-migration',
  },
  {
    id: 2,
    name: 'Luxury Tanzania Safari',
    duration: '10 Days',
    price: '$5,499',
    image: 'https://images.unsplash.com/photo-1506929562872-b5415f729582?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    href: '/tours/luxury-tanzania',
  },
  {
    id: 3,
    name: 'Kenya Wildlife Adventure',
    duration: '8 Days',
    price: '$4,299',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
    href: '/tours/kenya-wildlife',
  },
];

export function PopularTours() {
  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Popular Safari Tours
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
            Discover our most sought-after safari experiences in East Africa.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={tour.image}
                  alt={tour.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{tour.name}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-medium text-indigo-600">{tour.duration}</span>
                  <span className="font-bold text-gray-900">{tour.price}</span>
                </div>
                <div className="mt-6">
                  <Link
                    href={tour.href}
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                  >
                    View Tour
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/tours"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-6 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-200"
          >
            View All Tours
          </Link>
        </div>
      </div>
    </div>
  );
}
