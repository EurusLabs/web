'use client';

import React, { useRef } from 'react';

export default function IdeasScrollNodesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    function onScroll() {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      // Calculate scroll progress through the section
      if (sectionTop < windowHeight && sectionBottom > 0) {
        const scrolled = windowHeight - sectionTop;
        const progress = Math.max(0, Math.min(1, scrolled / (sectionHeight + windowHeight)));
        setProgress(progress);
      } else if (sectionTop >= windowHeight) {
        setProgress(0);
      } else if (sectionBottom <= 0) {
        setProgress(1);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Node reveals
  const node1 = Math.min(1, progress * 2);
  const node2 = Math.max(0, Math.min(1, (progress - 0.4) * 2));
  const node3 = Math.max(0, Math.min(1, (progress - 0.7) * 3));

  return (
    <section
      ref={sectionRef}
      className="w-screen bg-black flex flex-col items-center justify-center p-0 m-0"
      style={{ minHeight: '100vh', padding: 0, margin: 0 }}
    >
      <h2 className="text-4xl md:text-5xl font-extrabold mb-8 mt-0 text-center text-white" style={{ fontFamily: 'var(--font-sf-pro)' }}>
        Ideas don't wait. Neither should you.
      </h2>
      <div className="relative w-full flex flex-row items-center justify-center gap-8 h-[60vh]">
        {/* Node 1: Always visible */}
        <div className="transition-all duration-500 flex flex-col items-center" style={{ opacity: 1, transform: 'scale(1)' }}>
          <div className="w-80 h-80 flex items-center justify-center">
            <img
              src="https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/oldman1.png"
              alt="Old Man 1"
              className="w-full h-full object-cover rounded-xl border-2 border-white shadow-2xl"
            />
          </div>
          <span className="mt-4 text-lg font-semibold text-white/90">Inspire</span>
        </div>
        {/* Node 2: Always visible */}
        <div className="transition-all duration-500 flex flex-col items-center" style={{ opacity: 1, transform: 'scale(1)' }}>
          <div className="w-80 h-80 flex items-center justify-center">
            <img
              src="https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/oldman2.jpg"
              alt="Old Man 2"
              className="w-full h-full object-cover rounded-xl border-2 border-white shadow-2xl"
            />
          </div>
          <span className="mt-4 text-lg font-semibold text-white/90">Refine</span>
        </div>
        {/* Node 3: Always visible (video) */}
        <div className="transition-all duration-500 flex flex-col items-center" style={{ opacity: 1, transform: 'scale(1)' }}>
          <div className="w-80 h-80 flex items-center justify-center">
            <video
              src="https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/oldman3.mp4"
              className="w-full h-full object-cover rounded-xl border-2 border-white shadow-2xl"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          <span className="mt-4 text-lg font-semibold text-white/90">Craft</span>
        </div>
      </div>
    </section>
  );
} 