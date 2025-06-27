"use client"

import { useState, useEffect } from "react"
import type { Newspiece } from "../types/newspiece"

export function useNewspieces(limit = 20) {
  const [newspieces, setNewspieces] = useState<Newspiece[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNewspieces = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://python-dev-server-dscvhfehfpb4gqd9.centralus-01.azurewebsites.net/newspieces/get_all?limit=${limit}`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch newspieces")
        }

        const data = await response.json()
        setNewspieces(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchNewspieces()
  }, [limit])

  return { newspieces, loading, error }
}
