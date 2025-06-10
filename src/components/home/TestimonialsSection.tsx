const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Wildlife Photographer',
    content:
      'The Great Migration tour was a once-in-a-lifetime experience. Our guide was incredibly knowledgeable and helped us capture amazing shots of the wildlife.',
    image: '/testimonials/sarah.jpg',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Travel Enthusiast',
    content:
      'Nyika Safaris exceeded all our expectations. The luxury lodges were stunning, and the game drives were well-organized. We saw the Big Five!',
    image: '/testimonials/michael.jpg',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Family Traveler',
    content:
      'Traveling with kids can be challenging, but Nyika Safaris made it easy. Our children loved learning about the animals, and the guides were fantastic with them.',
    image: '/testimonials/emily.jpg',
  },
];

export function TestimonialsSection() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Guests Say
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
            Don't just take our word for it. Here's what our guests have to say about their experiences.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-lg bg-gray-50 p-8 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <div className="relative">
                <div className="absolute -top-12 left-0 right-0 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-indigo-100">
                    <svg
                      className="h-12 w-12 text-indigo-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <blockquote className="mt-10">
                  <div className="text-lg font-medium text-gray-700">
                    <p>"{testimonial.content}"</p>
                  </div>
                  <footer className="mt-6">
                    <p className="text-base font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-base text-indigo-600">{testimonial.role}</p>
                  </footer>
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
