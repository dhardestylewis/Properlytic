"use client"

import { useEffect, useRef, useState } from "react"

interface GlobeComponentProps {
  expanded?: boolean
  onLoadComplete?: () => void
  selectedLocation?: {
    name: string
    longitude: number
    latitude: number
  }
}

export default function GlobeComponent({ expanded = false, onLoadComplete, selectedLocation }: GlobeComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Effect for initializing and managing the globe instance
  useEffect(() => {
    // Do not run if the globe is already initialized or the container is not yet available.
    if (globeRef.current || !containerRef.current) return;

    let globe: any;

    // --- Wait for the global globe.gl script to be ready ---
    const checkGlobeReady = setInterval(() => {
      // The `window.isGlobeReady` flag is set by the <Script> tag in layout.tsx
      if (window.isGlobeReady && window.Globe) {
        clearInterval(checkGlobeReady) // Stop checking once the script is loaded

        // --- Initialize Globe ---
        globe = window.Globe({
          waitForGlobeReady: true,
          animateIn: true,
        })
        .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
        .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
        .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")
        (containerRef.current!); // Mount the globe in our container

        // --- Set Globe Dimensions ---
        // We use the container's dimensions unless it's in expanded mode
        const globeWidth = expanded ? window.innerWidth : containerRef.current!.clientWidth;
        const globeHeight = expanded ? window.innerHeight : containerRef.current!.clientHeight;
        globe.width(globeWidth).height(globeHeight);

        // --- Set Initial Position ---
        globe.pointOfView({
            lat: 40.7831,
            lng: -73.9712,
            altitude: expanded ? 1.5 : 2.5,
        }, 1000);

        globeRef.current = globe;
        setIsLoaded(true);
        if (onLoadComplete) onLoadComplete();
      }
    }, 100); // Check every 100ms

    // --- Handle window resizing ---
    const handleResize = () => {
      if (globeRef.current && containerRef.current) {
        const newWidth = expanded ? window.innerWidth : containerRef.current.clientWidth;
        const newHeight = expanded ? window.innerHeight : containerRef.current.clientHeight;
        globeRef.current.width(newWidth).height(newHeight);
      }
    }
    window.addEventListener("resize", handleResize)

    // --- Cleanup function on component unmount ---
    return () => {
      clearInterval(checkGlobeReady);
      window.removeEventListener("resize", handleResize);
      if (globeRef.current) {
        // The _destructor method is provided by globe.gl to clean up the Three.js scene and free resources.
        globeRef.current._destructor();
        globeRef.current = null;
      }
    }
  }, [expanded, onLoadComplete]) // Rerun effect if `expanded` or `onLoadComplete` changes

  // Effect for handling location updates
  useEffect(() => {
    // Do not run if the globe is not yet initialized or there's no location selected
    if (!globeRef.current || !selectedLocation) return;

    try {
        // Animate to the selected location
        globeRef.current.pointOfView({
            lat: selectedLocation.latitude,
            lng: selectedLocation.longitude,
            altitude: expanded ? 1.2 : 2.0,
        }, 1500); // Slower transition for a smoother effect

        // Add a marker for the selected location
        // Note: this replaces any existing HTML elements. To show multiple, you would manage an array in state.
        globeRef.current.htmlElementsData([
        {
          lat: selectedLocation.latitude,
          lng: selectedLocation.longitude,
          html: `<div class="location-marker">
                   <div class="location-pin"></div>
                   <span>${selectedLocation.name}</span>
                 </div>`,
        },
      ]);
    } catch (error) {
      console.error("Error updating globe location:", error);
    }
  }, [selectedLocation, expanded, isLoaded]); // Rerun when location changes, also wait for isLoaded

  return (
    <>
      <style jsx global>{`
        .location-marker {
          display: flex;
          align-items: center;
          padding: 4px 8px;
          background: rgba(30, 30, 30, 0.8);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          font-size: 14px;
          font-weight: 500;
          color: white;
          pointer-events: none; /* Allows clicks to pass through to the globe */
          transform: translate(-50%, -120%); /* Position above the point */
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .location-pin {
            width: 8px;
            height: 8px;
            background-color: #4ade80; /* A nice green */
            border-radius: 50%;
            margin-right: 8px;
            box-shadow: 0 0 8px #4ade80;
        }
      `}</style>
      <div
        ref={containerRef}
        className={`w-full h-full transition-opacity duration-1000 ${expanded ? "fixed inset-0 z-40" : ""}`}
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </>
  )
}
