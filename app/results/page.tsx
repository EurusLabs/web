"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import Navigation from "../components/navigation"
import { Button } from "@/components/ui/button"

function ResultsContent() {
  const searchParams = useSearchParams()
  const handle = searchParams.get("handle") || "your handle"
  const router = useRouter()

  // Simulate earnings calculation based on handle
  const calculateEarnings = (handle: string) => {
    const baseEarning = 5000
    const handleLength = handle.length
    const randomFactor = Math.abs(handle.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 3000
    return baseEarning + handleLength * 100 + randomFactor
  }

  const earnings = calculateEarnings(handle)

  const handleGetStarted = () => {
    router.push(`/earnings?handle=${encodeURIComponent(handle)}`)
  }

  return (
    <div className="min-h-screen relative overflow-hidden animate-slide-in-right bg-black">
      {/* Background Image - Updated to use new SVG */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(https://eurusworkflows.blob.core.windows.net/eurusworkflows/chair_bg.svg)",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="text-center mb-12">
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
          <div className="relative">
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
          </div>

          {/* How do we calculate link */}
          <div className="relative">
            <button
              className="text-white hover:text-gray-300 transition-colors underline mb-12"
              style={{
                fontFamily: "var(--font-sf-pro)",
                fontWeight: 860,
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0%",
              }}
            >
              How do we calculate this?
            </button>
          </div>

          {/* Get Started Button */}
          <div className="relative">
            <Button
              onClick={handleGetStarted}
              className="transition-colors border-none"
              style={{
                backgroundColor: "#000000CC",
                color: "white",
                fontFamily: "var(--font-sf-pro)",
                fontWeight: 590,
                fontSize: "18px",
                lineHeight: "100%",
                letterSpacing: "0%",
                padding: "16px 48px",
                width: "300px",
                borderRadius: "50px",
                height: "60px",
              }}
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center leading-tight">
            Monetize yourself. Not brands.
          </h2>
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-white text-xl">Loading...</div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  )
}
