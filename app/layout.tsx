import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script" // Make sure this import is present
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Properlytics - Real Estate Analytics Platform",
  description: "Your insight into real estate with advanced analytics and forecasting",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* The ThemeProvider wraps your application content */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>

        {/* Load global scripts once for the entire application at the end of the body */}
        <Script
          src="https://cdn.jsdelivr.net/npm/three@0.126.0/build/three.min.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://unpkg.com/globe.gl@2.26.3/dist/globe.gl.min.js"
          strategy="lazyOnload"
          onLoad={() => {
            // This is the correct way to set a global flag once globe.gl is loaded.
            // It ensures that any component waiting for this script knows it's ready.
            window.isGlobeReady = true;
          }}
        />
      </body>
    </html>
  )
}
