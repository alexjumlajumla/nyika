'use client';

import React from 'react';
import { FiSearch } from 'react-icons/fi';

const Hero = () => {
  return (
    <section className="bg-gradient(135deg, #1e3a8a 0%, #1e40af 100%) relative flex h-[80vh] min-h-[600px] items-center justify-center overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="container z-10 mx-auto px-4 text-center text-white">
        <h1 className="mb-6 text-4xl font-bold md:text-6xl">
          Discover the Magic of Africa
        </h1>
        <p className="mx-auto mb-12 max-w-3xl text-xl md:text-2xl">
          Experience the adventure of a lifetime with our exclusive safari tours and travel packages
        </p>
        
        <div className="mx-auto max-w-4xl rounded-2xl bg-white/10 p-1 backdrop-blur-sm">
          <div className="rounded-xl bg-gradient-to-r from-primary/80 to-secondary/80 p-1">
            <div className="rounded-lg bg-white/90 p-6 backdrop-blur-sm">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <label className="mb-1 block text-left text-sm font-medium text-gray-700">Destination</label>
                  <select className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary">
                    <option>Select Destination</option>
                    <option>Tanzania</option>
                    <option>Kenya</option>
                    <option>Rwanda</option>
                    <option>Uganda</option>
                    <option>South Africa</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-left text-sm font-medium text-gray-700">Travel Date</label>
                  <input 
                    type="date" 
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex items-end">
                  <button className="flex h-[42px] items-center gap-2 rounded-md bg-primary px-6 py-2 text-white transition-colors hover:bg-primary/90">
                    <FiSearch className="h-5 w-5" />
                    Search Tours
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {['Safari Tours', 'Beach Holidays', 'Mountain Climbing', 'Cultural Tours'].map((tag, index) => (
            <span 
              key={index}
              className="inline-block cursor-pointer rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform">
        <div className="flex h-12 w-8 justify-center rounded-full border-2 border-white/50 p-1">
          <div className="h-2 w-1 animate-bounce rounded-full bg-white"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
