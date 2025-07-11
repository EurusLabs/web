import { ResearchPostContent } from "@/components/research-post-content"
import Navigation from "../../components/navigation"
import { publicationsData } from "@/components/publications-data"
import BackButton from "./BackButton"

// Generate static params for all publication IDs
export async function generateStaticParams() {
  return publicationsData.map((publication) => ({ id: publication.id }))
}

export default async function ResearchPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-24 pb-16 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto">
        <BackButton />
        <ResearchPostContent postId={id} />
      </main>
    </div>
  )
}
