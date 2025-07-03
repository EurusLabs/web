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
import { FiMenu, FiX, FiChevronDown, FiMoon } from "react-icons/fi"
import { useTheme } from 'next-themes'
import { FaMoon } from "react-icons/fa"
import clsx from 'clsx'

interface NavigationProps {
  forceWhite?: boolean;
}

export default function Navigation({ forceWhite = false }: NavigationProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const sidebarRef = useRef(null)
  const { theme, setTheme } = useTheme()

  // Set navigation color: black in light mode, white in dark mode
  const navColor = theme === 'dark' ? 'text-white' : 'text-black';

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
      {/* Top left logo and menu icon */}
      {!menuOpen && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-between w-full bg-transparent px-4 py-3">
          <div className="flex items-center">
            <Link href="/" className={clsx("text-2xl font-medium tracking-normal transition-colors mr-4", navColor)} style={{ fontFamily: 'var(--font-sf-pro)' }}>
              Eurus Labs
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={clsx("text-2xl focus:outline-none bg-transparent transition-colors", navColor)}
              aria-label="Open menu"
            >
              <FiMenu />
            </button>
          </div>
          <Link href="/get-started" className="ml-4 px-6 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/80 transition hidden sm:inline-block">
            Get Started
          </Link>
        </div>
      )}
      {/* Sidebar overlay */}
      {menuOpen && (
        <nav
          ref={sidebarRef}
          className={`fixed top-0 left-0 h-full w-72 flex flex-col py-8 px-6 z-50 bg-background/90 ${navColor}`}
        >
          {/* Logo and close icon row */}
          <div className="flex items-center mb-8">
            <Link
              href="/"
              className={clsx("text-2xl font-medium tracking-normal transition-colors mr-auto", navColor)}
              style={{ fontFamily: 'var(--font-sf-pro)' }}
            >
              Eurus Labs
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className={clsx("text-2xl ml-2 transition-colors", navColor)}
              aria-label="Close menu"
            >
              <FiX />
            </button>
          </div>
          {/* Menu Items */}
          <Dropdown label="Product" textColor="inherit">
            <a href="https://eidos.press/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground/70 transition-colors">Eidos</a>
            <Link href="/eurus-studio" className="hover:text-foreground/70 transition-colors">Studio</Link>
            <a href="http://localhost:3001" target="_blank" rel="noopener noreferrer" className="hover:text-foreground/70 transition-colors">Write</a>
            <a href="https://www.relayedstories.com/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground/70 transition-colors">Relay</a>
          </Dropdown>
          <Dropdown label="Publications" textColor="inherit">
            <Link href="/publications" className="hover:text-foreground/70 transition-colors">Research</Link>
            <Link href="/announcements" className="hover:text-foreground/70 transition-colors">Announcements</Link>
            <Link href="/blog" className="hover:text-foreground/70 transition-colors">Blog</Link>
          </Dropdown>
          <Link href="/manifesto" className="text-base font-medium py-2 px-4 rounded hover:bg-background/20">Manifesto</Link>
          <Link href="/community" className="text-base font-medium py-2 px-4 rounded hover:bg-background/20">Community</Link>
          {/* Light/Dark mode toggle at the bottom right */}
          <div className="mt-auto flex items-end justify-end w-full">
            <button
              className={clsx(
                "text-xl p-2 rounded-full transition-colors",
                theme === 'dark' ? 'text-foreground hover:bg-foreground/10' : 'text-neutral-700 hover:bg-neutral-200'
              )}
              aria-label="Toggle dark mode"
              style={{ position: 'absolute', bottom: 24, right: 24 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <FaMoon /> : <FiMoon />}
            </button>
          </div>
        </nav>
      )}
    </>
  )
}

// Sleek dropdown component
function Dropdown({ label, children, textColor }: { label: string, children: React.ReactNode, textColor: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center w-full text-base font-medium py-2 px-4 rounded hover:bg-gray-800 focus:outline-none ${textColor}`}
        style={{ fontFamily: 'var(--font-sf-pro)' }}
      >
        {label}
        <FiChevronDown className={`ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="ml-6 flex flex-col space-y-2 mt-1">
          {children}
        </div>
        )}
      </div>
  )
}
