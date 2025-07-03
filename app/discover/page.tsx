"use client"

import { useState, useEffect } from "react"
import { useNewspieces } from "../../hooks/useNewspieces"
import { NewspieceCard } from "../../components/newspiece-card"
import Navigation from "../components/navigation"
import { Button } from "@/components/ui/button"
import { Search, Filter, ImageIcon, Zap, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function DiscoverPage() {
  const { newspieces, loading, error } = useNewspieces(20)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [filteredNewspieces, setFilteredNewspieces] = useState(newspieces)

  // Get unique genres
  const genres = Array.from(new Set(newspieces.map((n) => n.genre).filter(Boolean)))

  // Filter newspieces based on search and genre
  useEffect(() => {
    let filtered = newspieces

    if (searchTerm) {
      filtered = filtered.filter(
        (newspiece) =>
          newspiece.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          newspiece.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          newspiece.intro_text.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedGenre) {
      filtered = filtered.filter((newspiece) => newspiece.genre === selectedGenre)
    }

    setFilteredNewspieces(filtered)
  }, [newspieces, searchTerm, selectedGenre])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-foreground/30 border-t-foreground rounded-full animate-spin mx-auto" />
              <div
                className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-400 rounded-full animate-spin mx-auto"
                style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
              />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold bg-gradient-to-r from-foreground via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Loading Creative Content
              </p>
              <p className="text-foreground/80 text-lg">Discovering amazing creators...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6 p-8 rounded-3xl bg-card/10 backdrop-blur-xl border border-border/20">
            <Zap className="w-16 h-16 text-red-400 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground">Connection Error</h3>
              <p className="text-red-400 text-lg">Unable to load creative content: {error}</p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-foreground border-none px-8 py-3 rounded-full font-semibold"
            >
              Retry Connection
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Gradient Overlays */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <Navigation />

      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8 bg-black text-white">
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <h1 className="text-7xl md:text-9xl font-black bg-gradient-to-r from-foreground via-purple-200 to-pink-200 bg-clip-text text-transparent tracking-tight dark:from-neutral-100 dark:via-purple-400 dark:to-pink-400">
                DISCOVER
              </h1>
            </div>
            <div className="h-1 w-40 bg-gradient-to-r from-transparent via-foreground to-transparent mx-auto rounded-full dark:via-neutral-200" />
          </div>
          <p className="text-2xl text-foreground/90 max-w-4xl mx-auto leading-relaxed font-light dark:text-neutral-200">
            Explore the creative universe of <span className="text-purple-300 font-semibold dark:text-purple-400">talented creators</span>{' '}
            sharing their passion through premium audio content
          </p>
          <div className="flex justify-center mt-12">
            <Button
              asChild
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none px-12 py-6 rounded-full font-bold text-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-purple-500/30 dark:from-neutral-800 dark:to-pink-700"
            >
              <Link href="/create-album">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 dark:bg-neutral-200/20">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span>Create your own album</span>
                </div>
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out dark:via-neutral-200/20" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="relative z-10 px-6 mb-16">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Search Bar */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-3xl blur-xl" />
            <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-3">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white w-6 h-6" />
                <Input
                  type="text"
                  placeholder="Search creators, albums, or discover new content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-16 pr-6 py-6 bg-transparent border-none text-white placeholder:text-white/60 text-xl focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          </div>

          {/* Genre Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant={selectedGenre === null ? "default" : "outline"}
              onClick={() => setSelectedGenre(null)}
              className={`rounded-full px-8 py-3 transition-all duration-300 font-semibold backdrop-blur-xl ${
                selectedGenre === null
                  ? "bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white shadow-lg shadow-white/25"
                  : "bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white/40"
              }`}
            >
              All Content
            </Button>
            {genres.map((genre) => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                onClick={() => setSelectedGenre(genre)}
                className={`rounded-full px-8 py-3 transition-all duration-300 font-semibold backdrop-blur-xl ${
                  selectedGenre === genre
                    ? "bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white shadow-lg shadow-white/25"
                    : "bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white/40"
                }`}
              >
                {genre}
              </Button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-8 py-4">
              <ImageIcon className="w-5 h-5 text-purple-300" />
              <p className="text-white/90 font-medium text-lg">
                {filteredNewspieces.length} creative {filteredNewspieces.length === 1 ? "piece" : "pieces"} available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="relative z-10 px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          {filteredNewspieces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 auto-rows-max">
              {filteredNewspieces.map((newspiece, index) => (
                <NewspieceCard key={newspiece.newspiece} newspiece={newspiece} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <div className="space-y-6 max-w-md mx-auto">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full mx-auto flex items-center justify-center backdrop-blur-xl border border-white/20">
                    <Filter className="w-12 h-12 text-white/60" />
                  </div>
                  <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-white/20 to-purple-400/20 rounded-full mx-auto animate-ping" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-white">No Creative Content Found</h3>
                  <p className="text-white/70 leading-relaxed">
                    Refine your search to discover more amazing content from our creative community.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedGenre(null)
                  }}
                  className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-700/80 hover:to-pink-700/80 text-white border-none px-8 py-3 rounded-full font-semibold backdrop-blur-xl shadow-lg shadow-purple-500/25"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
