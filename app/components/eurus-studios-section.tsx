"use client"

import React from 'react';

export function EurusStudiosSection() {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col justify-center items-center scroll-snap-section">
      <div className="flex flex-col justify-center items-center w-full max-w-4xl mx-auto h-full gap-8 px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center whitespace-nowrap" style={{ fontFamily: 'var(--font-sf-pro)' }}>
          For anyone with a story to tell.
        </h1>
        <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-2xl flex justify-center items-center">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/home page video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-center" style={{ fontFamily: 'var(--font-sf-pro)' }}>
          Introducing Eurus Studio.
        </h2>
        <a href="https://studio.euruslabs.com/" target="_blank" rel="noopener noreferrer" className="text-base font-medium text-foreground bg-card/40 px-6 py-2 rounded-full flex items-center justify-center mx-auto hover:bg-card/60 transition-all no-underline" style={{ fontFamily: 'var(--font-sf-pro)' }}>
          Try Studio
        </a>
      </div>
    </div>
  );
} 