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
    <footer className="relative w-full text-white overflow-hidden" style={{ minHeight: '220px', borderTopLeftRadius: '2.5rem', borderTopRightRadius: '2.5rem', fontFamily: 'var(--font-sf-pro)' }}>
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
      {/* Footer content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-8 py-10 flex flex-col gap-8">
        {/* Documents row - top right */}
        <div className="flex flex-row w-full justify-end items-start">
          <span className="font-semibold text-base opacity-80">Documents</span>
        </div>
        {/* Verticals - left aligned */}
        <div className="flex flex-row items-start gap-16 text-left">
          {/* Products vertical */}
          <div className="flex flex-col items-start gap-2">
            <div className="font-bold text-lg">PRODUCTS</div>
            <a href="/studio" className="hover:underline">Studio</a>
            <a href="/draft" className="hover:underline">Draft</a>
            <a href="https://www.relayedstories.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">Relay</a>
            <a href="https://eidos.press/" target="_blank" rel="noopener noreferrer" className="hover:underline">Eidos</a>
          </div>
          {/* Company vertical */}
          <div className="flex flex-col items-start gap-2">
            <div className="font-bold text-lg">COMPANY</div>
            <a href="/about" className="hover:underline">About</a>
            <a href="/careers" className="hover:underline">Careers</a>
            <a href="/contact" className="hover:underline">Contact</a>
          </div>
          {/* Social vertical */}
          <div className="flex flex-col items-start gap-2">
            <div className="font-bold text-lg">SOCIAL</div>
            <a href="https://x.com/eurus_labs" target="_blank" rel="noopener noreferrer" className="hover:underline">X</a>
            <a href="https://www.linkedin.com/company/euruslabs/" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
            <a href="https://www.instagram.com/euruslabs/" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
            <a href="https://discord.gg/Y4PEMhas" target="_blank" rel="noopener noreferrer" className="hover:underline">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  )
} 