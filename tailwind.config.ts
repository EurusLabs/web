import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sf-pro)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontWeight: {
        "590": "590",
        "860": "860",
        "1000": "1000",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-right': 'slide-in-right 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'glow-blink': 'glow-blink 1.5s ease-in-out infinite',
        'scroll-left': 'scroll-left 15s linear infinite',
        'blob-pulse': 'blob-pulse 4s ease-in-out infinite',
        'blob-morph-1': 'blob-morph-1 6s ease-in-out infinite',
        'blob-morph-2': 'blob-morph-2 8s ease-in-out infinite',
        'blob-morph-3': 'blob-morph-3 10s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'glow-blink': {
          '0%, 100%': { opacity: '0.3', textShadow: 'none' },
          '50%': { 
            opacity: '1', 
            textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3)' 
          },
        },
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'blob-pulse': {
          '0%, 100%': { transform: 'scale(1)', backgroundPosition: '0% 50%' },
          '25%': { transform: 'scale(1.1)', backgroundPosition: '100% 50%' },
          '50%': { transform: 'scale(0.9)', backgroundPosition: '100% 100%' },
          '75%': { transform: 'scale(1.05)', backgroundPosition: '0% 100%' },
        },
        'blob-morph-1': {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', transform: 'scale(1) rotate(0deg)' },
          '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%', transform: 'scale(1.1) rotate(90deg)' },
          '50%': { borderRadius: '50% 60% 30% 60% / 60% 30% 60% 40%', transform: 'scale(0.9) rotate(180deg)' },
          '75%': { borderRadius: '60% 40% 60% 40% / 40% 60% 40% 60%', transform: 'scale(1.05) rotate(270deg)' },
        },
        'blob-morph-2': {
          '0%, 100%': { borderRadius: '40% 60% 60% 40% / 40% 60% 40% 60%', transform: 'scale(1) rotate(0deg)' },
          '33%': { borderRadius: '60% 40% 40% 60% / 60% 40% 60% 40%', transform: 'scale(1.15) rotate(120deg)' },
          '66%': { borderRadius: '30% 70% 70% 30% / 30% 70% 30% 70%', transform: 'scale(0.85) rotate(240deg)' },
        },
        'blob-morph-3': {
          '0%, 100%': { borderRadius: '50% 50% 50% 50% / 50% 50% 50% 50%', transform: 'scale(1) rotate(0deg)' },
          '20%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', transform: 'scale(1.2) rotate(72deg)' },
          '40%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%', transform: 'scale(0.8) rotate(144deg)' },
          '60%': { borderRadius: '50% 60% 30% 60% / 60% 30% 60% 40%', transform: 'scale(1.1) rotate(216deg)' },
          '80%': { borderRadius: '60% 40% 60% 40% / 40% 60% 40% 60%', transform: 'scale(0.9) rotate(288deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
  // Performance optimizations
  future: {
    hoverOnlyWhenSupported: true,
  },
}
export default config
