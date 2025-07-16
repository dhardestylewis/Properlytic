"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapComponentProps {
  lightMode?: boolean
}

export default function MapComponent({ lightMode = false }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    const map = L.map(mapRef.current).setView([40.7831, -73.9712], 16) // Upper East Side coordinates with higher zoom
    mapInstanceRef.current = map

    // Replace the MapBox tile layer with OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    // // Add custom markers
    // const customIcon = L.divIcon({
    //   className: "custom-marker",
    //   html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>`,
    //   iconSize: [20, 20],
    // })

    // // Add sample data points
    // const locations = [
    //   { lat: 40.7831, lng: -73.9712, name: "Upper East Side", price: "$2,450/sqft" },
    //   { lat: 40.7875, lng: -73.9557, name: "Yorkville", price: "$2,100/sqft" },
    //   { lat: 40.7736, lng: -73.9566, name: "Lenox Hill", price: "$2,800/sqft" },
    //   { lat: 40.7808, lng: -73.9772, name: "Central Park", price: "$3,200/sqft" },
    //   { lat: 40.7822, lng: -73.95, name: "East 86th Street", price: "$2,762/sqft" },
    // ]

    // locations.forEach((location) => {
    //   L.marker([location.lat, location.lng], { icon: customIcon })
    //     .addTo(map)
    //     .bindPopup(`<b>${location.name}</b><br>${location.price}`)
    // })

    // // Add neighborhood boundaries
    // const upperEastSide = L.polygon(
    //   [
    //     [40.769, -73.96],
    //     [40.769, -73.945],
    //     [40.79, -73.945],
    //     [40.79, -73.96],
    //   ],
    //   {
    //     color: "#3B82F6",
    //     fillColor: "#93C5FD",
    //     fillOpacity: 0.2,
    //     weight: 2,
    //   },
    // )
    //   .addTo(map)
    //   .bindPopup("Upper East Side")

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [lightMode])

  return <div ref={mapRef} className="w-full h-full rounded-xl" />
}
