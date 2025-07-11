"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Navigation from "../components/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function EarningsContent() {
  const searchParams = useSearchParams()
  const handle = searchParams.get("handle") || "your handle"

  // Simulate earnings calculation based on handle
  const calculateEarnings = (handle: string) => {
    const baseEarning = 5000
    const handleLength = handle.length
    const randomFactor = Math.abs(handle.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 3000
    return baseEarning + handleLength * 100 + randomFactor
  }

  const earnings = calculateEarnings(handle)

  return (
    <div className="min-h-screen relative overflow-hidden animate-slide-in-right">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        ref={(el) => {
          if (el) {
            el.playbackRate = 0.8
          }
        }}
      >
        <source src="https://eurusworkflows.blob.core.windows.net/eurusworkflows/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="text-center mb-16">
          {/* Earnings Display */}
          <div className="mb-8">
            <h1
              className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-none"
              style={{
                fontFamily: "var(--font-sf-pro)",
                fontWeight: 1000,
                fontSize: "72px",
                lineHeight: "100%",
                letterSpacing: "0%",
              }}
            >
              ${earnings.toLocaleString()}/yr
            </h1>
          </div>

          {/* Disclaimer */}
          <p
            className="text-white/80 mb-4"
            style={{
              fontFamily: "var(--font-sf-pro)",
              fontWeight: 590,
              fontSize: "12px",
              lineHeight: "100%",
              letterSpacing: "0%",
            }}
          >
            *These are estimates based on profiles on our platform
          </p>

          {/* How do we calculate link */}
          <button
            className="text-white hover:text-gray-300 transition-colors underline mb-12"
            style={{
              fontFamily: "var(--font-sf-pro)",
              fontWeight: 860,
              fontSize: "18px",
              lineHeight: "100%",
              letterSpacing: "0%",
            }}
          >
            How do we calculate this?
          </button>
        </div>

        {/* Creator Card - keeping from original home page */}
        <div className="fixed bottom-8 right-8 bg-black/60 backdrop-blur-sm rounded-2xl p-4 flex items-center space-x-4 max-w-sm">
          <Avatar className="w-12 h-12">
            <AvatarImage src="https://eurusworkflows.blob.core.windows.net/eurusworkflows/person.jpg" alt="Janine Kresky" />
            <AvatarFallback>JK</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Janine Kresky creates deep dives into handmade pottery</p>
            <Button asChild variant="link" className="text-white/80 hover:text-white p-0 h-auto text-sm">
              <Link href="/creators">Check it out</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EarningsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-white text-xl">Loading...</div>
        </div>
      }
    >
      <EarningsContent />
    </Suspense>
  )
}
