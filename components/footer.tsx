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
    <>
      {/* Recently Out Section */}
      <section className="bg-background text-foreground w-full py-20 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center mb-12 gap-3">
          <h2 className="text-4xl font-bold text-center" style={{ fontFamily: 'var(--font-sf-pro)' }}>Recently Out</h2>
          <Link href="/research" className="flex items-center group">
            <FaArrowRight className="text-2xl text-foreground group-hover:text-gray-400 transition" />
            <span className="sr-only">Go to Research</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
          {publicationsData.slice(0, 3).map((pub) => (
            <div key={pub.id} className="flex flex-col items-center">
              <img src={pub.image} alt={pub.title} className="w-full h-48 object-cover rounded-lg mb-4" />
              <div className="text-lg font-semibold text-foreground mb-1 text-center" style={{ fontFamily: 'var(--font-sf-pro)' }}>{pub.title}</div>
              <div className="text-sm text-muted-foreground text-center">{pub.type} {pub.date}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative bg-background text-foreground z-10 text-foreground">
        {/* Main Footer Content */}
        <div className="relative px-6 py-16 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            {/* Footer Links Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 justify-center text-center">
              {/* Products */}
              <div className="flex flex-col items-center text-center">
                <h3 className="text-sm font-semibold text-foreground/400 uppercase tracking-wider mb-6">
                  PRODUCTS
                </h3>
                <ul className="space-y-4">
                  <li>
                    <Link href="/eurus-studio" className="text-foreground hover:text-foreground/300 transition-colors duration-200">
                      Studio
                    </Link>
                  </li>
                  <li>
                    <a 
                      href="http://localhost:3001" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-foreground/300 transition-colors duration-200"
                    >
                      Write
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.relayedstories.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-foreground/300 transition-colors duration-200"
                    >
                      Relay
                    </a>
                  </li>
                  <li>
                    <Link href="/discover" className="text-foreground hover:text-foreground/300 transition-colors duration-200">
                      Eidos
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div className="flex flex-col items-center text-center">
                <h3 className="text-sm font-semibold text-foreground/400 uppercase tracking-wider mb-6">
                  COMPANY
                </h3>
                <ul className="space-y-4">
                  <li>
                    <Link href="/manifesto" className="text-foreground hover:text-foreground/300 transition-colors duration-200">
                      Manifesto
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="text-foreground hover:text-foreground/300 transition-colors duration-200">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="/community" className="text-foreground hover:text-foreground/300 transition-colors duration-200">
                      Community
                    </Link>
                  </li>
                  <li>
                    <a 
                      href="https://eurus-labs.gitbook.io/eurus-labs/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-foreground/300 transition-colors duration-200"
                    >
                      Documentation
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social */}
              <div className="flex flex-col items-center text-center">
                <h3 className="text-sm font-semibold text-foreground/400 uppercase tracking-wider mb-6">
                  SOCIAL
                </h3>
                <ul className="space-y-4">
                  <li>
                    <a 
                      href="#" 
                      className="text-foreground hover:text-foreground/300 transition-colors duration-200"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className="text-foreground hover:text-foreground/300 transition-colors duration-200"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      X (Twitter)
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className="text-foreground hover:text-foreground/300 transition-colors duration-200"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      YouTube
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col justify-center items-center pt-8 border-t border-foreground/80 text-center w-full">
              {/* Logo */}
              <div className="mb-6">
                <Link href="/" className="text-foreground text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-sf-pro)' }}>
                  Eurus Labs
                </Link>
              </div>

              {/* Legal Links */}
              <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8 text-sm text-foreground/60">
                <Link href="/privacy" className="hover:text-foreground transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-foreground transition-colors duration-200">
                  Terms of Use
                </Link>
                <span>©Eurus Labs Inc</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
} 