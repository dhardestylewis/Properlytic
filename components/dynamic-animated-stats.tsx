// components/dynamic-map.tsx
"use client";

import dynamic from 'next/dynamic';

// Dynamically import your MapComponent with SSR disabled
const AnimatedStatsWithNoSSR = dynamic(
  () => import('@/components/animated-stat'), // Adjust path to your MapComponent file
  { 
    ssr: false,
    // Optional: Add a loading skeleton or message while the map is loading
    loading: () => (
        <div className="w-full h-full bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
            <p className="text-gray-500">Loading Dynamic Stats...</p>
        </div>
    )
  }
);

export default AnimatedStatsWithNoSSR;