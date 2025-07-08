'use client';

import React, { useRef } from 'react';

export default function IdeasScrollNodesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);
  const [focusedSection, setFocusedSection] = React.useState(0); // 0 = Inspire, 1 = Refine, 2 = Craft
  const [isScrollLocked, setIsScrollLocked] = React.useState(false);
  const [hasCompletedSequence, setHasCompletedSequence] = React.useState(false);
  const [wheelAccumulator, setWheelAccumulator] = React.useState(0);
  const isTransitioning = React.useRef(false);
  const touchStartY = React.useRef(0);
  const touchAccumulator = React.useRef(0);

  React.useEffect(() => {
    function onScroll() {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      
      // Check if section is in viewport
      const isInViewport = sectionTop < windowHeight && sectionBottom > 0;
      
      // More precise viewport detection - section should be prominently visible
      const isProminentlyVisible = sectionTop < windowHeight * 0.5 && sectionBottom > windowHeight * 0.5;
      
      if (isProminentlyVisible && !hasCompletedSequence) {
        // Section is prominently in view and sequence hasn't completed - lock scrolling
        setIsScrollLocked(true);
      } else if (!isProminentlyVisible || hasCompletedSequence) {
        // Section is not prominently visible or sequence completed - unlock scrolling
        setIsScrollLocked(false);
        
        // Reset sequence if we've scrolled away from the section
        if (!isInViewport && hasCompletedSequence) {
          setHasCompletedSequence(false);
          setFocusedSection(0);
        }
      }
    }

    function handleTransition(direction: number) {
      if (direction > 0) {
        // Scrolling down
        if (focusedSection < 2) {
          isTransitioning.current = true;
          setFocusedSection(prev => prev + 1);
          
          // Clear transition flag after animation
          setTimeout(() => {
            isTransitioning.current = false;
          }, 700); // Match transition duration
        } else if (focusedSection === 2) {
          // We're at Craft and user is scrolling down - complete sequence and unlock
          setTimeout(() => {
            setHasCompletedSequence(true);
            setIsScrollLocked(false);
          }, 300); // Small delay before allowing scroll
        }
      } else {
        // Scrolling up
        if (focusedSection > 0) {
          isTransitioning.current = true;
          setFocusedSection(prev => prev - 1);
          
          // Clear transition flag after animation
          setTimeout(() => {
            isTransitioning.current = false;
          }, 700);
        }
      }
    }

    function onWheel(e: WheelEvent) {
      if (!sectionRef.current || !isScrollLocked) return;
      
      // Prevent default scrolling when section is locked
      e.preventDefault();
      e.stopPropagation();
      
      // Don't process wheel events during transitions
      if (isTransitioning.current) return;
      
      // Accumulate wheel delta for more precise control
      const newAccumulator = wheelAccumulator + e.deltaY;
      setWheelAccumulator(newAccumulator);
      
      // Threshold for triggering transitions (adjust for sensitivity)
      const threshold = 80; // Slightly more sensitive
      
      if (Math.abs(newAccumulator) > threshold) {
        const direction = newAccumulator > 0 ? 1 : -1;
        
        // Reset accumulator
        setWheelAccumulator(0);
        
        // Handle transitions
        handleTransition(direction);
      }
    }

    function onTouchStart(e: TouchEvent) {
      if (!sectionRef.current || !isScrollLocked) return;
      touchStartY.current = e.touches[0].clientY;
      touchAccumulator.current = 0;
    }

    function onTouchMove(e: TouchEvent) {
      if (!sectionRef.current || !isScrollLocked) return;
      
      // Prevent default scrolling when section is locked
      e.preventDefault();
      e.stopPropagation();
      
      // Don't process touch events during transitions
      if (isTransitioning.current) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY.current - currentY;
      touchAccumulator.current += deltaY;
      touchStartY.current = currentY;
      
      // Threshold for triggering transitions on touch
      const threshold = 40; // More sensitive for touch
      
      if (Math.abs(touchAccumulator.current) > threshold) {
        const direction = touchAccumulator.current > 0 ? 1 : -1;
        
        // Reset accumulator
        touchAccumulator.current = 0;
        
        // Handle transitions
        handleTransition(direction);
      }
    }

    function onTouchEnd(e: TouchEvent) {
      if (!sectionRef.current || !isScrollLocked) return;
      touchAccumulator.current = 0;
    }

    function onKeyDown(e: KeyboardEvent) {
      if (!sectionRef.current || !isScrollLocked) return;
      
      // Don't process key events during transitions
      if (isTransitioning.current) return;
      
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleTransition(1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handleTransition(-1);
      }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: false });
    window.addEventListener('keydown', onKeyDown, { passive: false });
    onScroll();
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isScrollLocked, hasCompletedSequence, wheelAccumulator, focusedSection]);

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
      className="w-screen bg-black flex flex-col items-center justify-center p-0 m-0 relative"
      style={{ minHeight: '100vh', padding: '2rem 0', margin: 0 }}
    >
      {/* Scroll indicator */}
      {isScrollLocked && (
        <div className="fixed top-1/2 right-8 transform -translate-y-1/2 z-50 flex flex-col items-center space-y-2">
          <div className="text-white/60 text-sm font-medium" style={{ fontFamily: 'var(--font-sf-pro)' }}>
            Scroll to explore
          </div>
          <div className="flex flex-col space-y-1">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  focusedSection === idx ? 'bg-yellow-400' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      )}
      
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 sm:mb-8 md:mb-10 leading-tight text-center" style={{ fontFamily: 'var(--font-sf-pro)' }}>
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