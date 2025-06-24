"use client"
import Navigation from "@/components/navigation"
import MapComponentWithNoSSR from "@/components/dynamic-map"
import ChatInterface from "@/components/chat-interface"

export default function HomebotPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="flex flex-col md:flex-row h-screen pt-14">
        {/* Map Panel (60%) */}
        <div className="w-full md:w-3/5 h-1/2 md:h-full p-4">
          <div className="h-full rounded-xl overflow-hidden shadow-lg">
            <MapComponentWithNoSSR lightMode={true} />
          </div>
        </div>

        {/* Chat Panel (40%) */}
        <div className="w-full md:w-2/5 h-1/2 md:h-full p-4 bg-gray-50 dark:bg-gray-900">
          <div className="h-full rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg flex flex-col">
            <div className="p-4 border-b">
              <h1 className="text-xl font-bold">Homebot</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your AI real estate assistant</p>
            </div>

            <div className="flex-1 overflow-hidden">
              <ChatInterface />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
