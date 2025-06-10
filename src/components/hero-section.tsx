import { HeroSearchButton } from './hero-search-button';

export function HeroSection() {
  return (
    <section className="relative flex h-[80vh] min-h-[600px] items-center justify-center overflow-hidden">
      {/* Background Image with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
        <img
          src="/images/hero/african-safari.jpg"
          alt="African Safari"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 text-center text-white">
        <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
          Discover the Magic of Africa
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-xl md:text-2xl">
          Experience the adventure of a lifetime with our handcrafted safari tours across Africa&apos;s most breathtaking landscapes.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <HeroSearchButton />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transform">
        <div className="animate-bounce">
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white">
            <div className="mt-2 h-2 w-1 animate-pulse rounded-full bg-white" />
          </div>
        </div>
      </div>
    </section>
  );
}
