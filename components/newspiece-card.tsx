"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Newspiece } from "../types/newspiece"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Lock, Star, ImageIcon, Eye } from "lucide-react"

interface NewspieceCardProps {
  newspiece: Newspiece
  index: number
}

export function NewspieceCard({ newspiece, index }: NewspieceCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const router = useRouter()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(false)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  const handleViewContent = () => {
    // Check if user is logged in
    const accessToken = localStorage.getItem("access_token")

    if (!accessToken) {
      // Store the intended destination before redirecting to login
      const intendedUrl = `/newspiece/${newspiece.newspiece}`
      localStorage.setItem("redirect_after_login", intendedUrl)

      // User not logged in, redirect to login page
      router.push("/login")
      return
    }

    // User is logged in, proceed to content
    router.push(`/newspiece/${newspiece.newspiece}`)
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl transition-all duration-700 hover:scale-[1.02] cursor-pointer ${
        index % 3 === 0 ? "md:col-span-2 md:row-span-2" : ""
      }`}
      style={{
        background: `linear-gradient(135deg, ${newspiece.gradient_primary}20, ${newspiece.gradient_secondary || newspiece.gradient_primary}40)`,
        animationDelay: `${index * 100}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewContent}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {newspiece.image && !imageError ? (
          <>
            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {/* Actual image */}
            <img
              src={newspiece.image || "https://eurusworkflows.blob.core.windows.net/eurusworkflows/placeholder.svg"}
              alt={newspiece.title}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          </>
        ) : (
          /* Fallback when no image or error */
          <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-r from-white/10 to-white/20 rounded-full flex items-center justify-center mx-auto">
                <ImageIcon className="w-8 h-8 text-white/40" />
              </div>
              <p className="text-white/30 text-sm font-medium">Album Artwork</p>
            </div>
          </div>
        )}

        {/* Gradient Overlays */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${newspiece.gradient_primary}60, ${newspiece.gradient_secondary || newspiece.gradient_primary}80)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative h-full p-6 flex flex-col justify-between min-h-[300px]">
        {/* Top Section */}
        <div className="space-y-3">
          {/* Genre and Premium Badge */}
          <div className="flex items-center justify-between">
            {newspiece.genre && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {newspiece.genre}
              </Badge>
            )}
            {newspiece.premium && (
              <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                <Crown className="w-3 h-3" />
                <span>${newspiece.subscription_price}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-white font-bold text-xl leading-tight line-clamp-2 group-hover:text-yellow-300 transition-colors">
            {newspiece.title}
          </h3>

          {/* Owner */}
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <p className="text-white/80 text-sm font-medium">by {newspiece.owner_name}</p>
          </div>
        </div>

        {/* Middle Section - Description */}
        <div className="flex-1 py-4">
          <p className="text-white/90 text-sm leading-relaxed line-clamp-3">{newspiece.intro_text}</p>
        </div>

        {/* Bottom Section */}
        <div className="space-y-4">
          {/* Date and Access */}
          <div className="flex items-center justify-between text-xs text-white/70">
            <span>{formatDate(newspiece.date_created)}</span>
            {newspiece.access !== "Everyone" && (
              <div className="flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>{newspiece.access}</span>
              </div>
            )}
          </div>

          {/* View Button */}
          <div className="flex items-center justify-between">
            <Button
              onClick={(e) => {
                e.stopPropagation()
                handleViewContent()
              }}
              className={`
                relative overflow-hidden bg-white/20 hover:bg-white/30 text-white border-white/30 
                backdrop-blur-sm transition-all duration-300 rounded-full px-6 py-2
                ${isHovered ? "scale-105" : ""}
              `}
            >
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">View</span>
              </div>
            </Button>

            {/* Visual Indicator */}
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-white/60 rounded-full transition-all duration-300 ${
                    isHovered ? "animate-pulse" : ""
                  }`}
                  style={{
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      <div
        className={`
        absolute inset-0 bg-gradient-to-t from-black/50 to-transparent 
        transition-opacity duration-300 pointer-events-none
        ${isHovered ? "opacity-100" : "opacity-0"}
      `}
      />
    </div>
  )
}
