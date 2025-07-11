"use client"

import { Suspense } from "react"
import ResearchPost1 from "./research-post-1"
import ResearchPost2 from "./research-post-2"
import ResearchPost3 from "./research-post-3"
import ResearchPost4 from "./research-post-4"
import BlogPost1 from "./blog-post-1"
import BlogPost2 from "./blog-post-2"
import BlogPost3 from "./blog-post-3"
import BlogPost4 from "./blog-post-4"
import BlogPost5 from "./blog-post-5"
import BlogPost6 from "./blog-post-6"
import BlogPost7 from "./blog-post-7"
import BlogPost8 from "./blog-post-8"
import BlogPost9 from "./blog-post-9"
import BlogPost10 from "./blog-post-10"
import BlogPost17 from "./blog-post-17"

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
    case "7":
      PostComponent = BlogPost1
      break
    case "8":
      PostComponent = BlogPost2
      break
    case "9":
      PostComponent = BlogPost3
      break
    case "10":
      PostComponent = BlogPost4
      break
    case "11":
      PostComponent = BlogPost5
      break
    case "12":
      PostComponent = BlogPost6
      break
    case "13":
      PostComponent = BlogPost7
      break
    case "14":
      PostComponent = BlogPost8
      break
    case "15":
      PostComponent = BlogPost9
      break
    case "16":
      PostComponent = BlogPost10
      break
    case "17":
      PostComponent = BlogPost17
      break;
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
