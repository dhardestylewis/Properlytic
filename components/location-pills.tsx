"use client"

import { Button } from "@/components/ui/button"

interface Location {
  name: string
  longitude: number
  latitude: number
}

interface LocationPillsProps {
  locations: Location[]
  onLocationSelect: (location: Location) => void
}

export default function LocationPills({ locations, onLocationSelect }: LocationPillsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {locations.map((location) => (
        <Button
          key={location.name}
          variant="outline"
          className="rounded-full bg-white/10 hover:bg-white/20 text-white border-white/20 location-pill"
          onClick={() => onLocationSelect(location)}
        >
          {location.name}
        </Button>
      ))}
    </div>
  )
}
