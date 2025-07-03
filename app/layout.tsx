import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "../components/theme-provider"
import Navigation from "./components/navigation"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Eurus Labs",
  description: "Monetize yourself. Not brands.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
