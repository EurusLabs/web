import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { ThemeProvider } from "../components/theme-provider"
import Navigation from "./components/navigation"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: {
    default: "Eurus Labs - The Future of Visual Creation",
    template: "%s | Eurus Labs"
  },
  description: "Monetize yourself. Not brands. Eurus is the flagship platform from Eurus Labs—a new era in AI-powered creativity.",
  keywords: ["AI", "creativity", "visual creation", "generative AI", "digital content", "Eurus Labs"],
  authors: [{ name: "Eurus Labs" }],
  creator: "Eurus Labs",
  publisher: "Eurus Labs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://euruslabs.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://euruslabs.com',
    title: 'Eurus Labs - The Future of Visual Creation',
    description: 'Monetize yourself. Not brands. Eurus is the flagship platform from Eurus Labs—a new era in AI-powered creativity.',
    siteName: 'Eurus Labs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eurus Labs - The Future of Visual Creation',
    description: 'Monetize yourself. Not brands. Eurus is the flagship platform from Eurus Labs—a new era in AI-powered creativity.',
    creator: '@euruslabs',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://eurusworkflows.blob.core.windows.net" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* Script to handle browser extension interference */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Remove Grammarly and other extension attributes that cause hydration issues
              (function() {
                function cleanBodyAttributes() {
                  const body = document.body;
                  if (body) {
                    // Remove Grammarly attributes
                    body.removeAttribute('data-new-gr-c-s-check-loaded');
                    body.removeAttribute('data-gr-ext-installed');
                    
                    // Remove other common extension attributes
                    const attributesToRemove = [
                      'data-gramm',
                      'data-gramm_editor',
                      'data-enable-grammarly',
                      'data-gramm_id',
                      'data-gramm_editor_plugin'
                    ];
                    
                    attributesToRemove.forEach(attr => {
                      body.removeAttribute(attr);
                    });
                  }
                }
                
                // Run immediately
                cleanBodyAttributes();
                
                // Run after DOM is ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', cleanBodyAttributes);
                }
                
                // Run after React hydration
                setTimeout(cleanBodyAttributes, 100);
                setTimeout(cleanBodyAttributes, 500);
              })();
            `,
          }}
        />
      </head>
      <body className="bg-black text-white font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
