"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { usePosts } from "../../../hooks/usePosts"
import { useNewspieces } from "../../../hooks/useNewspieces"
import { useComments } from "../../../hooks/useComments"
import { CommentPlayer } from "../../../components/comment-player"
import Navigation from "../../components/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Clock,
  Users,
  MessageCircle,
  Calendar,
  Headphones,
  Volume2,
  FileText,
  X,
  Radio,
  Mic,
  Square,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function NewspieceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const newspieceId = params.id as string
  const { posts, loading, error } = usePosts(newspieceId)
  const { newspieces } = useNewspieces(50)

  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTranscriptIndex, setCurrentTranscriptIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState(0) // 0: off, 1: all, 2: one
  const [showTranscript, setShowTranscript] = useState(false)
  const [isTranscriptAnimating, setIsTranscriptAnimating] = useState(false)
  const [hideAnimationType, setHideAnimationType] = useState("float") // 'float' or 'slide'
  const [isLikingPost, setIsLikingPost] = useState(false)
  const [updatedLikeCounts, setUpdatedLikeCounts] = useState<Record<string, number>>({})

  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showRecordingModal, setShowRecordingModal] = useState(false)
  const [recordingStatus, setRecordingStatus] = useState<"idle" | "recording" | "processing" | "completed">("idle")
  const [postTitle, setPostTitle] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTranscript, setRecordingTranscript] = useState("")
  const [transcriptionData, setTranscriptionData] = useState<any>(null)
  const [isReplyRecording, setIsReplyRecording] = useState(false)

  const [introAudioRef, setIntroAudioRef] = useState<HTMLAudioElement | null>(null)
  const [isPlayingIntro, setIsPlayingIntro] = useState(false)

  // Comments state
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({})
  const [playingComment, setPlayingComment] = useState<string | null>(null)

  const [globalAudioContext, setGlobalAudioContext] = useState<{
    type: "main" | "intro" | "comment"
    id?: string
    audioRef?: HTMLAudioElement
  } | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)
  const transcriptRef = useRef<HTMLDivElement>(null)

  // Find the current newspiece data
  const currentNewspiece = newspieces.find((n) => n.newspiece === newspieceId)

  // Calculate stats
  const totalStreams = posts.reduce((acc, post) => acc + post.streams, 0)
  const totalLikes = posts.reduce((acc, post) => acc + post.likes, 0)
  const totalDuration = posts.reduce((acc, post) => acc + post.duration, 0)
  const avgEngagement = posts.length > 0 ? Math.round((totalLikes / totalStreams) * 100) || 0 : 0

  // Fetch comment counts for all posts
  useEffect(() => {
    const fetchCommentCounts = async () => {
      const counts: Record<string, number> = {}

      for (const post of posts) {
        try {
          const response = await fetch(
            `https://python-dev-server-dscvhfehfpb4gqd9.centralus-01.azurewebsites.net/post/${post.id}/citing_posts`,
          )
          if (response.ok) {
            const comments = await response.json()
            counts[post.id] = comments.length
          } else {
            counts[post.id] = 0
          }
        } catch (error) {
          counts[post.id] = 0
        }
      }

      setCommentCounts(counts)
    }

    if (posts.length > 0) {
      fetchCommentCounts()
    }
  }, [posts])

  // Update current time and transcript highlighting
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      setCurrentTime(audio.currentTime)

      // Update transcript highlighting
      if (posts[currentTrack]?.timestamping) {
        const currentTimestamp = posts[currentTrack].timestamping.find(
          (timestamp) => audio.currentTime >= timestamp.start && audio.currentTime <= timestamp.end,
        )

        if (currentTimestamp) {
          const index = posts[currentTrack].timestamping.indexOf(currentTimestamp)
          setCurrentTranscriptIndex(index)
        }
      }
    }

    const updateDuration = () => {
      setDuration(audio.duration || 0)
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", () => {
      if (repeatMode === 2) {
        // Repeat one
        audio.currentTime = 0
        audio.play()
      } else if (currentTrack < posts.length - 1) {
        setCurrentTrack(currentTrack + 1)
      } else if (repeatMode === 1) {
        // Repeat all
        setCurrentTrack(0)
      } else {
        setIsPlaying(false)
      }
    })

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
    }
  }, [currentTrack, posts, repeatMode])

  // Load new track when currentTrack changes
  useEffect(() => {
    if (posts[currentTrack] && audioRef.current) {
      audioRef.current.src = posts[currentTrack].content_audio_url
      audioRef.current.volume = volume
      audioRef.current.load()
      setCurrentTime(0)
      setCurrentTranscriptIndex(0)
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentTrack, posts, isPlaying])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Initialize intro audio
  useEffect(() => {
    if (currentNewspiece?.intro_audio) {
      const audio = new Audio(currentNewspiece.intro_audio)
      audio.addEventListener("ended", () => setIsPlayingIntro(false))
      setIntroAudioRef(audio)

      return () => {
        audio.removeEventListener("ended", () => setIsPlayingIntro(false))
        audio.pause()
      }
    }
  }, [currentNewspiece?.intro_audio])

  const pauseAllAudio = () => {
    // Pause main audio
    if (audioRef.current && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    }

    // Pause intro audio
    if (introAudioRef && isPlayingIntro) {
      introAudioRef.pause()
      setIsPlayingIntro(false)
    }

    // Pause any playing comments
    if (playingComment) {
      setPlayingComment(null)
    }

    setGlobalAudioContext(null)
  }

  const togglePlayPause = () => {
    // Pause all other audio first
    pauseAllAudio()

    // If we have intro audio and no posts are loaded yet, play intro
    if (currentNewspiece?.intro_audio && posts.length === 0) {
      if (introAudioRef) {
        if (isPlayingIntro) {
          introAudioRef.pause()
          setIsPlayingIntro(false)
          setGlobalAudioContext(null)
        } else {
          introAudioRef.play()
          setIsPlayingIntro(true)
          setGlobalAudioContext({ type: "intro", audioRef: introAudioRef })
        }
      }
      return
    }

    // If we have intro audio and it's the first time playing, play intro first
    if (currentNewspiece?.intro_audio && !isPlaying && currentTrack === 0 && currentTime === 0) {
      if (introAudioRef) {
        introAudioRef.play()
        setIsPlayingIntro(true)
        setGlobalAudioContext({ type: "intro", audioRef: introAudioRef })
        // After intro ends, start the first track
        introAudioRef.addEventListener(
          "ended",
          () => {
            setIsPlayingIntro(false)
            if (audioRef.current) {
              audioRef.current.play()
              setIsPlaying(true)
              setGlobalAudioContext({ type: "main", audioRef: audioRef.current })
            }
          },
          { once: true },
        )
      }
      return
    }

    // Normal track playback
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
        setGlobalAudioContext(null)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
        setGlobalAudioContext({ type: "main", audioRef: audioRef.current })
      }
    }
  }

  const playTrack = (index: number) => {
    pauseAllAudio()
    setCurrentTrack(index)
    setIsPlaying(true)
    if (audioRef.current) {
      setGlobalAudioContext({ type: "main", audioRef: audioRef.current })
    }
  }

  const previousTrack = () => {
    if (currentTrack > 0) {
      setCurrentTrack(currentTrack - 1)
    } else if (repeatMode === 1) {
      setCurrentTrack(posts.length - 1)
    }
  }

  const nextTrack = () => {
    if (currentTrack < posts.length - 1) {
      setCurrentTrack(currentTrack + 1)
    } else if (repeatMode === 1) {
      setCurrentTrack(0)
    }
  }

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const toggleTranscript = () => {
    if (showTranscript) {
      // Randomly choose hide animation for variety
      setHideAnimationType(Math.random() > 0.5 ? "float" : "slide")
      setIsTranscriptAnimating(true)
      setTimeout(
        () => {
          setShowTranscript(false)
          setIsTranscriptAnimating(false)
        },
        hideAnimationType === "slide" ? 600 : 500,
      )
    } else {
      setShowTranscript(true)
      setIsTranscriptAnimating(true)
      setTimeout(() => {
        setIsTranscriptAnimating(false)
      }, 500)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatDateDetailed = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  // Function to highlight current playing text
  const highlightCurrentText = (text: string, timestamp: any) => {
    if (!isPlaying) return <span className="text-white/90">{text}</span>

    // Split text into words and highlight them progressively
    const words = text.split(" ")
    const totalDuration = timestamp.end - timestamp.start
    const currentProgress = currentTime - timestamp.start
    const progressRatio = Math.max(0, Math.min(1, currentProgress / totalDuration))
    const wordsToHighlight = Math.floor(words.length * progressRatio)

    return (
      <span>
        {words.map((word, wordIndex) => (
          <span
            key={wordIndex}
            className={`transition-all duration-300 ${
              wordIndex <= wordsToHighlight
                ? "text-cyan-300 bg-cyan-400/20 px-1 py-0.5 rounded-md shadow-lg shadow-cyan-400/20"
                : "text-white/90"
            }`}
          >
            {word}{" "}
          </span>
        ))}
      </span>
    )
  }

  // Get current playing transcript segment
  const getCurrentTranscriptSegment = () => {
    if (!posts[currentTrack]?.timestamping || currentTranscriptIndex < 0) return null
    return posts[currentTrack].timestamping[currentTranscriptIndex]
  }

  const handleLikePost = async () => {
    if (!currentPost || isLikingPost) return

    setIsLikingPost(true)
    try {
      const response = await fetch(
        `https://python-dev-server-dscvhfehfpb4gqd9.centralus-01.azurewebsites.net/post/${currentPost.id}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (response.ok) {
        // Toggle the like state
        setIsLiked(!isLiked)

        // Update the like count for the current post
        const newLikeCount = isLiked ? currentPost.likes - 1 : currentPost.likes + 1
        setUpdatedLikeCounts((prev) => ({
          ...prev,
          [currentPost.id]: newLikeCount,
        }))
      } else {
        console.error("Failed to like/unlike post")
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error)
    } finally {
      setIsLikingPost(false)
    }
  }

  const cleanTranscriptText = (text: string) => {
    // Remove speaker labels like [Speaker 1], [Speaker 2], etc.
    return text.replace(/\[Speaker \d+\]\s*/g, "").trim()
  }

  const startRecording = async () => {
    try {
      // Pause current audio if playing
      if (audioRef.current && isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      }

      // Pause intro audio if playing
      if (introAudioRef && isPlayingIntro) {
        introAudioRef.pause()
        setIsPlayingIntro(false)
      }

      setShowRecordingModal(true)
      setRecordingStatus("recording")
      setRecordingTranscript("")
      setTranscriptionData(null)

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" })
        setRecordedBlob(blob)
        setRecordingStatus("processing")

        // Process the recording
        try {
          const uploadResult = await uploadAudio(blob)
          console.log("Upload result:", uploadResult)

          const transcriptionResult = await transcribeAudio(uploadResult.content_audio_url)
          console.log("Transcription result:", transcriptionResult)

          // Clean the transcript by removing speaker labels
          const cleanTranscript = cleanTranscriptText(transcriptionResult.content_text)
          setRecordingTranscript(cleanTranscript)
          setTranscriptionData(transcriptionResult)
          setRecordingStatus("completed")
        } catch (error) {
          console.error("Error processing recording:", error)
          setRecordingTranscript("Error generating transcript. Please try again.")
          setRecordingStatus("completed")
        }

        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
      setShowRecordingModal(false)
      setRecordingStatus("idle")
    }
  }

  const stopRecording = async () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }
  }

  const cancelRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }

    // Clean up states
    setShowRecordingModal(false)
    setRecordingStatus("idle")
    setRecordedBlob(null)
    setRecordingTranscript("")
    setTranscriptionData(null)
    setPostTitle("")
    setIsReplyRecording(false) // Reset reply state
  }

  const uploadAudio = async (file: Blob) => {
    console.log("Starting audio upload for file:", file)

    const formData = new FormData()
    formData.append("file", file, "recording.webm")

    const response = await fetch(
      "https://python-dev-server-dscvhfehfpb4gqd9.centralus-01.azurewebsites.net/audio/upload/file",
      {
        method: "POST",
        body: formData,
      },
    )

    if (!response.ok) {
      throw new Error("Upload failed")
    }

    return await response.json()
  }

  const transcribeAudio = async (audioUrl: string) => {
    const response = await fetch(
      "https://python-dev-server-dscvhfehfpb4gqd9.centralus-01.azurewebsites.net/audio/diarize_and_transcribe/new",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio_url: audioUrl,
        }),
      },
    )

    if (!response.ok) {
      throw new Error("Transcription failed")
    }

    return await response.json()
  }

  const createPost = async (title: string, contentText: string, audioUrl: string, timestamping: any[]) => {
    // Get the logged-in user's data
    const userData = localStorage.getItem("user")
    const user = userData ? JSON.parse(userData) : null

    // Determine posts_cited based on whether this is a reply
    const postsCited = isReplyRecording && currentPost ? [currentPost.id] : []

    const response = await fetch(
      "https://python-dev-server-dscvhfehfpb4gqd9.centralus-01.azurewebsites.net/post/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          owner: user?.id || user?.user_id || "Unknown", // Use logged-in user's ID
          tags: [],
          content_text: contentText,
          content_audio_url: audioUrl,
          timestamping: timestamping,
          posts_cited: postsCited, // Include current post ID if this is a reply
          newspiece_id: newspieceId,
          visibility_users: [],
          access_users: [],
          visibility: "Everyone",
          access: "Everyone",
          soundscape: "",
          genre: currentNewspiece?.genre || "",
        }),
      },
    )

    if (!response.ok) {
      throw new Error("Post creation failed")
    }

    return await response.json()
  }

  const handleRecordingSubmit = async () => {
    if (!recordedBlob || (!isReplyRecording && !postTitle.trim()) || !recordingTranscript) return

    setIsProcessing(true)
    try {
      // Upload audio again to get the URL (or store it from previous upload)
      const uploadResult = await uploadAudio(recordedBlob)

      // Use the title or generate a default one for replies
      const finalTitle = isReplyRecording ? `Reply to ${currentPost?.title || "post"}` : postTitle

      // Use the already transcribed content
      const postResult = await createPost(
        finalTitle,
        recordingTranscript,
        uploadResult.content_audio_url,
        transcriptionData?.timestamping || [],
      )
      console.log("Post created:", postResult)

      // Reset states
      setShowRecordingModal(false)
      setRecordingStatus("idle")
      setPostTitle("")
      setRecordedBlob(null)
      setRecordingTranscript("")
      setIsReplyRecording(false) // Reset reply state

      // Refresh the page to show new post
      window.location.reload()
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const startReplyRecording = async () => {
    // Pause current audio if playing
    if (audioRef.current && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    }

    setIsReplyRecording(true)
    await startRecording()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin mx-auto" />
              <div
                className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-pink-400 rounded-full animate-spin mx-auto"
                style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
              />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Loading Audio Collection
              </p>
              <p className="text-white/80 text-lg">Preparing your listening experience...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !currentNewspiece) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6 p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <Headphones className="w-8 h-8 text-red-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Content Unavailable</h3>
              <p className="text-red-400 text-lg">Unable to load audio content: {error}</p>
            </div>
            <Button
              onClick={() => router.back()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none px-8 py-3 rounded-full font-semibold"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show intro-only mode when no posts but newspiece exists
  if (posts.length === 0 && currentNewspiece) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white">
        <Navigation />

        <div className="pt-20 pb-60">
          {/* Hero Section - Intro Only */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 via-transparent to-transparent" />

            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="grid grid-cols-1 mb-12">
                <div className="lg:col-span-2 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      {currentNewspiece?.genre && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none px-4 py-2 text-sm font-semibold">
                          {currentNewspiece.genre}
                        </Badge>
                      )}
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                      {currentNewspiece?.title || "Audio Collection"}
                    </h1>

                    <p className="text-xl text-white/80 leading-relaxed max-w-3xl">
                      {currentNewspiece?.intro_text || "A curated collection of audio content"}
                    </p>

                    {/* Creator Info with Intro Audio */}
                    <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16 ring-4 ring-purple-400/50">
                          <AvatarImage src={currentNewspiece.image || ""} />
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold">
                            {currentNewspiece.owner_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-lg font-semibold text-white">Created by {currentNewspiece.owner_name}</p>
                          <p className="text-white/70 flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDateDetailed(currentNewspiece.date_created)}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          onClick={isRecording ? stopRecording : startRecording}
                          disabled={isUploading || isProcessing || recordingStatus === "recording"}
                          className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg ${
                            isRecording
                              ? "bg-red-500 hover:bg-red-600 animate-pulse"
                              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          } text-white font-semibold`}
                        >
                          {isRecording ? (
                            <>
                              <Square className="w-5 h-5" />
                              <span>Stop Recording</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-5 h-5" />
                              <span>Create New Track</span>
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={togglePlayPause}
                          className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/30"
                        >
                          {isPlayingIntro ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                        </Button>
                      </div>
                    </div>

                    {/* No Content Message */}
                    <div className="text-center py-16">
                      <div className="space-y-6 max-w-md mx-auto">
                        <div className="w-24 h-24 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full mx-auto flex items-center justify-center backdrop-blur-xl border border-white/20">
                          <Headphones className="w-12 h-12 text-white/60" />
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-2xl font-bold text-white">No Tracks Yet</h3>
                          <p className="text-white/70 leading-relaxed">
                            This album is just getting started. Listen to the introduction above to learn more about
                            what's coming.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Audio Player for Intro Only */}
        {currentNewspiece?.intro_audio && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-2xl border-t border-white/10">
            <div className="max-w-7xl mx-auto p-6">
              <div className="flex items-center justify-between">
                {/* Album Info */}
                <div className="flex items-center space-x-4 flex-1">
                  <Avatar className="w-14 h-14 ring-2 ring-purple-400/50">
                    <AvatarImage src={currentNewspiece.image || ""} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                      {currentNewspiece.owner_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-white">{currentNewspiece.title}</div>
                    <div className="text-sm text-white/70">Introduction by {currentNewspiece.owner_name}</div>
                  </div>
                </div>

                {/* Play Control */}
                <Button
                  onClick={togglePlayPause}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/30"
                >
                  {isPlayingIntro ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Recording Modal - Available in Intro-Only Mode */}
        {showRecordingModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 rounded-3xl border border-white/20 p-8 max-w-md w-full">
              {recordingStatus === "recording" && (
                <>
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">
                    {isReplyRecording ? "Recording Reply" : "Recording Audio"}
                  </h3>

                  <div className="space-y-6">
                    {/* Recording Animation */}
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                          <Mic className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute inset-0 w-20 h-20 border-4 border-red-400 rounded-full animate-ping opacity-75"></div>
                      </div>

                      {/* Audio Visualizer */}
                      <div className="flex items-center justify-center space-x-2">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-red-400 rounded-full animate-audioWave"
                            style={{
                              height: `${Math.random() * 24 + 8}px`,
                              animationDelay: `${i * 0.1}s`,
                            }}
                          />
                        ))}
                      </div>

                      <p className="text-white/80 text-center">Speak clearly into your microphone</p>
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        onClick={cancelRecording}
                        variant="outline"
                        className="flex-1 border-white/30 text-white/90 hover:bg-white/10 hover:text-white bg-transparent"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={stopRecording}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none font-semibold"
                      >
                        <Square className="w-5 h-5 mr-2" />
                        Stop Recording
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {recordingStatus === "processing" && (
                <>
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">Processing Recording</h3>

                  <div className="space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin"></div>
                      <p className="text-white/80 text-center">Uploading and transcribing your audio...</p>
                    </div>
                  </div>
                </>
              )}

              {recordingStatus === "completed" && (
                <>
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">
                    {isReplyRecording ? "Review Your Reply" : "Add Recording Title"}
                  </h3>

                  <div className="space-y-6">
                    {/* Only show title input for new posts, not replies */}
                    {!isReplyRecording && (
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Title for your recording</label>
                        <input
                          type="text"
                          value={postTitle}
                          onChange={(e) => setPostTitle(e.target.value)}
                          placeholder="Enter a title for your recording..."
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          autoFocus
                        />
                      </div>
                    )}

                    {/* Transcript Preview */}
                    {recordedBlob && (
                      <div className="space-y-3">
                        <label className="block text-white/80 text-sm font-medium">Recording Preview</label>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-h-32 overflow-y-auto">
                          {recordingTranscript ? (
                            <p className="text-white/90 text-sm leading-relaxed">{recordingTranscript}</p>
                          ) : (
                            <p className="text-white/70 text-sm italic">Processing transcript...</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <Button
                        onClick={() => {
                          setShowRecordingModal(false)
                          setRecordingStatus("idle")
                          setPostTitle("")
                          setRecordedBlob(null)
                          setRecordingTranscript("")
                          setIsReplyRecording(false)
                        }}
                        variant="outline"
                        className="flex-1 border-white/30 text-white/90 hover:bg-white/10 hover:text-white bg-transparent"
                        disabled={isProcessing}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleRecordingSubmit}
                        disabled={(!isReplyRecording && !postTitle.trim()) || isProcessing || !recordingTranscript}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none"
                      >
                        {isProcessing ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Creating...</span>
                          </div>
                        ) : isReplyRecording ? (
                          "Post Reply"
                        ) : (
                          "Create Post"
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  const currentPost = posts[currentTrack]
  const currentSegment = getCurrentTranscriptSegment()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white">
      <Navigation />

      <div className="pt-20 pb-60">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 via-transparent to-transparent" />

          <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Collection Info */}
            <div className="grid grid-cols-1 mb-12">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-black px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(totalDuration)}</span>
                    </div>
                    {currentNewspiece?.genre && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none px-4 py-2 text-sm font-semibold">
                        {currentNewspiece.genre}
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                    {currentNewspiece?.title || "Audio Collection"}
                  </h1>

                  <p className="text-xl text-white/80 leading-relaxed max-w-3xl">
                    {currentNewspiece?.intro_text || "A curated collection of audio content"}
                  </p>

                  {/* Creator Info */}
                  {currentNewspiece && (
                    <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16 ring-4 ring-purple-400/50">
                          <AvatarImage src={currentNewspiece.image || ""} />
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold">
                            {currentNewspiece.owner_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-lg font-semibold text-white">Created by {currentNewspiece.owner_name}</p>
                          <p className="text-white/70 flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDateDetailed(currentNewspiece.date_created)}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          onClick={isRecording ? stopRecording : startRecording}
                          disabled={isUploading || isProcessing || recordingStatus === "recording"}
                          className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg ${
                            isRecording
                              ? "bg-red-500 hover:bg-red-600 animate-pulse"
                              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          } text-white font-semibold`}
                        >
                          {isRecording ? (
                            <>
                              <Square className="w-5 h-5" />
                              <span>Stop Recording</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-5 h-5" />
                              <span>Create New Track</span>
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={togglePlayPause}
                          className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/30"
                        >
                          {isPlaying || isPlayingIntro ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5 ml-0.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                  {/* Simple Stats */}
                  {currentNewspiece && (
                    <div className="flex items-center space-x-4 text-white/80">
                      <div className="flex items-center space-x-2">
                        <Headphones className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium">{posts.length} Tracks</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium">{totalStreams.toLocaleString()} Total Streams</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Track List */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">All Tracks</h2>

            <div className="space-y-4">
              {posts.map((post, index) => (
                <TrackCard
                  key={post.id}
                  post={post}
                  index={index}
                  currentTrack={currentTrack}
                  isPlaying={isPlaying}
                  playTrack={playTrack}
                  formatTime={formatTime}
                  formatDate={formatDate}
                  updatedLikeCounts={updatedLikeCounts}
                  commentCount={commentCounts[post.id] || 0}
                  isExpanded={expandedComments.has(post.id)}
                  onToggleComments={() => toggleComments(post.id)}
                  playingComment={playingComment}
                  setPlayingComment={setPlayingComment}
                  pauseAllAudio={pauseAllAudio}
                  setGlobalAudioContext={setGlobalAudioContext}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Transcript Popup - Unique Design */}
      {(showTranscript || isTranscriptAnimating) && currentPost?.timestamping && currentSegment && (
        <div
          className={`fixed bottom-32 left-1/2 transform -translate-x-1/2 w-full max-w-4xl mx-auto px-6 transition-all duration-500 ease-out ${
            showTranscript && !isTranscriptAnimating
              ? "animate-transcriptFloatIn"
              : !showTranscript && isTranscriptAnimating
                ? hideAnimationType === "slide"
                  ? "animate-transcriptHideSlide"
                  : "animate-transcriptFloatOut"
                : showTranscript && isTranscriptAnimating
                  ? "animate-transcriptFloatIn"
                  : "animate-transcriptFloatOut"
          }`}
        >
          {/* Main Transcript Card */}
          <div className="relative">
            {/* Floating Background with Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/30 to-pink-600/20 rounded-3xl blur-xl scale-110" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl blur-2xl scale-125 animate-pulse" />

            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-gray-900/95 via-slate-800/95 to-gray-900/95 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              {/* Animated Top Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-shimmer" />

              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Radio className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Live Transcript
                    </h3>
                  </div>
                  <div className="px-3 py-1 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full border border-purple-400/30">
                    <span className="text-sm text-purple-200 font-medium">{currentPost.title}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTranscript}
                  className="text-white/60 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all duration-300 hover:scale-110"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Current Segment Display */}
              <div className="p-8">
                <div className="space-y-6">
                  {/* Timestamp Badge */}
                  <div className="flex items-center justify-center">
                    <div className="px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full border border-cyan-400/30 backdrop-blur-sm">
                      <span className="text-cyan-300 font-mono text-sm font-semibold">
                        {formatTime(currentSegment.start)} - {formatTime(currentSegment.end)}
                      </span>
                    </div>
                  </div>

                  {/* Main Text Display */}
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl leading-relaxed font-medium tracking-wide">
                      {highlightCurrentText(currentSegment.text, currentSegment)}
                    </div>
                  </div>

                  {/* Audio Visualizer */}
                  <div className="flex items-center justify-center space-x-2 py-4">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 bg-gradient-to-t from-cyan-400 to-blue-500 rounded-full transition-all duration-300 ${
                          isPlaying ? "animate-audioWave" : "h-2"
                        }`}
                        style={{
                          height: isPlaying ? `${Math.random() * 24 + 8}px` : "8px",
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Audio Player Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-2xl border-t border-white/10">
        <div className="max-w-7xl mx-auto p-6">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-white/70 mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div
              className="w-full bg-white/20 rounded-full h-2 cursor-pointer"
              onClick={(e) => {
                if (audioRef.current && duration) {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const percent = (e.clientX - rect.left) / rect.width
                  audioRef.current.currentTime = percent * duration
                }
              }}
            >
              <div
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-100"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Current Track Info */}
            <div className="flex items-center space-x-4 flex-1">
              {currentPost && (
                <>
                  <Avatar className="w-14 h-14 ring-2 ring-purple-400/50">
                    <AvatarImage src={currentPost.owner_image || ""} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                      {currentPost.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-white">{currentPost.title}</div>
                    <div className="text-sm text-white/70">{currentPost.name}</div>
                  </div>
                </>
              )}
            </div>

            {/* Main Controls */}
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikePost}
                disabled={isLikingPost}
                className={`text-white hover:text-gray-300 transition-all duration-300 ${
                  isLiked ? "text-red-400 scale-110" : ""
                } ${isLikingPost ? "opacity-50" : ""}`}
              >
                {isLikingPost ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={startReplyRecording}
                className="text-white hover:text-gray-300 transition-all duration-300 hover:scale-110"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={previousTrack}
                disabled={currentTrack === 0 && repeatMode !== 1}
                className="text-white hover:text-gray-300 disabled:opacity-50 transition-all duration-300 hover:scale-110"
              >
                <SkipBack className="w-6 h-6" />
              </Button>

              <Button
                onClick={togglePlayPause}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/30"
              >
                {isPlaying || isPlayingIntro ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={nextTrack}
                disabled={currentTrack === posts.length - 1 && repeatMode !== 1}
                className="text-white hover:text-gray-300 disabled:opacity-50 transition-all duration-300 hover:scale-110"
              >
                <SkipForward className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTranscript}
                className={`text-white hover:text-gray-300 transition-all duration-300 hover:scale-110 ${
                  showTranscript ? "text-cyan-400 scale-110 bg-cyan-500/20" : ""
                }`}
              >
                <FileText className="w-5 h-5" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-3 flex-1 justify-end">
              <Volume2 className="w-5 h-5 text-white/70" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
                className="w-24 h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} />

      {/* Enhanced CSS Animations */}
      <style jsx global>{`
        @keyframes transcriptFloatIn {
          0% {
            transform: translateX(-50%) translateY(100%) scale(0.8);
            opacity: 0;
            filter: blur(20px);
          }
          50% {
            transform: translateX(-50%) translateY(-10%) scale(1.05);
            opacity: 0.8;
            filter: blur(5px);
          }
          100% {
            transform: translateX(-50%) translateY(0) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
        }

        @keyframes transcriptFloatOut {
          0% {
            transform: translateX(-50%) translateY(0) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
          30% {
            transform: translateX(-50%) translateY(-20%) scale(1.1);
            opacity: 0.7;
            filter: blur(3px);
          }
          70% {
            transform: translateX(-50%) translateY(50%) scale(0.9);
            opacity: 0.3;
            filter: blur(10px);
          }
          100% {
            transform: translateX(-50%) translateY(120%) scale(0.7);
            opacity: 0;
            filter: blur(25px);
          }
        }

        @keyframes transcriptHideSlide {
          0% {
            transform: translateX(-50%) translateY(0) scale(1) rotateX(0deg);
            opacity: 1;
            filter: blur(0px);
          }
          25% {
            transform: translateX(-50%) translateY(-10%) scale(1.02) rotateX(-5deg);
            opacity: 0.8;
            filter: blur(2px);
          }
          50% {
            transform: translateX(-50%) translateY(20%) scale(0.95) rotateX(10deg);
            opacity: 0.5;
            filter: blur(8px);
          }
          75% {
            transform: translateX(-50%) translateY(80%) scale(0.8) rotateX(20deg);
            opacity: 0.2;
            filter: blur(15px);
          }
          100% {
            transform: translateX(-50%) translateY(150%) scale(0.6) rotateX(30deg);
            opacity: 0;
            filter: blur(30px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes audioWave {
          0%, 100% {
            height: 8px;
          }
          50% {
            height: 32px;
          }
        }

        @keyframes expandComments {
          0% {
            max-height: 0;
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            max-height: 1000px;
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes collapseComments {
          0% {
            max-height: 1000px;
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            max-height: 0;
            opacity: 0;
            transform: translateY(-10px);
          }
        }

        .animate-transcriptFloatIn {
          animation: transcriptFloatIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-transcriptFloatOut {
          animation: transcriptFloatOut 0.5s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards;
        }

        .animate-transcriptHideSlide {
          animation: transcriptHideSlide 0.6s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards;
        }

        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 2s linear infinite;
        }

        .animate-audioWave {
          animation: audioWave 0.8s ease-in-out infinite;
        }

        .animate-expandComments {
          animation: expandComments 0.3s ease-out forwards;
        }

        .animate-collapseComments {
          animation: collapseComments 0.3s ease-in forwards;
        }
      `}</style>

      {/* Recording Modal - Available in Both Modes */}
      {showRecordingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 rounded-3xl border border-white/20 p-8 max-w-md w-full">
            {recordingStatus === "recording" && (
              <>
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  {isReplyRecording ? "Recording Reply" : "Recording Audio"}
                </h3>

                <div className="space-y-6">
                  {/* Recording Animation */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                        <Mic className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute inset-0 w-20 h-20 border-4 border-red-400 rounded-full animate-ping opacity-75"></div>
                    </div>

                    {/* Audio Visualizer */}
                    <div className="flex items-center justify-center space-x-2">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-red-400 rounded-full animate-audioWave"
                          style={{
                            height: `${Math.random() * 24 + 8}px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>

                    <p className="text-white/80 text-center">Speak clearly into your microphone</p>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      onClick={cancelRecording}
                      variant="outline"
                      className="flex-1 border-white/30 text-white/90 hover:bg-white/10 hover:text-white bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={stopRecording}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none font-semibold"
                    >
                      <Square className="w-5 h-5 mr-2" />
                      Stop Recording
                    </Button>
                  </div>
                </div>
              </>
            )}

            {recordingStatus === "processing" && (
              <>
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Processing Recording</h3>

                <div className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin"></div>
                    <p className="text-white/80 text-center">Uploading and transcribing your audio...</p>
                  </div>
                </div>
              </>
            )}

            {recordingStatus === "completed" && (
              <>
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  {isReplyRecording ? "Review Your Reply" : "Add Recording Title"}
                </h3>

                <div className="space-y-6">
                  {/* Only show title input for new posts, not replies */}
                  {!isReplyRecording && (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Title for your recording</label>
                      <input
                        type="text"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        placeholder="Enter a title for your recording..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        autoFocus
                      />
                    </div>
                  )}

                  {/* Transcript Preview */}
                  {recordedBlob && (
                    <div className="space-y-3">
                      <label className="block text-white/80 text-sm font-medium">Recording Preview</label>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-h-32 overflow-y-auto">
                        {recordingTranscript ? (
                          <p className="text-white/90 text-sm leading-relaxed">{recordingTranscript}</p>
                        ) : (
                          <p className="text-white/70 text-sm italic">Processing transcript...</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button
                      onClick={() => {
                        setShowRecordingModal(false)
                        setRecordingStatus("idle")
                        setPostTitle("")
                        setRecordedBlob(null)
                        setRecordingTranscript("")
                        setIsReplyRecording(false)
                      }}
                      variant="outline"
                      className="flex-1 border-white/30 text-white/90 hover:bg-white/10 hover:text-white bg-transparent"
                      disabled={isProcessing}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleRecordingSubmit}
                      disabled={(!isReplyRecording && !postTitle.trim()) || isProcessing || !recordingTranscript}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none"
                    >
                      {isProcessing ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Creating...</span>
                        </div>
                      ) : isReplyRecording ? (
                        "Post Reply"
                      ) : (
                        "Create Post"
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Track Card Component with Comments
function TrackCard({
  post,
  index,
  currentTrack,
  isPlaying,
  playTrack,
  formatTime,
  formatDate,
  updatedLikeCounts,
  commentCount,
  isExpanded,
  onToggleComments,
  playingComment,
  setPlayingComment,
  pauseAllAudio,
  setGlobalAudioContext,
}: {
  post: any
  index: number
  currentTrack: number
  isPlaying: boolean
  playTrack: (index: number) => void
  formatTime: (time: number) => string
  formatDate: (dateString: string) => string
  updatedLikeCounts: Record<string, number>
  commentCount: number
  isExpanded: boolean
  onToggleComments: () => void
  playingComment: string | null
  setPlayingComment: (id: string | null) => void
  pauseAllAudio: () => void
  setGlobalAudioContext: React.Dispatch<
    React.SetStateAction<{
      type: "main" | "intro" | "comment"
      id?: string | undefined
      audioRef?: HTMLAudioElement | undefined
    } | null>
  >
}) {
  const { comments, loading } = useComments(isExpanded ? post.id : "")

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
        currentTrack === index
          ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-2 border-purple-400/50"
          : "bg-white/5 hover:bg-white/10 border border-white/10"
      }`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1" onClick={() => playTrack(index)}>
            <div className="relative cursor-pointer">
              <Avatar className="w-14 h-14">
                <AvatarImage src={post.owner_image || ""} />
                <AvatarFallback className="bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold">
                  {post.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {currentTrack === index && isPlaying && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2 cursor-pointer">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-3xl group-hover:text-purple-300 transition-colors">
                  {post.title}
                </h4>
                <span className="text-white/60 text-sm">{formatTime(post.duration)}</span>
              </div>

              <div className="flex items-center space-x-2 text-white/70">
                <span className="font-medium">{post.name}</span>
                <span>•</span>
                <span className="text-sm">{formatDate(post.date_created)}</span>
              </div>

              <p className="text-white/80 text-sm leading-relaxed line-clamp-2">{post.content_text}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-white/60">
                  <span className="flex items-center space-x-1">
                    <Headphones className="w-3 h-3" />
                    <span>{post.streams}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{updatedLikeCounts[post.id] !== undefined ? updatedLikeCounts[post.id] : post.likes}</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleComments()
                    }}
                    className="flex items-center space-x-1 hover:text-white transition-colors"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>{commentCount}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white w-10 h-10 rounded-full bg-white/10 hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    playTrack(index)
                  }}
                >
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-[1000px] opacity-100 mt-6" : "max-h-0 opacity-0"
          }`}
        >
          {isExpanded && (
            <div className="border-t border-white/10 pt-6">
              <div className="space-y-4">
                <h5 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-purple-400" />
                  <span>Comments ({commentCount})</span>
                </h5>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin" />
                  </div>
                ) : comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <CommentPlayer
                        key={comment.id}
                        comment={comment}
                        isPlaying={playingComment === comment.id}
                        onPlay={() => {
                          pauseAllAudio()
                          setPlayingComment(comment.id)
                          setGlobalAudioContext({ type: "comment", id: comment.id })
                        }}
                        onPause={() => {
                          setPlayingComment(null)
                          setGlobalAudioContext(null)
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/60">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No comments yet. Be the first to reply!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
