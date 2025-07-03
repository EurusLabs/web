import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { publicationsData } from "@/components/publications-data"

export function SidebarNav({ activePath }: { activePath: string }) {
  // Get the latest 5 publications for "Recently Out"
  const latestPublications = publicationsData
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <aside className="w-64 bg-black p-6 sticky top-0 h-screen overflow-y-auto">
      <nav className="space-y-6">
        <Link href="#" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>
        <div className="space-y-2">
          <Link
            href="/" // Changed to Home route
            className={`block rounded-md px-3 py-2 text-sm font-medium ${
              activePath === "/" ? "text-white bg-gray-800" : "text-gray-400 hover:bg-gray-900"
            }`}
          >
            Home
          </Link>
          <Link href="#" className="block rounded-md px-3 py-2 text-sm text-gray-400 hover:bg-gray-900">
            Product
          </Link>
          <Link href="#" className="block rounded-md px-3 py-2 text-sm text-gray-400 hover:bg-gray-900">
            Manifesto
          </Link>
          <Link href="#" className="block rounded-md px-3 py-2 text-sm text-gray-400 hover:bg-gray-900">
            Learn
          </Link>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Recently Out</h3>
          {latestPublications.map((pub) => (
            <Link
              key={pub.id}
              href={`/publications/${pub.id}`}
              className={`block rounded-md px-3 py-2 text-sm ${
                activePath === `/publications/${pub.id}` ? "text-white bg-gray-800" : "text-gray-400 hover:bg-gray-900"
              }`}
            >
              {pub.title}
            </Link>
          ))}
        </div>
        {/* Removed other static links like GPT-4.5, OpenAI o1, GPT-4o, Sora */}
      </nav>
    </aside>
  )
}
