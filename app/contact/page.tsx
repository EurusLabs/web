"use client"

import Navigation from "../components/navigation"
import Footer from "@/components/footer"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ContactPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Create mailto link
    const subject = "Contact from Eurus Labs Website"
    const body = `From: ${email}\n\nMessage:\n${message}`
    const mailtoLink = `mailto:info@euruslabs.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    
    // Open email client
    window.location.href = mailtoLink
    
    // Reset form
    setEmail("")
    setMessage("")
    setSubmitted(true)
    setIsSubmitting(false)
    
    // Reset submitted state after 3 seconds
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col" style={{ fontFamily: 'var(--font-sf-pro)' }}>
      <Navigation />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
            Get in touch with our team. We'd love to hear from you.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-lg font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20 text-lg py-3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-white text-lg font-medium">
                Message
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your project, question, or how we can help..."
                required
                rows={6}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20 text-lg resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black hover:bg-white/90 text-lg font-semibold py-3 h-auto"
            >
              {isSubmitting ? "Opening Email Client..." : "Send Message"}
            </Button>
          </form>

          {submitted && (
            <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-center font-medium">
                Email client opened! Please send the message from your email application.
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-white/60 text-sm">
              You can also reach us directly at{" "}
              <a 
                href="mailto:info@euruslabs.com" 
                className="text-white hover:text-white/80 underline"
              >
                info@euruslabs.com
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 