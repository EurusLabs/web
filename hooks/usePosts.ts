"use client"

import { useState, useEffect } from "react"
import type { Post } from "../types/post"

export function usePosts(newspieceId: string) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://python-dev-server-dscvhfehfpb4gqd9.centralus-01.azurewebsites.net/newspiece/${newspieceId}/posts?skip=0&limit=20`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch posts")
        }

        const data = await response.json()
        setPosts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (newspieceId) {
      fetchPosts()
    }
  }, [newspieceId])

  return { posts, loading, error }
}
