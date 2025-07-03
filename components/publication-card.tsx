import Link from "next/link"
import Image from "next/image"

interface Publication {
  id: string
  type: string
  date: string
  title: string
  authors?: string | null
  description: string
  image?: string
  category: string
  readPaperLink?: string
}

interface PublicationCardProps {
  publication: Publication
  viewMode: "list" | "grid"
}

export function PublicationCard({ publication, viewMode }: PublicationCardProps) {
  const isGridView = viewMode === "grid"

  return (
    <Link
      href={`/publications/${publication.id}`}
      className={`block bg-black text-white rounded-lg overflow-hidden
          ${isGridView ? "flex flex-col h-full" : "flex flex-col md:flex-row items-start gap-4"}`}
    >
      {publication.image && (
        <div className="aspect-square w-full relative overflow-hidden bg-black flex items-center justify-center">
          <img
            src={publication.image || "/placeholder.svg"}
            alt={`Preview image for ${publication.title}`}
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
      )}
      <div className={`p-4 flex-grow ${isGridView ? "w-full" : "w-full md:w-auto"}`}>
        <h3 className="text-lg leading-tight mb-1">{publication.title}</h3>
        <p className="text-gray-500 text-sm">
          {publication.type} {publication.date}
        </p>
        {/* Description is not visible in the screenshot's grid view, but keeping it for list view if needed */}
        {/* {viewMode === "list" && <p className="text-gray-500 text-sm line-clamp-2">{publication.description}</p>} */}
      </div>
    </Link>
  )
}
