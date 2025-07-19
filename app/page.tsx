"use client"

import React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import Navigation from "./components/navigation"
import Link from "next/link"
import { EurusStudiosSection } from "@/app/components/eurus-studios-section"
import NoSsr from "./components/NoSsr"
import { publicationsData } from "@/components/publications-data"

export default function Home() {
  return (
    <NoSsr>
      <Navigation forceWhite />
      <HomePage />
    </NoSsr>
  )
}

function HomePage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const blobVideoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Add these new state variables after the existing ones
  const [blobSize, setBlobSize] = useState({ width: 180, height: 180 })
  const [blobVariation, setBlobVariation] = useState("blob-variation-1")
  const [isBlobHidden, setIsBlobHidden] = useState(false)

  // Add rotating professions state
  const [currentProfessionIndex, setCurrentProfessionIndex] = useState(0)
  const professions = [
    "Podcasters",
    "Game Designers",
    "Filmmakers",
    "Influencers",
    "Graphic Designers",
    "Composers",
    "VFX Creators",
    "Storytellers",
  ]

  // Add client testimonials state
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)
  const testimonials = [
    {
      quote: "Eurus Labs transformed our content creation process. The AI tools are incredible!",
      name: "Sarah Chen",
      image: "/placeholder-user.jpg",
      position: "bottom-8 right-8",
    },
    {
      quote: "The creative possibilities are endless with Eurus. It's like having a whole team.",
      name: "Marcus Rodriguez",
      image: "/person.jpg",
      position: "top-24 left-8",
    },
    {
      quote: "Finally, a platform that understands what creators actually need. Game changer!",
      name: "Emily Johnson",
      image: "/placeholder-user.jpg",
      position: "bottom-8 left-8",
    },
    {
      quote: "Our productivity has increased 300% since we started using Eurus products.",
      name: "Alex Thompson",
      image: "/person.jpg",
      position: "top-24 right-8",
    },
    {
      quote: "Working with Eurus has revolutionized how we approach storytelling and content.",
      name: "Maya Patel",
      image: "/placeholder-user.jpg",
      position: "bottom-1/3 right-1/3",
    },
  ]

  const homeVideos = ["/videos/home1.mp4", "/videos/home2.mp4", "/videos/home3.mp4", "/videos/home4.mp4"]

  const podcasters = [
    { name: "Alex Thompson", show: "The Daily Insight", video: "/videos/1.mp4" },
    { name: "Sophia Chen", show: "Literary Legends", video: "/videos/2.mp4" },
    { name: "Emma Rodriguez", show: "Urban Perspectives", video: "/videos/3.mp4" },
    { name: "Marcus Johnson", show: "Tech Unpacked", video: "/videos/4.mp4" },
    { name: "Sarah Williams", show: "Creative Minds", video: "/videos/5.mp4" },
    { name: "David Park", show: "Future Forward", video: "/videos/6.mp4" },
    { name: "Lisa Anderson", show: "Health & Wellness", video: "/videos/7.mp4" },
    { name: "Ryan Mitchell", show: "Business Insights", video: "/videos/8.mp4" },
  ]

  // Get next video index
  const nextVideoIndex = (currentVideoIndex + 1) % homeVideos.length

  // Set video playback speed to 0.8x for all videos
  useEffect(() => {
    // Set speed for main videos
    videoRefs.current.forEach((video) => {
      if (video) {
        video.playbackRate = 0.8
      }
    })

    // Set speed for blob videos
    blobVideoRefs.current.forEach((video) => {
      if (video) {
        video.playbackRate = 0.8
      }
    })
  }, [])

  // Auto-play videos in loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % homeVideos.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [homeVideos.length])

  // Rotate through professions every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProfessionIndex((prevIndex) => (prevIndex + 1) % professions.length)
    }, 1000)
    return () => clearInterval(interval)
  }, [professions.length])

  // Rotate through testimonials every 5 seconds (independent from videos)
  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(testimonialInterval)
  }, [testimonials.length])

  // Handle video click to change
  const handleVideoClick = () => {
    // Hide blob immediately
    setIsBlobHidden(true)

    // Change video
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % homeVideos.length)

    // Show blob again after 2 seconds
    setTimeout(() => {
      setIsBlobHidden(false)
    }, 2000)
  }

  // --- requestAnimationFrame-based mouse tracking ---
  const latestMouse = useRef<{ x: number; y: number } | null>(null)
  const rafId = useRef<number | null>(null)

  // Calculate blob properties (existing function)
  const calculateBlobProperties = useCallback((x: number, y: number) => {
    // Use mouse position to determine size (with some randomness)
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight

    // Create zones for different sizes
    const leftZone = x < screenWidth * 0.3
    const rightZone = x > screenWidth * 0.7
    const topZone = y < screenHeight * 0.3
    const bottomZone = y > screenHeight * 0.7

    // Use a more stable random factor based on position
    const randomSeed = Math.floor(x / 50) + Math.floor(y / 50)
    const randomFactor = (Math.sin(randomSeed * 0.1) + Math.cos(randomSeed * 0.15)) * 0.3 + 1

    let baseSize = 180
    let variation = "blob-variation-1"

    // Different sizes for different screen areas
    if (leftZone && topZone) {
      baseSize = 120 + randomFactor * 20 // Small in top-left
      variation = "blob-variation-2"
    } else if (rightZone && topZone) {
      baseSize = 220 + randomFactor * 30 // Large in top-right
      variation = "blob-variation-3"
    } else if (leftZone && bottomZone) {
      baseSize = 180 + randomFactor * 25 // Medium in bottom-left
      variation = "blob-variation-1"
    } else if (rightZone && bottomZone) {
      baseSize = 150 + randomFactor * 20 // Small-medium in bottom-right
      variation = "blob-variation-2"
    } else {
      // Center areas - vary based on distance from center
      const centerX = screenWidth / 2
      const centerY = screenHeight / 2
      const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
      const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2)
      const distanceRatio = distanceFromCenter / maxDistance

      baseSize = 150 + distanceRatio * 80 + randomFactor * 25
      variation = distanceRatio > 0.5 ? "blob-variation-3" : "blob-variation-1"
    }

    // Add some variation to make it more organic but more stable
    const widthVariation = 0.95 + (randomFactor - 1) * 0.1 // More stable variation
    const heightVariation = 0.95 + (randomFactor - 1) * 0.1

    return {
      width: Math.max(100, baseSize * widthVariation), // Minimum size
      height: Math.max(100, baseSize * heightVariation),
      variation,
    }
  }, [])

  // Animation frame update for mouse tracking
  const updateMouse = useCallback(() => {
    if (latestMouse.current) {
      setMousePosition(latestMouse.current)
      const blobProps = calculateBlobProperties(latestMouse.current.x, latestMouse.current.y)
      setBlobSize({ width: blobProps.width, height: blobProps.height })
      setBlobVariation(blobProps.variation)
    }
    rafId.current = null
  }, [calculateBlobProperties])

  // Fast mouse move handler using rAF
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const newPosition = { x: e.clientX, y: e.clientY }
    setMousePosition(newPosition)
    const blobProps = calculateBlobProperties(newPosition.x, newPosition.y)
    setBlobSize({ width: blobProps.width, height: blobProps.height })
    setBlobVariation(blobProps.variation)
  }, [calculateBlobProperties])

  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  // Remove isHovering logic entirely
  // const handleMouseEnter = () => setIsHovering(true)
  // const handleMouseLeave = () => setIsHovering(false)

  // --- Recently Out Tabs ---
  const tabCategories = ["All", "Research", "Blog", "Announcements", "Guides", "Updates"]
  const [activeTab, setActiveTab] = useState("All")
  const filteredPublications =
    activeTab === "All"
      ? publicationsData
      : publicationsData.filter((pub) => pub.category?.toLowerCase() === activeTab.toLowerCase())

  return (
    <div>
      <div className="main-content-container">
        <div className="scroll-snap-container">
          {/* First Page - Hero Section */}
          <div className="min-h-screen relative overflow-hidden scroll-snap-section">
            {/* Video Container */}
            <div
              ref={videoContainerRef}
              className="absolute inset-0 w-full h-full"
              onClick={handleVideoClick}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* All Main Videos - Only current one visible */}
              {homeVideos.map((video, index) => (
                <video
                  key={`main-${index}`}
                  ref={(el) => {
                    videoRefs.current[index] = el
                    if (el) {
                      el.playbackRate = 0.8
                    }
                  }}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    index === currentVideoIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  <source src={video} type="video/mp4" />
                </video>
              ))}
            </div>

            {/* Cursor Blob Effect - Shows Next Video */}
              <div
              className={`fixed pointer-events-none z-50 organic-blob ${blobVariation} blob-instant`}
                style={{
                  left: mousePosition.x - blobSize.width / 2,
                  top: mousePosition.y - blobSize.height / 2,
                  width: `${blobSize.width}px`,
                  height: `${blobSize.height}px`,
                  overflow: "hidden",
                willChange: "transform, left, top, width, height",
                transform: "translateZ(0)", // Force hardware acceleration
                willChange: "transform, left, top, width, height",
                transform: "translateZ(0)", // Force hardware acceleration
                // Remove all transitions for instant follow
                }}
              >
                {/* Clip the next video to show only this portion */}
                <div
                  className="absolute w-screen h-screen"
                  style={{
                    left: `${-mousePosition.x + blobSize.width / 2}px`,
                    top: `${-mousePosition.y + blobSize.height / 2}px`,
                  willChange: "left, top",
                  transform: "translateZ(0)", // Force hardware acceleration
                  }}
                >
                  {/* All Blob Videos - Only next one visible */}
                  {homeVideos.map((video, index) => (
                    <video
                      key={`blob-${index}`}
                      ref={(el) => {
                        blobVideoRefs.current[index] = el
                        if (el) {
                          el.playbackRate = 0.8
                        }
                      }}
                      autoPlay
                      muted
                      loop
                      playsInline
                    className={`absolute inset-0 w-full h-full object-cover ${
                        index === nextVideoIndex ? "opacity-100" : "opacity-0"
                      }`}
                    style={{
                      transition: "none", // Remove video transition delays too
                    }}
                    >
                      <source src={video} type="video/mp4" />
                    </video>
                  ))}
                </div>
              </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 pointer-events-none z-20" />

            {/* Main Content */}
            <div className="relative z-30 flex flex-col items-center justify-center min-h-screen px-6 pointer-events-none">
              <div className="text-center">
                <h1
                  className="text-foreground mx-auto font-bold"
                  style={{
                    fontFamily: "var(--font-sf-pro)",
                    fontWeight: 700,
                    fontSize: "80px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    textAlign: "center",
                    maxWidth: "1029px",
                  }}
                >
                  Unlocking Human Creativity
                </h1>
              </div>
            </div>
          </div>

          {/* Second Page - Eurus Studios Section */}
          <EurusStudiosSection />

          {/* Studio-style Product Scroll Section (duplicated from Eurus Studio) */}
          <ProductsScrollSectionStudioLanding />

          {/* Recently Out Section */}
          <section className="bg-background text-foreground w-full py-20 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center mb-12 gap-3">
              <h2 className="text-4xl font-bold text-center" style={{ fontFamily: "var(--font-sf-pro)" }}>
                Recently Out
              </h2>
              <Link href="/research" className="flex items-center group">
                <span className="sr-only">Go to Research</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto w-full">
              {/* Use original titles/types/dates/links, but swap images */}
              {publicationsData.slice(0, 4).map((pub, idx) => (
                <Link
                  key={pub.id}
                  href={pub.readPaperLink || `/publications/${pub.id}`}
                  className="flex flex-col items-center group no-underline hover:no-underline focus:no-underline"
                  style={{ textDecoration: "none" }}
                >
                  <img
                    src={`/images/${idx + 1}.jpg`}
                    alt={pub.title}
                    className="w-full aspect-square object-cover rounded-lg mb-4"
                  />
                  <div
                    className="text-lg font-semibold text-foreground mb-1 text-center"
                    style={{ fontFamily: "var(--font-sf-pro)" }}
                  >
                    {pub.title}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    {pub.type} {pub.date}
                  </div>
                  <span className="text-primary font-semibold flex items-center gap-2 mt-2">Read More</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function ProductsScrollSectionLanding() {
  const products = [
    {
      name: "Studio",
      imgSrc: "/wave-glass.jpg",
      description:
        "Studio is your all-in-one creative suite for audio and video production, designed for storytellers and creators.",
    },
    {
      name: "Draft",
      imgSrc: "/glass-blobs.jpg",
      description: "Draft is a next-gen writing and publishing platform for creators, teams, and communities.",
    },
    {
      name: "Relay",
      imgSrc: "/color-flower-1.jpg",
      description: "Relay lets you share, distribute, and monetize your stories and podcasts across platforms.",
    },
    {
      name: "Eidos",
      imgSrc: "/color-flower-2.jpg",
      description: "Eidos is where you discover, listen, and connect with the world's best creators and their content.",
    },
  ]
  const [current, setCurrent] = React.useState(0)
  const sectionRefs = React.useRef<HTMLDivElement[]>([])
  const nameRefs = React.useRef<(HTMLSpanElement | null)[]>([])
  const [highlightStyle, setHighlightStyle] = React.useState<{ top: number; height: number }>({ top: 0, height: 0 })

  React.useEffect(() => {
    const handleScroll = (e: Event) => {
      const container = e.target as HTMLDivElement
      const containerRect = container.getBoundingClientRect()
      const containerCenter = containerRect.top + containerRect.height / 2
      let minDistance = Number.POSITIVE_INFINITY
      let found = 0
      sectionRefs.current.forEach((ref, idx) => {
        if (ref) {
          const rect = ref.getBoundingClientRect()
          const sectionCenter = rect.top + rect.height / 2
          const distance = Math.abs(sectionCenter - containerCenter)
          if (distance < minDistance) {
            minDistance = distance
            found = idx
          }
        }
      })
      setCurrent(found)
    }
    const container = document.getElementById("products-scroll-viewport")
    if (container) {
      container.addEventListener("scroll", handleScroll)
      handleScroll({ target: container } as unknown as Event)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  React.useEffect(() => {
    function updateHighlight() {
      const el = nameRefs.current[current]
      if (el) {
        const parent = el.parentElement
        if (parent) {
          const parentRect = parent.getBoundingClientRect()
          const elRect = el.getBoundingClientRect()
          setHighlightStyle({
            top: elRect.top - parentRect.top,
            height: elRect.height,
          })
        }
      }
    }
    updateHighlight()
    window.addEventListener("resize", updateHighlight)
    return () => window.removeEventListener("resize", updateHighlight)
  }, [current])

  const VISIBLE_COUNT = products.length
  const NAME_HEIGHT = 72
  const containerHeight = NAME_HEIGHT * VISIBLE_COUNT
  const translateY = -(current * NAME_HEIGHT - (containerHeight / 2 - NAME_HEIGHT / 2))

  return (
    <div id="products-scroll-viewport" className="w-full h-full relative overflow-hidden">
      {products.map((product, idx) => (
        <img
          key={product.name}
          src={product.imgSrc || "/placeholder.svg"}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 z-0 ${current === idx ? "opacity-100" : "opacity-0"}`}
          style={{ pointerEvents: "none" }}
        />
      ))}
      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
      <div className="absolute left-10 top-1/2 -translate-y-1/2 z-20 max-w-[60%] sm:max-w-none pointer-events-none">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-lg leading-tight" style={{ fontFamily: 'var(--font-sf-pro)' }}>
          Build with the<br />Eurus Ecosystem.
        </h2>
      </div>
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-end gap-2 z-20 pointer-events-none">
        {products.map((p, i) => (
          <span
            key={p.name}
            className={`text-5xl md:text-7xl font-bold transition-all duration-500 ease-in-out text-right no-underline hover:scale-105 ${
              current === i ? "text-yellow-200" : "text-white/80 hover:text-white"
            }`}
            style={{
              fontFamily: "var(--font-sf-pro)",
              opacity: current === i ? 1 : 0.7,
              pointerEvents: "auto",
              textDecoration: "none",
              transform: current === i ? "scale(1.02)" : "scale(1)",
            }}
          >
            {p.name}
          </span>
        ))}
      </div>
    </div>
  )
}

// Add this new component for the landing page
function ProductsScrollSectionStudioLanding() {
  const products = [
    {
      name: "Eidos",
      videoSrc: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/abstract4.mp4",
      description: "Eidos is the world-leading generative AI for text, code, and more.",
      link: "https://apps.apple.com/us/app/eidos-press/id6742799522",
    },
    {
      name: "Relay",
      videoSrc: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/abstract1.mp4",
      description: "Relay brings next-gen video and image generation to creators.",
      link: "https://www.relayedstories.com/",
    },
    {
      name: "Studio",
      videoSrc: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/abstract3.mp4",
      description: "Studio is a powerful AI for video understanding and creative editing.",
      link: "https://studio.euruslabs.com/",
    },
    {
      name: "Draft",
      videoSrc: "https://eurusworkflows.blob.core.windows.net/eurusworkflows/images/abstract2.mp4",
      description: "Draft enables advanced audio and speech synthesis for your projects.",
      link: "https://red-forest-0721f660f.6.azurestaticapps.net/",
    },
  ]

  const [current, setCurrent] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const isScrollingRef = React.useRef(false)
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [isInView, setIsInView] = React.useState(false)

  // Touch support for mobile
  const touchStartRef = React.useRef<number>(0);
  const touchEndRef = React.useRef<number>(0);

  // Enhanced wheel handler
  const handleWheel = React.useCallback(
    (e: WheelEvent) => {
      if (!isInView) return;
      
      const direction = e.deltaY > 0 ? 1 : -1;
      
      // ONLY allow page scroll when at Draft (index 3) and scrolling down
      if (current === 3 && direction > 0) {
        return; // Allow normal page scroll to next section
      }
      
      // PREVENT ALL SCROLL EVERYWHERE when section is in view
      e.preventDefault();
      e.stopPropagation();
      
      // Only cycle products if scrolling within the container
      if (!containerRef.current?.contains(e.target as Node)) return;
      
      if (isScrollingRef.current || isTransitioning) return;
      
      const newIndex = current + direction;
      
      // Update if within bounds
      if (newIndex >= 0 && newIndex < products.length) {
        isScrollingRef.current = true;
        setIsTransitioning(true);
        setCurrent(newIndex);
        
        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        
        // Reset scrolling flag after animation
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
          setIsTransitioning(false);
        }, 600);
      }
    },
    [current, products.length, isTransitioning, isInView]
  );

  // Keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (!isInView || isScrollingRef.current || isTransitioning) return;
      
      let newIndex = current;
      
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        newIndex = Math.max(0, current - 1);
        e.preventDefault();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        newIndex = Math.min(products.length - 1, current + 1);
        e.preventDefault();
      }
      
      if (newIndex !== current) {
        isScrollingRef.current = true;
        setIsTransitioning(true);
        setCurrent(newIndex);
        
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
          setIsTransitioning(false);
        }, 600);
      }
    },
    [current, products.length, isTransitioning, isInView]
  );

  const handleTouchStart = React.useCallback((e: TouchEvent) => {
    if (!isInView) return;
    touchStartRef.current = e.touches[0].clientY;
  }, [isInView]);

  const handleTouchEnd = React.useCallback(
    (e: TouchEvent) => {
      if (!isInView || isScrollingRef.current || isTransitioning) return;
      
      touchEndRef.current = e.changedTouches[0].clientY;
      const diff = touchStartRef.current - touchEndRef.current;
      
      if (Math.abs(diff) > 50) { // Minimum swipe distance
        const direction = diff > 0 ? 1 : -1;
        const newIndex = current + direction;
        
        if (newIndex >= 0 && newIndex < products.length) {
          e.preventDefault();
          isScrollingRef.current = true;
          setIsTransitioning(true);
          setCurrent(newIndex);
          
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }
          
          scrollTimeoutRef.current = setTimeout(() => {
            isScrollingRef.current = false;
            setIsTransitioning(false);
          }, 600);
        }
      }
    },
    [current, products.length, isTransitioning, isInView]
  );

  // Fullscreen detection
  React.useEffect(() => {
    const checkInView = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const inView = Math.abs(rect.top) < 10 && Math.abs(rect.height - vh) < 10;
      setIsInView(inView);
    };
    
    checkInView();
    window.addEventListener('scroll', checkInView, { passive: true });
    window.addEventListener('resize', checkInView);
    
    return () => {
      window.removeEventListener('scroll', checkInView);
      window.removeEventListener('resize', checkInView);
    };
  }, []);

  // Event listeners
  React.useEffect(() => {
    const wheelHandler = (e: WheelEvent) => handleWheel(e);
    const keyHandler = (e: KeyboardEvent) => handleKeyDown(e);
    const touchStartHandler = (e: TouchEvent) => handleTouchStart(e);
    const touchEndHandler = (e: TouchEvent) => handleTouchEnd(e);
    
    window.addEventListener('wheel', wheelHandler, { passive: false });
    window.addEventListener('keydown', keyHandler);
    window.addEventListener('touchstart', touchStartHandler, { passive: true });
    window.addEventListener('touchend', touchEndHandler, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', wheelHandler);
      window.removeEventListener('keydown', keyHandler);
      window.removeEventListener('touchstart', touchStartHandler);
      window.removeEventListener('touchend', touchEndHandler);
    };
  }, [handleWheel, handleKeyDown, handleTouchStart, handleTouchEnd]);

  // Cleanup
  React.useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} id="products-scroll-viewport-landing" className="w-full h-screen relative overflow-hidden scroll-snap-section">
      {/* Video backgrounds for each product */}
      {products.map((product, idx) => (
        <video
          key={product.name}
          src={product.videoSrc}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out z-0 ${
            current === idx ? "opacity-100" : "opacity-0"
          }`}
          style={{ pointerEvents: "none" }}
          autoPlay
          loop
          muted
          playsInline
        />
      ))}
      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
      
      {/* Left side heading */}
      <div className="absolute left-4 sm:left-6 md:left-8 lg:left-10 bottom-32 sm:top-1/2 sm:-translate-y-1/2 z-20 max-w-[60%] sm:max-w-none pointer-events-none">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-lg leading-tight" style={{ fontFamily: 'var(--font-sf-pro)' }}>
          Build with the<br />Eurus Ecosystem.
        </h2>
      </div>
      
      {/* Product names */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-end gap-2 z-20 pointer-events-none">
        {products.map((p, i) =>
          p.link.startsWith("http") ? (
            <a
              key={p.name}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-5xl md:text-7xl font-bold transition-all duration-700 ease-out text-right no-underline hover:scale-105 ${
                current === i ? "text-yellow-200" : "text-white/80 hover:text-white"
              }`}
              style={{
                fontFamily: "var(--font-sf-pro)",
                opacity: current === i ? 1 : 0.7,
                pointerEvents: "auto",
                textDecoration: "none",
                transform: current === i ? "scale(1.02)" : "scale(1)",
              }}
            >
              {p.name}
            </a>
          ) : (
            <Link
              key={p.name}
              href={p.link}
              className={`text-5xl md:text-7xl font-bold transition-all duration-700 ease-out text-right no-underline hover:scale-105 ${
                current === i ? "text-yellow-200" : "text-white/80 hover:text-white"
              }`}
              style={{
                fontFamily: "var(--font-sf-pro)",
                opacity: current === i ? 1 : 0.7,
                pointerEvents: "auto",
                textDecoration: "none",
                transform: current === i ? "scale(1.02)" : "scale(1)",
              }}
            >
              {p.name}
            </Link>
          ),
        )}
      </div>
      
      {/* Progress indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {products.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              current === i ? "bg-yellow-200 w-8" : "bg-white/40"
            }`}
          />
        ))}
      </div>
      
      {/* Scroll hint */}
      {current === 0 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-sm z-20 animate-pulse">
          Scroll to explore products
        </div>
      )}
    </div>
  )
}