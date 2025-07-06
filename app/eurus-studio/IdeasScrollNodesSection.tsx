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
      // Section is pinned when its top is at 0 and bottom is below the viewport
      if (rect.top <= 0 && rect.bottom > windowHeight) {
        // Calculate progress through the section
        const total = rect.height - windowHeight;
        const scrolled = -rect.top;
        setProgress(Math.max(0, Math.min(1, scrolled / total)));
      } else if (rect.top > 0) {
        setProgress(0);
      } else if (rect.bottom <= windowHeight) {
        setProgress(1);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Calculate reveal for each node based on progress
  // Node 1: 0 - 1/3, Node 2: 1/3 - 2/3, Node 3: 2/3 - 1
  const node1 = Math.min(1, progress * 3);
  const node2 = Math.max(0, Math.min(1, (progress - 1/3) * 3));
  const node3 = Math.max(0, Math.min(1, (progress - 2/3) * 3));

  return (
    <section
      ref={sectionRef}
      className="w-screen bg-black flex flex-col items-center justify-center p-0 m-0"
      style={{ height: '200vh', paddingTop: 0, paddingBottom: 0 }}
    >
      <div
        className="sticky top-0 left-0 w-full h-screen flex flex-col items-center justify-center z-10 bg-black"
        style={{ minHeight: '100vh' }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 mt-0 text-center text-white" style={{ fontFamily: 'var(--font-sf-pro)' }}>
          Ideas don't wait. Neither should you.
        </h2>
        <div className="relative w-full flex flex-row items-center justify-center gap-8 h-[60vh]">
          {/* Node 1: Fades in first */}
          <div
            className="transition-all duration-500"
            style={{ width: 320, height: 320, opacity: node1, transform: `scale(${0.75 + 0.25 * node1})` }}
          >
            <img
              src="https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/oldman1.png"
              alt="Old Man 1"
              className="w-full h-full object-cover rounded-xl border-2 border-white shadow-2xl"
            />
          </div>
          {/* Node 2: Fades in second */}
          <div
            className="transition-all duration-500"
            style={{ width: 320, height: 320, opacity: node2, transform: `scale(${0.75 + 0.25 * node2})` }}
          >
            <img
              src="https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/oldman2.jpg"
              alt="Old Man 2"
              className="w-full h-full object-cover rounded-xl border-2 border-white shadow-2xl"
            />
          </div>
          {/* Node 3: Fades in third */}
          <div
            className="transition-all duration-500"
            style={{ width: 320, height: 320, opacity: node3, transform: `scale(${0.75 + 0.25 * node3})` }}
          >
            <video
              src="https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/oldman3.mp4"
              className="w-full h-full object-cover rounded-xl border-2 border-white shadow-2xl"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </div>
    </section>
  );
} 