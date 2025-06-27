"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function GetStartedPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const router = useRouter()

  // Images for rotating background
  const backgroundImages = [
    "/bg_discover.png",
    "/chair_bg.svg", 
    "/homeBg.svg",
    "/person.jpg",
    "/podCast.svg"
  ]

  // Rotate images every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
    }, 1000)
    return () => clearInterval(interval)
  }, [backgroundImages.length])

  useEffect(() => {
    // Check if user is already logged in
    const accessToken = localStorage.getItem("access_token")
    if (accessToken) {
      const redirectUrl = localStorage.getItem("redirect_after_login")
      if (redirectUrl) {
        localStorage.removeItem("redirect_after_login")
        router.push(redirectUrl)
      } else {
        router.push("/")
      }
    }
  }, [router])

  // Email/Password login function
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch(
        "https://python-dev-server-dscvhfehfpb4gqd9.centralus-01.azurewebsites.net/auth/email-auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email || "piyush11433@gmail.com",
            full_name: "User",
            is_creator: true,
          }),
        },
      )

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("access_token", data.access_token)
        localStorage.setItem("refresh_token", data.refresh_token)
        localStorage.setItem("user", JSON.stringify(data.user))

        const redirectUrl = localStorage.getItem("redirect_after_login")
        if (redirectUrl) {
          localStorage.removeItem("redirect_after_login")
          router.push(redirectUrl)
        } else {
          router.push("/")
        }
      } else {
        console.error("Login failed:", response.statusText)
      }
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Social login function (preserved from get-started)
  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        "https://python-dev-server-dscvhfehfpb4gqd9.centralus-01.azurewebsites.net/auth/email-auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "piyush11433@gmail.com",
            full_name: "Piyush",
            is_creator: true,
          }),
        },
      )

      if (response.ok) {
        const data = await response.json()
        console.log("Login successful:", data)

        // Store tokens in localStorage
        localStorage.setItem("access_token", data.access_token)
        localStorage.setItem("refresh_token", data.refresh_token)
        localStorage.setItem("user", JSON.stringify(data.user))

        // Check if there's a redirect URL stored
        const redirectUrl = localStorage.getItem("redirect_after_login")

        if (redirectUrl) {
          // Remove the redirect URL from storage and redirect to intended page
          localStorage.removeItem("redirect_after_login")
          router.push(redirectUrl)
        } else {
          // Default redirect to home page
          router.push("/")
        }
      } else {
        console.error("Login failed:", response.statusText)
      }
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image with Text Overlay */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background Images */}
        {backgroundImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-300 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Text Content */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white max-w-lg">
            <h1 className="text-5xl font-light mb-6 leading-tight">
              Everything you need,<br />
              to make anything you<br />
              want.
            </h1>
            <p className="text-lg font-light opacity-90">
              Dozens of creative tools to ideate,<br />
              generate and edit content like never<br />
              before.
            </p>
          </div>
        </div>
        
        {/* Logo */}
        <div className="absolute top-8 left-8">
          <h2 className="text-white text-2xl font-light">eurus labs</h2>
        </div>
      </div>

      {/* Right Side - Get Started Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Start creating on Eurus Labs
            </h1>
            <p className="text-gray-600">
              Join 250,000+ creators building fandoms, earning from memberships, and selling digital products.
            </p>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
            <Input
              type="email"
              placeholder="Username or Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />
            <Input
              type="password" 
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-black text-white rounded-lg hover:bg-gray-800 font-medium"
            >
              {isLoading ? "Getting started..." : "Get Started"}
            </Button>
          </form>

          {/* Divider */}
          <div className="text-center mb-6">
            <span className="text-gray-400 text-sm">OR</span>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
              variant="outline"
              className="w-full h-12 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              <div className="flex items-center justify-center space-x-3">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
              </div>
            </Button>
            
            <Button
              type="button"
              onClick={() => handleSocialLogin("apple")}
              disabled={isLoading}
              variant="outline"
              className="w-full h-12 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              <div className="flex items-center justify-center space-x-3">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                )}
                <span>{isLoading ? "Signing in..." : "Continue with Apple"}</span>
              </div>
            </Button>

            <Button
              type="button"
              onClick={() => handleSocialLogin("facebook")}
              disabled={isLoading}
              variant="outline"
              className="w-full h-12 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              <div className="flex items-center justify-center space-x-3">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#1877F2"
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                )}
                <span>{isLoading ? "Signing in..." : "Continue with Facebook"}</span>
              </div>
            </Button>

            <Button
              type="button"
              onClick={() => handleSocialLogin("sso")}
              disabled={isLoading}
              variant="outline"
              className="w-full h-12 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              <span>{isLoading ? "Signing in..." : "Use Single Sign-On (SSO)"}</span>
            </Button>
          </div>

          {/* Terms */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-xs">
              By signing up, you are creating a Eurus Labs account and agree to Eurus Labs'{" "}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
