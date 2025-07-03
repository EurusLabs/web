"use client"

import { useState, useEffect, useRef, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import Navigation from "../components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mic, Play, Pause, ArrowRight, Loader2, Info, Radio, MicIcon, Sparkles, Upload, X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type AlbumMode = "broadcast" | "interactive"
type Visibility = "Everyone" | "My People" | "Just Me" | "Private"
type Access = "Everyone" | "My People" | "Just Me" | "Custom" | "Paid Subscribers" | "Add Collaborators"
type Genre =
  | "Debate"
  | "Podcast"
  | "Ask Me Anything"
  | "Musings"
  | "Education"
  | "Storytelling"
  | "Journalism"
  | "Humor"
  | "Performance"

interface User {
  id: string
  username: string
  name: string
  image?: string
}

interface AlbumData {
  title: string
  mode: AlbumMode
  collaborators: User[]
  isPremium: boolean
  price?: number
  visibility: Visibility
  access: Access
  genre: Genre
  introAudio?: string
  introText?: string
  timestamping?: any[]
  coverImage?: string
}

const STEPS = ["Record Intro", "Album Title", "Premium Settings", "Talk & Listen", "Final Setup"]

const GENRES: Genre[] = [
  "Debate",
  "Podcast",
  "Ask Me Anything",
  "Musings",
  "Education",
  "Storytelling",
  "Journalism",
  "Humor",
  "Performance",
]

export default function CreateAlbumPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Album data state
  const [albumData, setAlbumData] = useState<AlbumData>({
    title: "",
    mode: "broadcast",
    collaborators: [],
    isPremium: false,
    visibility: "Everyone",
    access: "Everyone",
    genre: "Podcast",
  })

  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcriptionText, setTranscriptionText] = useState("")
  const [timestamping, setTimestamping] = useState<any[]>([])

  // UI state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [showGenreDropdown, setShowGenreDropdown] = useState(false)
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false)
  const [showAccessDropdown, setShowAccessDropdown] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false)
  const [collaboratorSearchQuery, setCollaboratorSearchQuery] = useState("")
  const [collaboratorSearchResults, setCollaboratorSearchResults] = useState<User[]>([])
  const [isSearchingCollaborators, setIsSearchingCollaborators] = useState(false)
  const [selectedCollaborators, setSelectedCollaborators] = useState<User[]>([])

  const audioRef = useRef<HTMLAudioElement>(null)
  const previewAudioRef = useRef<HTMLAudioElement>(null)

  // Check authentication
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token")
    const userData = localStorage.getItem("user")

    if (!accessToken || !userData) {
      localStorage.setItem("redirect_after_login", "/create-album")
      router.push("/login")
      return
    }

    setIsLoggedIn(true)
    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  // Recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" })
        setRecordedBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }
  }

  const playRecording = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const playPreviewAudio = () => {
    if (previewAudioRef.current && albumData.introAudio) {
      if (isPlaying) {
        previewAudioRef.current.pause()
        setIsPlaying(false)
      } else {
        previewAudioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  // Generate cover image using OpenAI API
  const generateCoverImageWithOpenAI = async () => {
    if (!albumData.title) {
      alert("Please add an album title first")
      return
    }

    setIsGeneratingImage(true)
    try {
      // Generate image with OpenAI
      const prompt = `Create a modern, artistic album cover for "${albumData.title}" in the ${albumData.genre} genre. The style should be professional, vibrant, and suitable for audio content. Include abstract elements that represent sound waves or music. Use a color palette that's visually appealing and modern.`

      const openaiResponse = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY || "your-openai-api-key"}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        }),
      })

      if (!openaiResponse.ok) {
        throw new Error("Failed to generate image with OpenAI")
      }

      const openaiData = await openaiResponse.json()
      const generatedImageUrl = openaiData.data[0].url

      // Upload the generated image to our server
      const uploadResponse = await fetch(
        "https://python-dev-server-dscvhfehfpb4gqd9.centralus-01.azurewebsites.net/image/upload_openai_image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image_url: generatedImageUrl,
          }),
        },
      )

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload generated image")
      }

      const uploadData = await uploadResponse.json()

      setAlbumData((prev) => ({
        ...prev,
        coverImage: uploadData.image_url,
      }))
    } catch (error) {
      console.error("Error generating cover image:", error)
      alert("Failed to generate cover image. Please try again or upload your own.")
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // Add a new function to handle file uploads
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB")
      return
    }

    setIsGeneratingImage(true)
    try {
      // Upload image to server
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(
        "https://python-dev-server-dscvhfehfpb4gqd9.centralus-01.azurewebsites.net/image/upload",
        {
          method: "POST",
          body: formData,
        },
      )

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()

      setAlbumData((prev) => ({
        ...prev,
        coverImage: data.image_url,
      }))
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // API functions
  const uploadAudio = async (file: Blob) => {
    const formData = new FormData()
    formData.append("file", file, "intro.webm")

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

  const searchCollaborators = async (query: string) => {
    if (query.length < 2) {
      setCollaboratorSearchResults([])
      return
    }

    setIsSearchingCollaborators(true)
    try {
      const response = await fetch(
        `https://python-dev-server-dscvhfehfpb4gqd9.centralus-01.azurewebsites.net/users/search/${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (response.ok) {
        const users = await response.json()
        setCollaboratorSearchResults(users)
      } else {
        setCollaboratorSearchResults([])
      }
    } catch (error) {
      console.error("Error searching collaborators:", error)
      setCollaboratorSearchResults([])
    } finally {
      setIsSearchingCollaborators(false)
    }
  }

  const addCollaborator = (user: User) => {
    if (!selectedCollaborators.find((c) => c.id === user.id)) {
      setSelectedCollaborators((prev) => [...prev, user])
      setAlbumData((prev) => ({
        ...prev,
        collaborators: [...prev.collaborators, user],
      }))
    }
  }

  const removeCollaborator = (userId: string) => {
    setSelectedCollaborators((prev) => prev.filter((c) => c.id !== userId))
    setAlbumData((prev) => ({
      ...prev,
      collaborators: prev.collaborators.filter((c) => c.id !== userId),
    }))
  }

  const processRecording = async () => {
    if (!recordedBlob) return

    setIsProcessing(true)
    try {
      const uploadResult = await uploadAudio(recordedBlob)
      const transcriptionResult = await transcribeAudio(uploadResult.content_audio_url)

      setAlbumData((prev) => ({
        ...prev,
        introAudio: uploadResult.content_audio_url,
        introText: transcriptionResult.content_text,
      }))

      setTranscriptionText(transcriptionResult.content_text)
      setTimestamping(transcriptionResult.timestamping || [])
      setCurrentStep(1) // Move to album title
    } catch (error) {
      console.error("Processing failed:", error)
      alert("Failed to process recording. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const createAlbum = async () => {
    if (albumData.visibility === "Private" && selectedCollaborators.length === 0) {
      alert("Private albums require at least one friend to be invited. Please invite friends to continue.")
      return
    }

    setIsCreating(true)
    try {
      const albumPayload = {
        title: albumData.title,
        owner: user?.id || user?.user_id,
        genre: albumData.genre,
        visibility: albumData.visibility,
        access: albumData.access,
        date_created: new Date().toISOString(),
        intro_text: transcriptionText || `Welcome to ${albumData.title}`,
        intro_audio: albumData.introAudio || "",
        image: albumData.coverImage || "",
        timestamping,
        speakers: ["Speaker 1"],
        gradient_primary: "#29776a",
        gradient_secondary: "#1a5a4f",
        waveformData: [0.2, 0.5, 0.8, 0.3, 0.6],
        visibility_users: [],
        access_users:
          albumData.visibility === "Private"
            ? selectedCollaborators.map((c) => c.id)
            : albumData.collaborators.map((c) => c.id),
        premium: albumData.isPremium,
        subscription_price: albumData.isPremium ? albumData.price : null,
        mode: albumData.mode,
      }

      const response = await fetch(
        "https://python-dev-server-dscvhfehfpb4gqd9.centralus-01.azurewebsites.net/newspiece/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(albumPayload),
        },
      )

      if (response.ok) {
        const result = await response.json()

        if (result.flagged) {
          alert(`Content flagged: ${result.message}`)
          return
        }

        alert("Album created successfully!")
        router.push("/discover")
      } else {
        throw new Error("Album creation failed")
      }
    } catch (error) {
      console.error("Error creating album:", error)
      alert("Failed to create album. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Debounced collaborator search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (collaboratorSearchQuery.trim()) {
        searchCollaborators(collaboratorSearchQuery)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [collaboratorSearchQuery])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <div className="pt-20 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="text-white text-lg font-medium disabled:opacity-50"
            >
              Back
            </button>
            <h1 className="text-xl font-medium text-gray-400">Create Album</h1>
            <button
              onClick={nextStep}
              disabled={
                (currentStep === 0 && !recordedBlob) ||
                (currentStep === 1 && !albumData.title) ||
                (currentStep === 2 && albumData.isPremium && !albumData.price) ||
                currentStep === STEPS.length - 1
              }
              className="text-white text-lg font-medium disabled:opacity-50"
            >
              {currentStep === STEPS.length - 1 ? "" : "Next"}
            </button>
          </div>

          {/* Quick Access Icons - Show on final step */}
          {currentStep === 4 && (
            <div className="flex items-center justify-center space-x-8 mb-8">
              {/* Generate Icon */}
              <button
                onClick={generateCoverImageWithOpenAI}
                disabled={isGeneratingImage || !albumData.title}
                className="flex flex-col items-center space-y-2 relative"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isGeneratingImage
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse"
                      : albumData.coverImage
                        ? "bg-gradient-to-r from-green-500 to-emerald-600"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  }`}
                >
                  {isGeneratingImage ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-white" />
                  )}
                </div>
                <span className="text-xs text-white/80 font-medium min-w-[60px] text-center">
                  {isGeneratingImage ? "Generating..." : albumData.coverImage ? "Generated" : "Generate"}
                </span>
              </button>

              {/* Upload Icon - New */}
              <label className="flex flex-col items-center space-y-2 relative cursor-pointer">
                <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white/80 font-medium min-w-[60px] text-center">Upload</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              {/* Genre Icon */}
              <button
                onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                className="flex flex-col items-center space-y-2 relative"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full flex items-center justify-center transition-all duration-300">
                  <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
                  </div>
                </div>
                <span className="text-xs text-white/80 font-medium min-w-[60px] text-center">{albumData.genre}</span>
              </button>

              {/* Listen Icon */}
              <button
                onClick={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
                className="flex flex-col items-center space-y-2"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full flex items-center justify-center transition-all duration-300">
                  <Radio className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white/80 font-medium min-w-[60px] text-center">
                  {albumData.visibility}
                </span>
              </button>

              {/* Talk Icon */}
              <button
                onClick={() => setShowAccessDropdown(!showAccessDropdown)}
                className="flex flex-col items-center space-y-2"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full flex items-center justify-center transition-all duration-300">
                  <MicIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white/80 font-medium min-w-[60px] text-center">{albumData.access}</span>
              </button>
            </div>
          )}

          {/* Step Content */}
          <div className="space-y-8">
            {/* Step 0: Record Intro */}
            {currentStep === 0 && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold text-white">Record Your Introduction</h2>
                  <p className="text-white/70 text-lg">Share your story with crystal clear audio</p>
                </div>

                <div className="flex flex-col items-center space-y-8">
                  {!recordedBlob ? (
                    <div className="w-full max-w-sm space-y-8">
                      {/* Compact Professional Recording Button */}
                      <div className="flex justify-center">
                        <div className="relative">
                          {/* Outer glow ring */}
                          <div
                            className={`absolute inset-0 rounded-full transition-all duration-500 ${
                              isRecording
                                ? "bg-red-500/30 blur-lg scale-125 animate-pulse"
                                : "bg-purple-500/20 blur-md scale-110"
                            }`}
                          />

                          {/* Main recording button - smaller and cleaner */}
                          <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 border-2 ${
                              isRecording
                                ? "bg-red-500 border-red-400 shadow-lg shadow-red-500/50"
                                : "bg-gradient-to-br from-purple-600 to-blue-600 border-purple-400 shadow-lg shadow-purple-500/30 hover:shadow-purple-400/40"
                            }`}
                          >
                            {/* Animated rings during recording */}
                            {isRecording && (
                              <>
                                <div className="absolute inset-0 rounded-full border border-red-300/50 animate-ping" />
                                <div
                                  className="absolute inset-2 rounded-full border border-red-200/30 animate-ping"
                                  style={{ animationDelay: "0.5s" }}
                                />
                              </>
                            )}

                            {/* Button icon */}
                            <div className="relative z-10">
                              {isRecording ? (
                                <div className="w-4 h-4 bg-white rounded-sm" />
                              ) : (
                                <Mic className="w-8 h-8 text-white" />
                              )}
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Recording Status */}
                      <div className="text-center space-y-3">
                        <div
                          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                            isRecording
                              ? "bg-red-500/20 border border-red-400/30 text-red-300"
                              : "bg-white/10 border border-white/20 text-white/80"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              isRecording ? "bg-red-400 animate-pulse" : "bg-gray-400"
                            }`}
                          />
                          <span className="font-medium">{isRecording ? "Recording..." : "Ready to record"}</span>
                        </div>

                        <p className="text-white/60 text-sm">
                          {isRecording ? "Speak clearly into your microphone" : "Tap to start recording"}
                        </p>
                      </div>

                      {/* Compact Audio Visualizer */}
                      {isRecording && (
                        <div className="flex items-center justify-center space-x-1 py-4">
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={i}
                              className="w-1 bg-gradient-to-t from-red-400 to-red-300 rounded-full animate-pulse"
                              style={{
                                height: `${Math.random() * 20 + 6}px`,
                                animationDelay: `${i * 0.1}s`,
                                animationDuration: `${0.5 + Math.random() * 0.3}s`,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full max-w-md space-y-6">
                      {/* Recording Complete Interface */}
                      <div className="bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-black/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                        {/* Success Header */}
                        <div className="text-center space-y-3 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-white">Recording Complete!</h3>
                        </div>

                        {/* Audio Preview */}
                        <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                          <div className="flex items-center space-x-3 mb-3">
                            <button
                              onClick={playRecording}
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isPlaying
                                  ? "bg-orange-500 shadow-lg shadow-orange-500/30"
                                  : "bg-purple-500 shadow-lg shadow-purple-500/30"
                              }`}
                            >
                              {isPlaying ? (
                                <Pause className="w-5 h-5 text-white" />
                              ) : (
                                <Play className="w-5 h-5 text-white ml-0.5" />
                              )}
                            </button>

                            <div className="flex-1">
                              <div className="text-white font-medium text-sm mb-1">Your Introduction</div>
                              {/* Compact waveform */}
                              <div className="flex items-center space-x-0.5 h-4">
                                {[...Array(15)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-0.5 bg-gradient-to-t rounded-full transition-all duration-300 ${
                                      isPlaying
                                        ? "from-purple-400 to-blue-400 animate-pulse"
                                        : "from-white/40 to-white/20"
                                    }`}
                                    style={{
                                      height: `${Math.random() * 12 + 4}px`,
                                      animationDelay: `${i * 0.05}s`,
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => {
                                setRecordedBlob(null)
                                setAudioUrl(null)
                                setIsPlaying(false)
                              }}
                              className="flex items-center space-x-1 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 text-white/80 hover:text-white text-sm"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                              <span>Re-record</span>
                            </button>
                          </div>
                        </div>

                        {/* Continue Button */}
                        <Button
                          onClick={processRecording}
                          disabled={isProcessing}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-none py-3 rounded-xl font-semibold transition-all duration-300"
                        >
                          {isProcessing ? (
                            <div className="flex items-center justify-center space-x-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Processing...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-2">
                              <span>Continue</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />}
              </div>
            )}

            {/* Step 1: Album Title */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold text-white leading-tight">What do you want to call your album?</h2>
                </div>

                <div className="bg-white/10 rounded-2xl p-6 space-y-4">
                  <Label className="text-white text-lg font-medium">Album Title</Label>
                  <Input
                    value={albumData.title}
                    onChange={(e) => setAlbumData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter a title for your album"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-lg p-4 rounded-xl"
                  />
                  <p className="text-white/70 text-sm leading-relaxed">
                    Choose a name that reflects your content and helps listeners find your album
                  </p>
                </div>

                <div className="bg-teal-900/30 border border-teal-600/30 rounded-xl p-4 flex items-start space-x-3">
                  <Info className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <p className="text-teal-200 text-sm">You can always change the title later in your album settings</p>
                </div>
              </div>
            )}

            {/* Step 2: Premium Settings */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold text-white">Premium Album</h2>
                  <p className="text-white/70 text-lg">
                    Make this a paid subscription album where users pay to access your content.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Free Album Option */}
                  <button
                    onClick={() => setAlbumData((prev) => ({ ...prev, isPremium: false }))}
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                      !albumData.isPremium
                        ? "border-white bg-white/10"
                        : "border-white/20 bg-white/5 hover:border-white/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Free Album</h3>
                        <p className="text-white/70">Your album will be free for all users to access</p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                          !albumData.isPremium ? "border-white bg-white" : "border-white/40"
                        }`}
                      >
                        {!albumData.isPremium && <div className="w-2 h-2 bg-black rounded-full m-1" />}
                      </div>
                    </div>
                  </button>

                  {/* Premium Album Option */}
                  <button
                    onClick={() => setAlbumData((prev) => ({ ...prev, isPremium: true }))}
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                      albumData.isPremium
                        ? "border-white bg-white/10"
                        : "border-white/20 bg-white/5 hover:border-white/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Premium Album</h3>
                        <p className="text-white/70">Charge users for access to your content</p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                          albumData.isPremium ? "border-white bg-white" : "border-white/40"
                        }`}
                      >
                        {albumData.isPremium && <div className="w-2 h-2 bg-black rounded-full m-1" />}
                      </div>
                    </div>
                  </button>

                  {/* Price Input for Premium */}
                  {albumData.isPremium && (
                    <div className="bg-white/10 rounded-2xl p-6 space-y-4">
                      <Label className="text-white text-lg font-medium">Subscription Price (USD)</Label>
                      <Input
                        type="number"
                        value={albumData.price || ""}
                        onChange={(e) =>
                          setAlbumData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) }))
                        }
                        placeholder="9.99"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-lg p-4 rounded-xl"
                      />
                    </div>
                  )}
                </div>

                <div className="bg-teal-900/30 border border-teal-600/30 rounded-xl p-4 flex items-start space-x-3">
                  <Info className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <p className="text-teal-200 text-sm">
                    You can always change this to premium later in your album settings
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Who can see your album - Only for FREE albums */}
            {currentStep === 3 && !albumData.isPremium && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold text-white leading-tight">Who can see your album?</h2>
                </div>

                <div className="space-y-4">
                  {/* Public Option */}
                  <button
                    onClick={() => setAlbumData((prev) => ({ ...prev, visibility: "Everyone", mode: "broadcast" }))}
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                      albumData.visibility === "Everyone"
                        ? "border-white bg-white/10"
                        : "border-white/20 bg-white/5 hover:border-white/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">Public</h3>
                      <div
                        className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                          albumData.visibility === "Everyone" ? "border-white bg-white" : "border-white/40"
                        }`}
                      >
                        {albumData.visibility === "Everyone" && <div className="w-2 h-2 bg-black rounded-full m-1" />}
                      </div>
                    </div>
                    <p className="text-white/70 mb-4">Anyone can discover and listen to your album. Perfect for:</p>
                    <ul className="text-white/70 space-y-1 text-sm">
                      <li>• Growing your audience</li>
                      <li>• Sharing with everyone</li>
                      <li>• Building your brand</li>
                    </ul>
                  </button>

                  {/* Private Option */}
                  <button
                    onClick={() => setAlbumData((prev) => ({ ...prev, visibility: "Private", mode: "interactive" }))}
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                      albumData.visibility === "Private"
                        ? "border-white bg-white/10"
                        : "border-white/20 bg-white/5 hover:border-white/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">Private</h3>
                      <div
                        className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                          albumData.visibility === "Private" ? "border-white bg-white" : "border-white/40"
                        }`}
                      >
                        {albumData.visibility === "Private" && <div className="w-2 h-2 bg-black rounded-full m-1" />}
                      </div>
                    </div>
                    <p className="text-white/70 mb-4">
                      Only you and selected collaborators can access your album. Great for:
                    </p>
                    <ul className="text-white/70 space-y-1 text-sm">
                      <li>• Personal projects</li>
                      <li>• Team collaborations</li>
                      <li>• Private discussions</li>
                    </ul>
                  </button>

                  {/* Invite Friends for Private Albums */}
                  {albumData.visibility === "Private" && (
                    <div className="space-y-4">
                      <Button
                        onClick={() => setShowCollaboratorModal(true)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none py-4 rounded-xl font-semibold text-lg"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Invite Friends
                      </Button>

                      {/* Selected Friends Display */}
                      {selectedCollaborators.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-white font-medium">Invited Friends ({selectedCollaborators.length})</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedCollaborators.map((collaborator) => (
                              <div
                                key={collaborator.id}
                                className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-2 border border-white/20"
                              >
                                <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {collaborator.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-white text-sm">{collaborator.name}</span>
                                <button
                                  onClick={() => removeCollaborator(collaborator.id)}
                                  className="text-white/60 hover:text-white transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Who can talk and who can listen - Only for PREMIUM albums */}
            {currentStep === 3 && albumData.isPremium && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold text-white leading-tight">Who can talk and who can listen?</h2>
                </div>

                <div className="space-y-4">
                  {/* Broadcast Option */}
                  <button
                    onClick={() => setAlbumData((prev) => ({ ...prev, mode: "broadcast" }))}
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                      albumData.mode === "broadcast"
                        ? "border-white bg-white/10"
                        : "border-white/20 bg-white/5 hover:border-white/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">Broadcast</h3>
                      <div
                        className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                          albumData.mode === "broadcast" ? "border-white bg-white" : "border-white/40"
                        }`}
                      >
                        {albumData.mode === "broadcast" && <div className="w-2 h-2 bg-black rounded-full m-1" />}
                      </div>
                    </div>
                    <p className="text-white/70 mb-4">
                      Users subscribe to listen to you, much like a podcast. Use this option for:
                    </p>
                    <ul className="text-white/70 space-y-1 text-sm">
                      <li>• Sharing expertise</li>
                      <li>• Personal journaling</li>
                      <li>• Traditional podcasting</li>
                    </ul>
                    <p className="text-teal-400 text-sm mt-4 font-medium">
                      This format is typically more accessibly priced
                    </p>
                  </button>

                  {/* Interactive + Broadcast Option */}
                  <button
                    onClick={() => setAlbumData((prev) => ({ ...prev, mode: "interactive" }))}
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                      albumData.mode === "interactive"
                        ? "border-white bg-white/10"
                        : "border-white/20 bg-white/5 hover:border-white/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">Interactive + Broadcast</h3>
                      <div
                        className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                          albumData.mode === "interactive" ? "border-white bg-white" : "border-white/40"
                        }`}
                      >
                        {albumData.mode === "interactive" && <div className="w-2 h-2 bg-black rounded-full m-1" />}
                      </div>
                    </div>
                    <p className="text-white/70 mb-4">
                      Users subscribe to listen and interact with you and your audience. Perfect for:
                    </p>
                    <ul className="text-white/70 space-y-1 text-sm">
                      <li>• Community building</li>
                      <li>• Q&A sessions</li>
                      <li>• Group discussions</li>
                    </ul>
                    <p className="text-teal-400 text-sm mt-4 font-medium">
                      Users are typically more comfortable with higher pricing for this kind of interaction
                    </p>
                  </button>

                  {/* Invite Collaborators for Interactive Mode */}
                  {albumData.mode === "interactive" && (
                    <div className="bg-purple-900/30 border border-purple-600/30 rounded-xl p-4 flex items-start space-x-3">
                      <Info className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div className="space-y-2">
                        <p className="text-purple-200 text-sm">
                          Interactive albums work best with collaborators who can contribute to discussions.
                        </p>
                        <Button
                          onClick={() => setShowCollaboratorModal(true)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none px-4 py-2 rounded-lg text-sm"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Invite Collaborators
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Selected Collaborators Display */}
                  {selectedCollaborators.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Invited Collaborators ({selectedCollaborators.length})</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCollaborators.map((collaborator) => (
                          <div
                            key={collaborator.id}
                            className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-2 border border-white/20"
                          >
                            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {collaborator.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-white text-sm">{collaborator.name}</span>
                            <button
                              onClick={() => removeCollaborator(collaborator.id)}
                              className="text-white/60 hover:text-white transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Final Setup - Clean Layout */}
            {currentStep === 4 && (
              <div className="space-y-8">
                {/* Album Preview Card with Generated Cover */}
                <div className="bg-black rounded-2xl p-6 space-y-6">
                  <div className="flex items-start space-x-4">
                    {/* Album Cover */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      {albumData.coverImage ? (
                        <img
                          src={albumData.coverImage || "/placeholder.svg"}
                          alt={albumData.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-2xl">🎵</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{albumData.title || "My Album"}</h3>
                      <p className="text-white/70 mb-3">Created by {user?.name || "You"}</p>
                      <div className="flex items-center space-x-3 flex-wrap gap-2">
                        <Badge className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border-purple-400/30">
                          {albumData.genre}
                        </Badge>
                        {albumData.isPremium && (
                          <Badge className="bg-orange-600/20 text-orange-400 border-orange-600/30">
                            ${albumData.price}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Transcription Preview */}
                  {transcriptionText && (
                    <div className="space-y-3 border-t border-white/10 pt-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-white/70 text-sm">@{user?.username || "you"}</span>
                      </div>
                      <p className="text-white/90">{transcriptionText}</p>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={playPreviewAudio}
                          className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center justify-center transition-all duration-300"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 text-white" />
                          ) : (
                            <Play className="w-5 h-5 text-white ml-0.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Collaborators Display - Only show if there are collaborators */}
                {selectedCollaborators.length > 0 && (
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white">
                        {albumData.visibility === "Private" ? "Invited Friends" : "Collaborators"} (
                        {selectedCollaborators.length})
                      </h4>
                      <Button
                        onClick={() => setShowCollaboratorModal(true)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none px-4 py-2 rounded-lg text-sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add More
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {selectedCollaborators.map((collaborator) => (
                        <div
                          key={collaborator.id}
                          className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                              {collaborator.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-medium">{collaborator.name}</p>
                              <p className="text-white/60 text-sm">@{collaborator.username}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeCollaborator(collaborator.id)}
                            className="text-white/60 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Create Album Button */}
                <div className="pt-6">
                  <Button
                    onClick={createAlbum}
                    disabled={isCreating || !albumData.title}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none py-4 rounded-xl font-bold text-lg"
                  >
                    {isCreating ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating Album...</span>
                      </div>
                    ) : (
                      "Create Album"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Genre Dropdown */}
      {showGenreDropdown && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden border border-white/10">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white text-center">Select Genre</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => {
                    setAlbumData((prev) => ({ ...prev, genre }))
                    setShowGenreDropdown(false)
                  }}
                  className="w-full py-4 px-6 text-center border-b border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                  {genre}
                </button>
              ))}
            </div>
            <div className="p-4">
              <button
                onClick={() => setShowGenreDropdown(false)}
                className="w-full py-3 bg-white/10 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visibility Dropdown */}
      {showVisibilityDropdown && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden border border-white/10">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white text-center">Who can listen to this album?</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {["Everyone", "My People", "Just Me", "Private"].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setAlbumData((prev) => ({ ...prev, visibility: option as Visibility }))
                    setShowVisibilityDropdown(false)
                    // Clear collaborators if not private or my people
                    if (option !== "Private" && option !== "My People") {
                      setSelectedCollaborators([])
                      setAlbumData((prev) => ({ ...prev, collaborators: [] }))
                    }
                    // Open collaborator modal for "My People"
                    if (option === "My People") {
                      setTimeout(() => setShowCollaboratorModal(true), 100)
                    }
                  }}
                  className={`w-full py-4 px-6 text-center border-b border-white/10 transition-colors ${
                    albumData.visibility === option ? "text-blue-400 bg-blue-500/10" : "text-white hover:bg-white/10"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="p-4">
              <button
                onClick={() => setShowVisibilityDropdown(false)}
                className="w-full py-3 bg-white/10 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Access Dropdown */}
      {showAccessDropdown && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden border border-white/10">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white text-center">Who can talk in this album?</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {albumData.isPremium
                ? ["Paid Subscribers", "Just Me", "Add Collaborators"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setAlbumData((prev) => ({ ...prev, access: option as Access }))
                        setShowAccessDropdown(false)
                        // Open collaborator modal for "Add Collaborators"
                        if (option === "Add Collaborators") {
                          setTimeout(() => setShowCollaboratorModal(true), 100)
                        }
                      }}
                      className={`w-full py-4 px-6 text-center border-b border-white/10 transition-colors ${
                        albumData.access === option ? "text-blue-400 bg-blue-500/10" : "text-white hover:bg-white/10"
                      }`}
                    >
                      {option}
                    </button>
                  ))
                : ["Everyone", "My People", "Just Me", "Custom"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setAlbumData((prev) => ({ ...prev, access: option as Access }))
                        setShowAccessDropdown(false)
                        // Open collaborator modal for "My People" or "Custom"
                        if (option === "My People" || option === "Custom") {
                          setTimeout(() => setShowCollaboratorModal(true), 100)
                        }
                      }}
                      className={`w-full py-4 px-6 text-center border-b border-white/10 transition-colors ${
                        albumData.access === option ? "text-blue-400 bg-blue-500/10" : "text-white hover:bg-white/10"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
            </div>
            <div className="p-4">
              <button
                onClick={() => setShowAccessDropdown(false)}
                className="w-full py-3 bg-white/10 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collaborator Search Modal */}
      {showCollaboratorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gray-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden border border-white/10">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {albumData.visibility === "Private" ? "Invite Friends" : "Invite Collaborators"}
                </h3>
                <button
                  onClick={() => {
                    setShowCollaboratorModal(false)
                    setCollaboratorSearchQuery("")
                    setCollaboratorSearchResults([])
                  }}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or username..."
                  value={collaboratorSearchQuery}
                  onChange={(e) => setCollaboratorSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoFocus
                />
                {isSearchingCollaborators && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {collaboratorSearchQuery.length > 0 && collaboratorSearchQuery.length < 2 && (
                <p className="text-white/60 text-sm mt-2">Type at least 2 characters to search</p>
              )}
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {collaboratorSearchResults.length > 0 ? (
                <div className="p-4 space-y-2">
                  {collaboratorSearchResults.map((user) => {
                    const isSelected = selectedCollaborators.find((c) => c.id === user.id)
                    return (
                      <button
                        key={user.id}
                        onClick={() => {
                          if (isSelected) {
                            removeCollaborator(user.id)
                          } else {
                            addCollaborator(user)
                          }
                        }}
                        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                          isSelected
                            ? "bg-purple-600/30 border border-purple-400/50"
                            : "bg-white/5 hover:bg-white/10 border border-white/10"
                        }`}
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-white/60 text-sm">@{user.username}</p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              ) : collaboratorSearchQuery.length >= 2 && !isSearchingCollaborators ? (
                <div className="p-8 text-center text-white/60">
                  <p>No users found matching "{collaboratorSearchQuery}"</p>
                </div>
              ) : collaboratorSearchQuery.length >= 2 ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-white/60">Searching...</p>
                </div>
              ) : (
                <div className="p-8 text-center text-white/60">
                  <p>Start typing to search for {albumData.visibility === "Private" ? "friends" : "collaborators"}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <p className="text-white/60 text-sm">
                  {selectedCollaborators.length} {albumData.visibility === "Private" ? "friend" : "collaborator"}
                  {selectedCollaborators.length !== 1 ? "s" : ""} selected
                </p>
                <Button
                  onClick={() => {
                    setShowCollaboratorModal(false)
                    setCollaboratorSearchQuery("")
                    setCollaboratorSearchResults([])
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none px-6 py-2 rounded-lg"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Audio Elements */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />}
      {albumData.introAudio && (
        <audio ref={previewAudioRef} src={albumData.introAudio} onEnded={() => setIsPlaying(false)} />
      )}
    </div>
  )
}
