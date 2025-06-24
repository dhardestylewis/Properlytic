// Create this file in your project, e.g., at the root or in a `types` directory.
// This tells TypeScript that `window` can have these custom properties.
declare global {
  interface Window {
    isGlobeReady?: boolean;
    Globe?: any; // You can use a more specific type if you have one
    THREE?: any;
  }
}

// Add this empty export to make the file a module.
export {};
