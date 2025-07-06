"use client"
import { useState, useMemo } from "react"
import { LayoutList, LayoutGrid, SlidersHorizontal } from "lucide-react" // Removed ArrowUpDown
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { PublicationCard } from "@/components/publication-card"
import { publicationsData } from "@/components/publications-data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Navigation from "../components/navigation"

export default function PublicationsPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  // Removed sortOrder and setSortOrder state
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid") // Default to grid view

  const sortedAndFilteredPublications = useMemo(() => {
    const filtered = publicationsData.filter((pub) => {
      if (activeCategory === "all") {
        return true
      }
      // Ensure category matches the lowercase value from the tabs
      return pub.category === activeCategory
    })

    // Sort logic (defaulting to newest as sort functionality is removed)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return filtered
  }, [activeCategory]) // Removed sortOrder from dependency array

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main className="pt-24 pb-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-8">Publications</h1>

        {/* Category Tabs */}
        <div className="flex gap-8 mb-8 pb-4">
          {["All", "Research", "Blog", "Announcements"].map((category) => (
            <Link
              key={category}
              href={`/publications?category=${category.toLowerCase()}`}
              onClick={e => {
                e.preventDefault();
                setActiveCategory(category.toLowerCase());
              }}
              className={`text-lg font-medium bg-transparent border-none outline-none focus:outline-none transition-colors duration-200 no-underline hover:no-underline focus:no-underline
                ${activeCategory === category.toLowerCase() ? "border-b-2 border-white text-white" : "text-gray-400 hover:text-white"}
                px-0 pb-2`}
              style={{ fontFamily: 'var(--font-sf-pro)', textDecoration: 'none' }}
            >
              {category}
            </Link>
          ))}
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-gray-400 hover:text-white">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-black text-white border-gray-800">
                <DropdownMenuLabel className="text-gray-300">Filter By Category</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuRadioGroup value={activeCategory} onValueChange={setActiveCategory}>
                  <DropdownMenuRadioItem
                    value="all"
                    className="data-[state=checked]:bg-gray-900 data-[state=checked]:text-white hover:bg-gray-900"
                  >
                    All
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="research"
                    className="data-[state=checked]:bg-gray-900 data-[state=checked]:text-white hover:bg-gray-900"
                  >
                    Research
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="blog"
                    className="data-[state=checked]:bg-gray-900 data-[state=checked]:text-white hover:bg-gray-900"
                  >
                    Blog
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="announcements" // Changed from 'press' to 'announcements'
                    className="data-[state=checked]:bg-gray-900 data-[state=checked]:text-white hover:bg-gray-900"
                  >
                    Announcements
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Removed Sort Dropdown */}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "text-white bg-gray-800" : "text-gray-400 hover:text-white"}
              aria-label="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "text-white bg-gray-800" : "text-gray-400 hover:text-white"}
              aria-label="List View"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Publications Grid */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12" : "flex flex-col gap-8"}>
          {sortedAndFilteredPublications.map((publication, idx) => (
            viewMode === "grid" ? (
              <Link key={publication.id} href={`/publications/${publication.id}`} className="block group no-underline hover:no-underline focus:no-underline" style={{ textDecoration: 'none' }}>
                <div className="aspect-square w-full relative overflow-hidden bg-black flex items-center justify-center">
                  <img src={publication.image} alt={publication.title} className="object-cover w-full h-full rounded-lg" />
                </div>
                <div className="text-2xl font-semibold text-foreground mb-2" style={{ fontFamily: 'var(--font-sf-pro)' }}>{publication.title}</div>
                <div className="text-base text-muted-foreground mb-4">{publication.type} {publication.date}</div>
              </Link>
            ) : (
              <Link key={publication.id} href={`/publications/${publication.id}`} className="flex items-center gap-6 group no-underline hover:no-underline focus:no-underline" style={{ textDecoration: 'none' }}>
                <img src={publication.image} alt={publication.title} className="w-32 h-32 object-cover rounded-lg flex-shrink-0" />
                <div>
                  <div className="text-xl font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--font-sf-pro)' }}>{publication.title}</div>
                  <div className="text-base text-muted-foreground">{publication.type} {publication.date}</div>
                </div>
              </Link>
            )
          ))}
        </div>
      </main>
    </div>
  )
}
