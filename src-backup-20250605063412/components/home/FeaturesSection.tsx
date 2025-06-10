import { FaMapMarkedAlt, FaCamera, FaTree, FaUtensils } from 'react-icons/fa';

const features = [
  {
    name: 'Expert Guides',
    description: 'Our experienced guides have extensive knowledge of African wildlife and ecosystems.',
    icon: FaMapMarkedAlt,
  },
  {
    name: 'Photography',
    description: 'Perfect opportunities for wildlife photography with guidance from our experts.',
    icon: FaCamera,
  },
  {
    name: 'Conservation',
    description: 'Committed to sustainable tourism and wildlife conservation efforts.',
    icon: FaTree,
  },
  {
    name: 'Gourmet Dining',
    description: 'Enjoy delicious meals prepared with local ingredients in stunning locations.',
    icon: FaUtensils,
  },
];

export function FeaturesSection() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Why Choose Nyika Safaris?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
            Experience the best of Africa with our carefully crafted safari adventures.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <feature.icon className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">{feature.name}</h3>
                <p className="mt-2 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
