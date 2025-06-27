"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "../components/navigation"
import { AnimatedInput } from "../components/animated-input"

export default function CreatorsPage() {
  const [handle, setHandle] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (handle.trim()) {
      router.push(`/results?handle=${encodeURIComponent(handle)}`)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image - Updated to use new SVG */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/chair_bg.svg)",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            How much would you make?
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <AnimatedInput
              type="text"
              placeholderText="Drop your handle. Find out."
              value={handle}
              onChange={(e) => setHandle(e.target.value as string)}
              className="w-full h-16 px-6 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white rounded-full focus:bg-white/20 focus:border-white/40 transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(e)
                }
              }}
            />
          </form>
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
