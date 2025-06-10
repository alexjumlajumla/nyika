'use client';

import Link from 'next/link';
import { Button } from '../ui/button';

export function CallToAction() {
  return (
    <section className="relative bg-amber-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-500 opacity-10" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ready for an Unforgettable Safari Experience?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-700">
            Let our expert guides take you on a journey through Africa's most breathtaking
            landscapes and wildlife encounters.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              className="bg-amber-600 px-8 py-6 text-base font-medium text-white hover:bg-amber-700 sm:px-10"
            >
              <Link href="/tours">Explore Our Safaris</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-amber-700 px-8 py-6 text-base font-medium text-amber-700 hover:bg-amber-50 sm:px-10"
            >
              <Link href="/contact">Contact Our Experts</Link>
            </Button>
          </div>
          <div className="mt-8">
            <p className="text-base text-gray-600">
              Need help? Call our safari specialists at{' '}
              <a
                href="tel:+255123456789"
                className="font-medium text-amber-700 hover:text-amber-600"
              >
                +255 123 456 789
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
