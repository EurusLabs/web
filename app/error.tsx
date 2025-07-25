'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error caught:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-muted-foreground mb-6">
          We encountered an unexpected error. Please try refreshing the page.
        </p>
        <div className="space-x-4">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button 
            onClick={() => window.location.href = '/'} 
            variant="outline"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  )
} 