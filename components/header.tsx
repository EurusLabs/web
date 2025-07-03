import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="flex items-center justify-between h-16 px-8 bg-black text-white sticky top-0 z-50">
      <Link href="#" className="flex items-center gap-2 text-2xl font-bold">
        EurusLabs
      </Link>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
        <Button className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium">
          Log in
        </Button>
      </div>
    </header>
  )
}
