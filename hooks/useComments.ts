"use client"

import { useState, useEffect } from "react"

interface Comment {
  id: string
  title: string
  content_text: string
  content_audio_url: string
  owner: string
  owner_username: string
  owner_name: string
  owner_profile_image?: string
  newspiece_id: string
  newspiece_title?: string
  posts_cited: string[]
  posts_cited_details?: any[]
  likes: number
  stream_count: number
  timestamping?: Array<{
    start: number
    end: number
    text: string
    speaker?: string
  }>
  speakers?: string[]
  visibility: string
  access: string
  created_at: string
  flagged: boolean
}

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = async () => {
    if (!postId) return

    try {
      setLoading(true)
      setError(null)
      const response = await fetch(
        `https://python-dev-server-dscvhfehfpb4gqd9.centralus-01.azurewebsites.net/post/${postId}/citing_posts`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch comments")
      }

      const data = await response.json()
      setComments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setComments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  return { comments, loading, error, refetch: fetchComments }
}
