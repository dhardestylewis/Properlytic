// components/global-scripts.tsx

"use client"; // This directive marks the component as a Client Component

import Script from "next/script";

// Optional but recommended: Add a TypeScript declaration to extend the
// global Window interface. This prevents TypeScript errors for `window.isGlobeReady`.
declare global {
  interface Window {
    isGlobeReady?: boolean;
  }
}

export function GlobalScripts() {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/three@0.126.0/build/three.min.js"
        strategy="lazyOnload"
      />
      <Script
        src="https://unpkg.com/globe.gl@2.26.3/dist/globe.gl.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          // This is now valid because it's defined and passed within a Client Component.
          console.log("globe.gl script loaded.");
          window.isGlobeReady = true;
        }}
      />
    </>
  );
}