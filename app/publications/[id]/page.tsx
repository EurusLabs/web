"use client"

import { ResearchPostContent } from "@/components/research-post-content"
import Navigation from "../../components/navigation"
import { useRouter } from "next/navigation"
import { publicationsData } from "@/components/publications-data"

export default function ResearchPostPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-24 pb-16 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/publications')}
          className="mb-8 text-base font-medium text-foreground hover:underline bg-transparent border-none outline-none focus:outline-none"
          style={{ fontFamily: 'var(--font-sf-pro)' }}
        >
          ← Back to Publications
        </button>
        <ResearchPostContent postId={id} />
      </main>
    </div>
  )
}

export async function generateStaticParams() {
  return publicationsData.map(pub => ({ id: pub.id }))
}
