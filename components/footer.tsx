"use client"

import Link from "next/link"
import { FaArrowRight } from "react-icons/fa"
import { useState, useRef } from "react"
import type { MutableRefObject } from "react"
import { publicationsData } from "@/components/publications-data"

export default function Footer() {
  const [videoMuted, setVideoMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleToggleMute = () => {
    setVideoMuted((prev) => !prev)
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
    }
  }

  return (
    <footer className="relative w-full text-white overflow-hidden" style={{ minHeight: '140px', borderTopLeftRadius: '2.5rem', borderTopRightRadius: '2.5rem', fontFamily: 'var(--font-sf-pro)' }}>
      {/* Video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/videos/footer video.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{ borderTopLeftRadius: '2.5rem', borderTopRightRadius: '2.5rem' }}
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/70 z-10" style={{ borderTopLeftRadius: '2.5rem', borderTopRightRadius: '2.5rem' }} />
      {/* Footer content - Mobile Responsive */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex flex-col gap-3 sm:gap-4">
        {/* Documents row - top right */}
        <div className="flex flex-row w-full justify-end items-start">
          <a href="https://eurus-labs.gitbook.io/eurus-labs/~/changes/3/system_status" target="_blank" rel="noopener noreferrer" className="font-semibold text-sm sm:text-base opacity-80 hover:opacity-100 hover:underline">Documents</a>
        </div>
        {/* Verticals - Mobile: Stack vertically, Desktop: Horizontal */}
        <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 md:gap-12 text-left">
          {/* Products vertical */}
          <div className="flex flex-col items-start gap-1 sm:gap-2">
            <div className="font-bold text-base sm:text-lg">PRODUCTS</div>
            <a href="https://kind-mud-06307e40f.2.azurestaticapps.net" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base hover:underline">Studio</a>
            <a href="https://red-forest-0721f660f.6.azurestaticapps.net/" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base hover:underline">Draft</a>
            <a href="https://www.relayedstories.com/" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base hover:underline">Relay</a>
            <a href="https://apps.apple.com/us/app/eidos-press/id6742799522" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base hover:underline">Eidos</a>
          </div>
          {/* Company vertical */}
          <div className="flex flex-col items-start gap-1 sm:gap-2">
            <div className="font-bold text-base sm:text-lg">COMPANY</div>
            <a href="https://eurus-labs.gitbook.io/eurus-labs/~/changes/3/system_status" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base hover:underline">About</a>
            <a href="/contact" className="text-sm sm:text-base hover:underline">Contact</a>
          </div>
          {/* Social vertical */}
          <div className="flex flex-col items-start gap-1 sm:gap-2">
            <div className="font-bold text-base sm:text-lg">SOCIAL</div>
            <a href="https://x.com/eurus_labs" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base hover:underline">X</a>
            <a href="https://www.linkedin.com/company/euruslabs/" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base hover:underline">LinkedIn</a>
            <a href="https://www.instagram.com/euruslabs/" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base hover:underline">Instagram</a>
            <a href="https://discord.gg/Y4PEMhas" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base hover:underline">Discord</a>
          </div>
        </div>
        {/* Copyright - bottom right */}
        <div className="flex flex-row w-full justify-end items-end mt-1 sm:mt-2">
          <span className="text-xs sm:text-sm opacity-60">Eurus Labs 2025 © </span>
        </div>
      </div>
    </footer>
  )
} 