"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholderText: string
}

export function AnimatedInput({ placeholderText, className, ...props }: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Check if input has value
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0)
    props.onChange?.(e)
  }

  // Focus the input when clicking on the container
  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full" onClick={handleContainerClick}>
      <Input
        ref={inputRef}
        className={`${className} placeholder:text-transparent`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleChange}
        {...props}
      />

      {/* Custom animated placeholder */}
      {!hasValue && (
        <div
          className={`absolute left-0 top-0 flex items-center h-full px-6 pointer-events-none transition-opacity ${
            isFocused ? "opacity-70" : "opacity-100"
          }`}
        >
          <span className="animate-glow-blink text-lg text-white/60">{placeholderText}</span>
        </div>
      )}
    </div>
  )
}
