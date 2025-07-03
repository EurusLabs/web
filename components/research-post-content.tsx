"use client"

import { Suspense } from "react"
import ResearchPost1 from "./research-post-1"
import ResearchPost2 from "./research-post-2"
import ResearchPost3 from "./research-post-3"
import ResearchPost4 from "./research-post-4"

/**
 * Displays the full text of a research post based on its ID.
 */
export function ResearchPostContent({ postId }: { postId: string }) {
  let PostComponent = null

  switch (postId) {
    case "1":
      PostComponent = ResearchPost1
      break
    case "2":
      PostComponent = ResearchPost2
      break
    case "3":
      PostComponent = ResearchPost3
      break
    case "4":
      PostComponent = ResearchPost4
      break
    default:
      return (
        <div className="prose prose-invert max-w-none text-gray-300">
          <h1 className="text-3xl font-bold text-white mb-4">Post ID: {postId}</h1>
          <p>The full content for this research paper has not been added yet.</p>
        </div>
      )
  }

  return (
    <Suspense
      fallback={
        <div className="prose prose-invert max-w-none text-gray-300">
          <h1 className="text-3xl font-bold text-white mb-4">Loading Post...</h1>
          <p>Please wait while the content loads.</p>
        </div>
      }
    >
      {PostComponent && <PostComponent />}
    </Suspense>
  )
}
