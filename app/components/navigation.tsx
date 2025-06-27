"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in
    const accessToken = localStorage.getItem("access_token")
    const userData = localStorage.getItem("user")

    if (accessToken && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    }
  }, [])

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
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-sm">
      {/* Left - Eurus Labs Logo */}
      <div className="flex-shrink-0">
        <Link href="/" className="text-white text-2xl font-medium tracking-normal hover:text-gray-300 transition-colors" style={{ fontFamily: 'Dancing Script, cursive' }}>
          eurus labs<span className="text-red-500 ml-1">.</span>
        </Link>
      </div>

      {/* Center - Navigation Items */}
      <div className="flex items-center justify-center space-x-8 flex-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white hover:text-gray-300 transition-colors p-0 h-auto font-normal">
              Products
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-black/90 backdrop-blur-sm border-white/20">
            <DropdownMenuItem asChild>
              <Link href="/eurus-studio" className="text-white hover:text-gray-300 cursor-pointer">
                Eurus Studio
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a 
                href="http://localhost:3001" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 cursor-pointer"
              >
                Eurus Draft
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a 
                href="https://www.relayedstories.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 cursor-pointer"
              >
                Relay
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/discover" className="text-white hover:text-gray-300 cursor-pointer">
                Eidos
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link href="/research" className="text-white hover:text-gray-300 transition-colors">
          Research
        </Link>
        <Link href="/manifesto" className="text-white hover:text-gray-300 transition-colors">
          Manifesto
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white hover:text-gray-300 transition-colors p-0 h-auto font-normal">
              Learn
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-black/90 backdrop-blur-sm border-white/20">
            <DropdownMenuItem asChild>
              <Link href="/academy" className="text-white hover:text-gray-300 cursor-pointer">
                Academy
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a 
                href="https://eurus-labs.gitbook.io/eurus-labs/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 cursor-pointer"
              >
                Documentation
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/community" className="text-white hover:text-gray-300 cursor-pointer">
                Community
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right - Auth Buttons */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        {isLoggedIn ? (
          <>
            {user && <span className="text-white/80 text-sm font-medium">Welcome, {user.name || user.username}</span>}
            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white border-none rounded-full px-6 py-2 font-medium transition-all duration-300 hover:scale-105"
              style={{
                fontFamily: "var(--font-sf-pro)",
                fontWeight: 500,
                fontSize: "14px",
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button asChild className="bg-white/90 text-black hover:bg-white transition-colors rounded-full px-6">
            <Link href="/get-started">Get Started</Link>
          </Button>
        )}
      </div>
    </nav>
  )
}
