'use client';

import React, { useState, useRef } from 'react';

export default function IdeasScrollNodesSection() {
  const [step, setStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const progress = scrollTop / (scrollHeight - clientHeight);
    if (progress < 1/3) {
      setStep(0);
    } else if (progress < 2/3) {
      setStep(1);
    } else {
      setStep(2);
    }
  }

  return (
    <section className="w-screen bg-black flex flex-col items-center justify-start overflow-hidden p-0 m-0" style={{ height: '100vh', paddingTop: '7vh', paddingBottom: '2vh' }}>
      <h2 className="text-4xl md:text-5xl font-extrabold mb-8 mt-0 text-center text-white" style={{ fontFamily: 'var(--font-sf-pro)' }}>
        Ideas don't wait. Neither should you.
      </h2>
      {/* Scrollable Node Reveal Area */}
      <div
        ref={scrollRef}
        className="w-full max-w-5xl h-[60vh] overflow-y-scroll mx-auto"
        style={{ WebkitOverflowScrolling: 'touch', background: 'transparent', marginBottom: 0, paddingBottom: 0 }}
        onScroll={handleScroll}
      >
        <div style={{ height: '180vh', position: 'relative', marginBottom: 0, paddingBottom: 0 }}>
          <div className="sticky top-0 left-0 w-full h-[60vh] flex items-center justify-center z-10">
            <div className="relative w-full flex items-center justify-center gap-8">
              {/* Node 1: Squarish rectangle */}
              <div
                className={`transition-all duration-700 ${
                  step >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
                style={{ width: 320, height: 320 }}
              >
                <img
                  src="/images/oldman1.png"
                  alt="Old Man 1"
                  className="w-full h-full object-cover rounded-xl border-2 border-white shadow-2xl"
                />
              </div>
              {/* Node 2: Squarish rectangle */}
              <div
                className={`transition-all duration-700 ${
                  step >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
                style={{ width: 320, height: 320 }}
              >
                <img
                  src="/images/oldman2.jpg"
                  alt="Old Man 2"
                  className="w-full h-full object-cover rounded-xl border-2 border-white shadow-2xl"
                />
              </div>
              {/* Node 3: Squarish rectangle */}
              <div
                className={`transition-all duration-700 ${
                  step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
                style={{ width: 320, height: 320 }}
              >
                <video
                  src="/images/oldman3.mp4"
                  className="w-full h-full object-cover rounded-xl border-2 border-white shadow-2xl"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 