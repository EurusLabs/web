"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi"
import clsx from 'clsx'

interface NavigationProps {
  forceWhite?: boolean;
}

export default function Navigation({ forceWhite = false }: NavigationProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const sidebarRef = useRef(null)

  // Always use white text for dark mode
  const navColor = 'text-white';

  useEffect(() => {
    // Check if user is logged in
    const accessToken = localStorage.getItem("access_token")
    const userData = localStorage.getItem("user")

    if (accessToken && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    }
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !(sidebarRef.current as any).contains(event.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [menuOpen])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [menuOpen])

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")

    // Update state
    setIsLoggedIn(false)
    setUser(null)

    // Redirect to home
    window.location.href = "/"
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-md z-40 transition-all duration-500 ease-out ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Top navigation bar */}
      <div className={`fixed top-0 left-0 z-[9999] flex items-center justify-between w-full px-6 py-4 transition-all duration-300 ${
        menuOpen ? 'bg-black/95 backdrop-blur-xl shadow-lg' : 'bg-transparent'
      }`}>
        <div className="flex items-center">
          <Link 
            href="/" 
            className="text-2xl font-medium tracking-normal transition-all duration-300 mr-6 text-white" 
            style={{ fontFamily: 'var(--font-sf-pro)' }}
          >
            Eurus Labs
          </Link>
          
          {/* Animated hamburger button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative w-8 h-8 flex flex-col justify-center items-center focus:outline-none transition-all duration-300 text-white cursor-pointer"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <FiX className="w-6 h-6 text-white" />
            ) : (
              <FiMenu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Slide-out menu */}
      <nav
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-80 flex flex-col py-8 px-8 z-50 bg-black/95 backdrop-blur-xl shadow-2xl transition-all duration-500 ease-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Menu content with staggered animations */}
        <div className="mt-16 space-y-2">
          {[
            { label: "Product", isDropdown: true, items: [
              { name: "Eidos", href: "https://apps.apple.com/us/app/eidos-press/id6742799522", external: true },
              { name: "Studio", href: "https://studio.euruslabs.com/", external: true },
              { name: "Draft", href: "https://red-forest-0721f660f.6.azurestaticapps.net/" },
              { name: "Relay", href: "https://www.relayedstories.com/", external: true }
            ]},
            { label: "Publications", isDropdown: true, items: [
              { name: "All", href: "/publications?category=all" },
              { name: "Research", href: "/publications?category=research" },
              { name: "Announcements", href: "/publications?category=announcements" },
              { name: "Blog", href: "/publications?category=blog" }
            ]},
            { label: "Manifesto", href: "/manifesto" }
          ].map((item, index) => (
            <div
              key={item.label}
              className={`transition-all duration-500 ease-out ${
                menuOpen 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: menuOpen ? `${(index + 1) * 100}ms` : '0ms' }}
            >
              {item.isDropdown ? (
                <AnimatedDropdown label={item.label} items={item.items} onNavigate={() => setMenuOpen(false)} />
              ) : (
                <Link
                  href={item.href || '#'}
                  className="block text-lg font-medium py-3 px-4 rounded-xl text-white hover:bg-white/10 transition-all duration-200"
                  style={{ fontFamily: 'var(--font-sf-pro)' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>
    </>
  )
}

// Animated dropdown component
function AnimatedDropdown({ label, items, onNavigate }: { label: string, items: Array<{name: string, href: string, external?: boolean}>, onNavigate: () => void }) {
  const [open, setOpen] = useState(false)
  
  return (
    <div className="overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-lg font-medium py-3 px-4 rounded-xl text-white hover:bg-white/10 transition-all duration-200"
        style={{ fontFamily: 'var(--font-sf-pro)' }}
      >
        {label}
        <FiChevronDown className={`transition-transform duration-300 ease-out ${open ? 'rotate-180' : ''}`} />
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-out ${
        open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="pl-6 py-2 space-y-1">
          {items.map((item, index) => (
            <div
              key={item.name}
              className={`transition-all duration-300 ease-out ${
                open 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-2'
              }`}
              style={{ transitionDelay: open ? `${index * 50}ms` : '0ms' }}
            >
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-base py-2 px-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                  onClick={onNavigate}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="block text-base py-2 px-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                  onClick={onNavigate}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
