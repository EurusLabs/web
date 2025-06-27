"use client"

import React from 'react';

export function EurusStudiosSection() {
  return (
    <div className="bg-black text-white py-24 px-6 md:px-12 lg:px-24 scroll-snap-section">
      <div className="text-center mb-8">
        <h2 className="text-lg font-medium text-gray-400 tracking-widest uppercase">Eurus Studios</h2>
        <h1 className="text-5xl md:text-7xl font-bold mt-4">For anyone with a story to tell.</h1>
      </div>

      <div className="relative max-w-5xl mx-auto my-16 rounded-2xl overflow-hidden shadow-2xl">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/eurusstudio.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <button className="bg-white/10 backdrop-blur-md text-white font-semibold py-3 px-6 rounded-full border border-white/20 hover:bg-white/20 transition-all">
            Learn More
          </button>
        </div>
      </div>

      <div className="text-center max-w-3xl mx-auto">
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
          Eurus Studios is the Cursor for Media. Our flagship product unifies the best AI models into a seamless interface, empowering creators to produce high-quality, studio-grade videos with ease.
        </p>
      </div>
    </div>
  );
} 