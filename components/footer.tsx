import Link from "next/link"

export default function Footer() {
  return (
    <footer className="relative bg-black text-white z-10">
      {/* Scrolling Banner */}
      <div className="bg-white text-black py-6 overflow-hidden relative">
        <div className="flex animate-scroll-left whitespace-nowrap">
          <span className="text-2xl font-medium px-8">Get Started for Free</span>
          <span className="text-2xl font-medium px-8">•</span>
          <span className="text-2xl font-medium px-8">Get Started for Free</span>
          <span className="text-2xl font-medium px-8">•</span>
          <span className="text-2xl font-medium px-8">Get Started for Free</span>
          <span className="text-2xl font-medium px-8">•</span>
          <span className="text-2xl font-medium px-8">Get Started for Free</span>
          <span className="text-2xl font-medium px-8">•</span>
          <span className="text-2xl font-medium px-8">Get Started for Free</span>
          <span className="text-2xl font-medium px-8">•</span>
          <span className="text-2xl font-medium px-8">Get Started for Free</span>
          <span className="text-2xl font-medium px-8">•</span>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative px-6 py-16 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Footer Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {/* Products */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
                PRODUCTS
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/discover" className="text-white hover:text-gray-300 transition-colors duration-200">
                    Eidos
                  </Link>
                </li>
                <li>
                  <a 
                    href="http://localhost:3001" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors duration-200"
                  >
                    Eurus Draft
                  </a>
                </li>
                <li>
                  <Link href="/eurus-studio" className="text-white hover:text-gray-300 transition-colors duration-200">
                    Eurus Studio
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://www.relayedstories.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors duration-200"
                  >
                    Relay
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
                RESOURCES
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/research" className="text-white hover:text-gray-300 transition-colors duration-200">
                    Research
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://eurus-labs.gitbook.io/eurus-labs/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors duration-200"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <Link href="/academy" className="text-white hover:text-gray-300 transition-colors duration-200">
                    Academy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
                COMPANY
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/manifesto" className="text-white hover:text-gray-300 transition-colors duration-200">
                    Manifesto
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-white hover:text-gray-300 transition-colors duration-200">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-white hover:text-gray-300 transition-colors duration-200">
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
                SOCIAL
              </h3>
              <ul className="space-y-4">
                <li>
                  <a 
                    href="#" 
                    className="text-white hover:text-gray-300 transition-colors duration-200"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-white hover:text-gray-300 transition-colors duration-200"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    X (Twitter)
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-white hover:text-gray-300 transition-colors duration-200"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
            {/* Logo */}
            <div className="mb-6 md:mb-0">
              <Link href="/" className="text-white text-2xl font-bold tracking-tight" style={{ fontFamily: 'Dancing Script, cursive' }}>
                eurus labs<span className="text-red-500 ml-1">.</span>
              </Link>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-8 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors duration-200">
                Terms of Use
              </Link>
              <span>©Eurus Labs Inc</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 