import { ResearchPostContent } from "@/components/research-post-content"
import Navigation from "../../components/navigation"
import { useRouter } from "next/navigation"
import { publicationsData } from "@/components/publications-data"
import BackButton from "./BackButton"

export default function ResearchPostPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()

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

export async function generateStaticParams() {
  return publicationsData.map(pub => ({ id: pub.id }))
}
