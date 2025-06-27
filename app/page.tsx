"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Navigation from "./components/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Footer from "@/components/footer"
import { EurusStudiosSection } from "@/app/components/eurus-studios-section"
import NoSsr from "./components/NoSsr"

export default function Home() {
  return (
    <NoSsr>
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
    "Storytellers"
  ]

  // Add client testimonials state
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)
  const testimonials = [
    {
      quote: "Eurus Labs transformed our content creation process. The AI tools are incredible!",
      name: "Sarah Chen",
      image: "/placeholder-user.jpg",
      position: "bottom-8 right-8"
    },
    {
      quote: "The creative possibilities are endless with Eurus. It's like having a whole team.",
      name: "Marcus Rodriguez",
      image: "/person.jpg",
      position: "top-24 left-8"
    },
    {
      quote: "Finally, a platform that understands what creators actually need. Game changer!",
      name: "Emily Johnson",
      image: "/placeholder-user.jpg",
      position: "bottom-8 left-8"
    },
    {
      quote: "Our productivity has increased 300% since we started using Eurus products.",
      name: "Alex Thompson",
      image: "/person.jpg",
      position: "top-24 right-8"
    },
    {
      quote: "Working with Eurus has revolutionized how we approach storytelling and content.",
      name: "Maya Patel",
      image: "/placeholder-user.jpg",
      position: "bottom-1/3 right-1/3"
    }
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

  // Add throttle function before the component
  const throttle = (func: Function, limit: number) => {
    let inThrottle: boolean
    return function (this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }

  // Update the handleMouseMove function with throttling and smoother transitions
  const handleMouseMove = useCallback(
    throttle((e: React.MouseEvent<HTMLDivElement>) => {
      const newPosition = { x: e.clientX, y: e.clientY }
      setMousePosition(newPosition)

      // Calculate new blob properties based on mouse position
      const blobProps = calculateBlobProperties(newPosition.x, newPosition.y)
      setBlobSize({ width: blobProps.width, height: blobProps.height })
      setBlobVariation(blobProps.variation)
    }, 16), // 60fps throttling
    [],
  )

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  // Add this function to calculate dynamic blob size and shape based on mouse position
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

  return (
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
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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
          {isHovering && !isBlobHidden && (
            <div
              className={`fixed pointer-events-none z-50 blob-size-transition organic-blob ${blobVariation} transition-opacity duration-300`}
              style={{
                left: mousePosition.x - blobSize.width / 2,
                top: mousePosition.y - blobSize.height / 2,
                width: `${blobSize.width}px`,
                height: `${blobSize.height}px`,
                overflow: "hidden",
              }}
            >
              {/* Clip the next video to show only this portion */}
              <div
                className="absolute w-screen h-screen"
                style={{
                  left: `${-mousePosition.x + blobSize.width / 2}px`,
                  top: `${-mousePosition.y + blobSize.height / 2}px`,
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
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                      index === nextVideoIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <source src={video} type="video/mp4" />
                  </video>
                ))}
              </div>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none z-20" />

          {/* Navigation */}
          <Navigation />

          {/* Main Content */}
          <div className="relative z-30 flex flex-col items-center justify-center min-h-screen px-6 pointer-events-none">
            <div className="text-center">
              <h1
                className="text-white mx-auto"
                style={{
                  fontFamily: "var(--font-sf-pro)",
                  fontWeight: 400,
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

          {/* Client Testimonial Card */}
          <div 
            key={currentTestimonialIndex}
            className={`absolute ${testimonials[currentTestimonialIndex].position} bg-black/60 backdrop-blur-sm rounded-2xl p-4 flex items-center space-x-4 max-w-sm z-40 animate-fade-in`}
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={testimonials[currentTestimonialIndex].image} alt={testimonials[currentTestimonialIndex].name} />
              <AvatarFallback>{testimonials[currentTestimonialIndex].name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-white text-sm font-medium mb-2">"{testimonials[currentTestimonialIndex].quote}"</p>
              <p className="text-white/70 text-xs font-medium">— {testimonials[currentTestimonialIndex].name}</p>
            </div>
          </div>
        </div>

        {/* Second Page - Eurus Studios Section */}
        <EurusStudiosSection />

        {/* Third Page - Creatives Section */}
        <div className="min-h-screen relative bg-white text-black scroll-snap-section flex flex-col justify-center overflow-hidden">
          <div className="relative z-10 w-full space-y-16 py-24">
            {/* Top Title & Button */}
            <div className="text-center px-6 md:px-12 lg:px-24">
              <h2 className="text-5xl md:text-6xl font-bold">
                How the world's top creatives
                <br />
                are using Eurus.
              </h2>
              <button className="mt-8 border border-black text-black font-semibold py-2 px-6 rounded-full hover:bg-black hover:text-white transition-colors">
                More Customer Stories
              </button>
            </div>

            {/* Middle: Tilted Scrolling Video Cards */}
            <div className="w-[120vw] relative left-1/2 -translate-x-1/2 transform -rotate-4">
              <div className="overflow-hidden photo-strip-container">
                <div className="flex animate-scroll-left space-x-8">
                  {/* First set of cards */}
                  {podcasters.map((podcaster, index) => (
                    <div
                      key={`first-${index}`}
                      className="flex-shrink-0 w-[380px] rounded-lg overflow-hidden cursor-pointer"
                    >
                      <div className="aspect-video relative mb-4">
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover rounded-lg"
                        >
                          <source src={podcaster.video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{podcaster.name}</p>
                        <h3 className="text-black text-xl font-medium">{podcaster.show}</h3>
                      </div>
                    </div>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {podcasters.map((podcaster, index) => (
                    <div
                      key={`second-${index}`}
                      className="flex-shrink-0 w-[380px] rounded-lg overflow-hidden cursor-pointer"
                    >
                      <div className="aspect-video relative mb-4">
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover rounded-lg"
                        >
                          <source src={podcaster.video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{podcaster.name}</p>
                        <h3 className="text-black text-xl font-medium">{podcaster.show}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom: "Join other..." text */}
            <h2 className="text-center text-4xl md:text-5xl font-bold px-6 md:px-12 lg:px-24">
              <span>Join other </span>
              <span className="text-blue-500">{professions[currentProfessionIndex]}</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Footer - Outside scroll-snap container */}
      <Footer />
    </div>
  )
}
