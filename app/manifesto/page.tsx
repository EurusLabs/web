"use client"

import Navigation from "../components/navigation"
import Head from "next/head"
import Footer from "@/components/footer"

export default function ManifestoPage() {
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

  return (
    <div className="min-h-screen bg-black">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <Navigation />
      <div className="pt-20 pb-10 px-2 md:px-6 lg:px-12 max-w-2xl mx-auto">
        <div className="space-y-10">
          {manifestoPoints.map((point, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="mb-1 pt-2"
                style={{
                  fontFamily: 'Caveat, cursive',
                  fontSize: '2.2rem',
                  fontWeight: 700,
                  color: '#fff',
                  textShadow: '0 2px 12px rgba(0,0,0,0.12)'
                }}
              >
                {index + 1}
              </div>
              <div
                className={`text-center px-1${index === manifestoPoints.length - 1 ? ' pb-4' : ''}`}
                style={{
                  fontFamily: 'Caveat, cursive',
                  fontSize: 'clamp(1.1rem, 3vw, 1.7rem)',
                  fontWeight: 400,
                  color: '#fff',
                  lineHeight: 1.25,
                  letterSpacing: '-0.01em',
                  background: '#18181b',
                  borderRadius: '1.2rem',
                  boxShadow: '0 2px 16px 0 rgba(0,0,0,0.13)',
                  padding: '0.7rem 1.2rem',
                  borderBottom: '2px solid #333',
                  maxWidth: '100%'
                }}
              >
                {point}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
} 