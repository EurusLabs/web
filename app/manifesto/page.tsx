"use client"

import Navigation from "../components/navigation"
import Footer from "@/components/footer"

const manifestoPoints = [
  "Curiosity is Purpose",
  "Refuse to Die", 
  "Throw sticky shit at the wall",
  "Positive interference",
  "It's all in the data",
  "Limited",
  "Just the one corn",
  "We are NOT serious people",
  "We were born to create, not consume"
]

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="flex flex-col items-center justify-center pt-32 pb-24 px-4 w-full">
        <h1 className="text-6xl md:text-8xl font-black mb-16 text-center tracking-tight" style={{ fontFamily: 'var(--font-sf-pro)' }}>
          Manifesto
        </h1>
        <ul className="space-y-8 w-full max-w-2xl">
          {manifestoPoints.map((point, idx) => (
            <li key={idx} className="text-2xl md:text-3xl font-semibold text-center py-6 px-8 rounded-2xl bg-card/40 shadow-sm" style={{ fontFamily: 'var(--font-sf-pro)' }}>
              {point}
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  )
} 