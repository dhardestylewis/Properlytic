"use client"

import { useState, useEffect } from "react"

interface AnimatedPlaceholderProps {
  placeholders: string[]
}

export default function AnimatedPlaceholder({ placeholders }: AnimatedPlaceholderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % placeholders.length)
        setIsVisible(true)
      }, 500)
    }, 5000)

    return () => clearInterval(interval)
  }, [placeholders.length])

  return (
    <span
      className="transition-all duration-500 block"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(10px)",
      }}
    >
      {placeholders[currentIndex]}
    </span>
  )
}
