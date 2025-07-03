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
    <footer className="w-full bg-black text-white py-6 px-8 flex flex-row items-center justify-between" style={{ minHeight: '64px' }}>
      {/* Verticals - left aligned */}
      <div className="flex flex-row items-start gap-12">
        {/* Products vertical */}
        <div className="flex flex-col items-start gap-2">
          <div className="font-bold text-lg">PRODUCTS</div>
          <a href="/studio" className="hover:underline">Studio</a>
          <a href="/draft" className="hover:underline">Draft</a>
          <a href="/relay" className="hover:underline">Relay</a>
          <a href="/eidos" className="hover:underline">Eidos</a>
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
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
          <a href="https://www.instagram.com/euruslabs/" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
        </div>
      </div>
      {/* Centered right-aligned legal row */}
      <div className="flex flex-row items-center gap-4 ml-auto" style={{ textAlign: 'center' }}>
        <span>Eurus Labs</span>
        <span>|</span>
        <a href="/privacy" className="hover:underline">Privacy Policy</a>
        <span>|</span>
        <a href="/terms" className="hover:underline">Terms of Use</a>
        <span>|</span>
        <span>©Eurus Labs Inc</span>
      </div>
    </footer>
  )
} 