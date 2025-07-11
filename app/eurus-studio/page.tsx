"use client"

import { useEffect } from 'react'

export default function EurusStudioPage() {
  useEffect(() => {
    // Redirect to external Studio URL
    window.location.href = 'https://studio.euruslabs.com/'
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Eurus Studio...</h1>
        <p className="text-muted-foreground">
          If you are not redirected automatically,{' '}
          <a 
            href="https://studio.euruslabs.com/" 
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            click here
          </a>
        </p>
      </div>
    </div>
  )
} 