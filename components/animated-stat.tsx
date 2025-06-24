"use client"

import { useState, useEffect, useRef } from "react"

interface AnimatedStatProps {
  value: number
  suffix: string
  prefix?: string
  duration?: number
  delay?: number
  decimals?: number
}

export default function AnimatedStat({
  value,
  suffix,
  prefix = "",
  duration = 2000,
  delay = 0,
  decimals = 0,
}: AnimatedStatProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const startAnimation = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      setDisplayValue(Math.floor(progress * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(startAnimation)
      } else {
        setDisplayValue(value)
      }
    }

    const timer = setTimeout(() => {
      animationFrame = requestAnimationFrame(startAnimation)
    }, delay)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(animationFrame)
    }
  }, [value, duration, delay, isVisible])

  return (
    <div ref={ref} className="animate-count-up opacity-0">
      <div className="text-3xl font-bold">
        {prefix}
        {displayValue.toFixed(decimals)}
        {suffix}
      </div>
    </div>
  )
}
