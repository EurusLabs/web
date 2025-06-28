import type React from "react"
import NewspieceDetailClient from './newspiece-detail-client' // Import the client component

// Generate static params for all newspieces
export async function generateStaticParams() {
  try {
    const response = await fetch(
      'https://python-dev-server-dscvhfehfpb4gqd9.centralus-01.azurewebsites.net/newspieces/get_all?limit=100'
    )
    
    if (!response.ok) {
      console.error('Failed to fetch newspieces for static generation')
      return []
    }

    const newspieces = await response.json()
    
    return newspieces.map((newspiece: any) => ({
      id: newspiece.newspiece,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default function NewspieceDetailPage() {
  return <NewspieceDetailClient />
}
