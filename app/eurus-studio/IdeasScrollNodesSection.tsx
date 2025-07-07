'use client';

import React, { useRef } from 'react';

export default function IdeasScrollNodesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);
  const [focusedSection, setFocusedSection] = React.useState(0); // 0 = Inspire, 1 = Refine, 2 = Craft

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
        
        // Determine which section should be focused based on scroll progress
        if (progress < 0.33) {
          setFocusedSection(0); // Inspire
        } else if (progress < 0.66) {
          setFocusedSection(1); // Refine
        } else {
          setFocusedSection(2); // Craft
        }
      } else if (sectionTop >= windowHeight) {
        setProgress(0);
        setFocusedSection(0); // Default to Inspire
      } else if (sectionBottom <= 0) {
        setProgress(1);
        setFocusedSection(2); // Default to Craft when fully scrolled
      }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const sections = [
    {
      id: 0,
      title: "Inspire",
      image: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/oldman1.png",
      alt: "Old Man 1",
      isVideo: false
    },
    {
      id: 1,
      title: "Refine",
      image: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/oldman2.jpg",
      alt: "Old Man 2",
      isVideo: false
    },
    {
      id: 2,
      title: "Craft",
      image: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/oldman3.mp4",
      alt: "Old Man 3",
      isVideo: true
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="w-screen bg-black flex flex-col items-center justify-center p-0 m-0"
      style={{ minHeight: '100vh', padding: '2rem 0', margin: 0 }}
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 sm:mb-8 mt-0 text-center text-white px-4" style={{ fontFamily: 'var(--font-sf-pro)' }}>
        Ideas don't wait. Neither should you.
      </h2>
      <div className="relative w-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 h-auto sm:h-[60vh] px-4 sm:px-6 md:px-8">
        {sections.map((section, idx) => (
          <div 
            key={section.id}
            className="transition-all duration-700 ease-in-out flex flex-col items-center mb-6 sm:mb-0" 
            style={{ 
              opacity: focusedSection === idx ? 1 : 0.4,
              transform: focusedSection === idx ? 'scale(1.05)' : 'scale(0.95)',
              filter: focusedSection === idx ? 'brightness(1.1)' : 'brightness(0.7)'
            }}
          >
            <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 flex items-center justify-center">
              {section.isVideo ? (
                <video
                  src={section.image}
                  className="w-full h-full object-cover rounded-xl border-2 border-white shadow-2xl"
                  style={{
                    borderColor: focusedSection === idx ? '#fbbf24' : '#ffffff',
                    borderWidth: focusedSection === idx ? '4px' : '2px',
                    boxShadow: focusedSection === idx 
                      ? '0 25px 50px -12px rgba(251, 191, 36, 0.5)' 
                      : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={section.image}
                  alt={section.alt}
                  className="w-full h-full object-cover rounded-xl border-2 border-white shadow-2xl"
                  style={{
                    borderColor: focusedSection === idx ? '#fbbf24' : '#ffffff',
                    borderWidth: focusedSection === idx ? '4px' : '2px',
                    boxShadow: focusedSection === idx 
                      ? '0 25px 50px -12px rgba(251, 191, 36, 0.5)' 
                      : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                />
              )}
            </div>
            <span 
              className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl font-semibold transition-all duration-500"
              style={{
                color: focusedSection === idx ? '#fbbf24' : '#ffffff90',
                fontSize: focusedSection === idx ? 'clamp(1.1rem, 2.5vw, 1.25rem)' : 'clamp(1rem, 2vw, 1.125rem)',
                fontWeight: focusedSection === idx ? '700' : '600'
              }}
            >
              {section.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
} 