"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Play, Pause, Heart, Headphones } from "lucide-react"

interface Comment {
  id: string
  title: string
  content_text: string
  content_audio_url: string
  owner: string
  owner_username: string
  owner_name: string
  owner_profile_image?: string
  likes: number
  stream_count: number
  created_at: string
}

interface CommentPlayerProps {
  comment: Comment
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
}

export function CommentPlayer({ comment, isPlaying, onPlay, onPause }: CommentPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Check if audio URL is valid
  const hasValidAudioUrl = comment.content_audio_url && comment.content_audio_url.trim() !== ""

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !hasValidAudioUrl) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration || 0)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", onPause)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", onPause)
    }
  }, [onPause, hasValidAudioUrl])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !hasValidAudioUrl) return

    if (isPlaying) {
      audio.play()
    } else {
      audio.pause()
    }
  }, [isPlaying, hasValidAudioUrl])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Recent"

    try {
      // Check if the date is in ISO format
      if (dateString.includes("T") && dateString.includes("Z")) {
        return new Date(dateString).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      }

      // Try parsing as timestamp (if it's a number)
      if (!isNaN(Number(dateString))) {
        return new Date(Number(dateString)).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      }

      // If we get here, the date format is unknown
      return "Unknown date"
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Unknown date"
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration && hasValidAudioUrl) {
      const rect = e.currentTarget.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      audioRef.current.currentTime = percent * duration
    }
  }

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-start space-x-4">
        <Avatar className="w-10 h-10 ring-2 ring-purple-400/30">
          <AvatarImage src={comment.owner_profile_image || ""} />
          <AvatarFallback className="bg-gradient-to-r from-gray-600 to-gray-700 text-white text-sm font-bold">
            {(comment.owner_name || comment.owner_username || "U").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h5 className="font-semibold text-white text-lg">{comment.title}</h5>
              <div className="flex items-center space-x-2 text-white/70 text-sm">
                <span className="font-medium">{comment.owner_name || comment.owner_username || "Unknown User"}</span>
                <span>•</span>
                <span>{formatDate(comment.created_at)}</span>
              </div>
            </div>
            <span className="text-white/60 text-sm">{hasValidAudioUrl ? formatTime(duration) : "No audio"}</span>
          </div>

          {/* Content */}
          <p className="text-white/90 text-sm leading-relaxed">{comment.content_text}</p>

          {/* Audio Controls - Only show if there's valid audio */}
          {hasValidAudioUrl ? (
            <div className="space-y-3">
              {/* Progress Bar */}
              <div className="w-full bg-white/20 rounded-full h-1.5 cursor-pointer" onClick={handleProgressClick}>
                <div
                  className="bg-gradient-to-r from-purple-400 to-pink-400 h-1.5 rounded-full transition-all duration-100"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>

              {/* Controls and Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={isPlaying ? onPause : onPlay}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-0"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </Button>

                  <div className="flex items-center space-x-3 text-sm text-white/60">
                    <span className="flex items-center space-x-1">
                      <Headphones className="w-3 h-3" />
                      <span>{comment.stream_count}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Heart className="w-3 h-3" />
                      <span>{comment.likes}</span>
                    </span>
                  </div>
                </div>

                <div className="text-white/60 text-xs">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
            </div>
          ) : (
            /* No Audio Available */
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3 text-sm text-white/60">
                <span className="flex items-center space-x-1">
                  <Headphones className="w-3 h-3" />
                  <span>{comment.stream_count}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Heart className="w-3 h-3" />
                  <span>{comment.likes}</span>
                </span>
              </div>
              <div className="text-white/50 text-xs italic">Text only</div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Audio Element - Only render if there's a valid URL */}
      {hasValidAudioUrl && <audio ref={audioRef} src={comment.content_audio_url} preload="metadata" />}
    </div>
  )
}
