import { Navigation } from "@/components/navigation"
import { VideoGrid } from "@/components/video-grid"
import { VideoFilters } from "@/components/video-filters"

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-balance">Browse Videos</h1>
          <p className="text-muted-foreground text-pretty">
            Discover thousands of high-quality videos from creators around the world
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-64">
            <VideoFilters />
          </aside>

          <div className="flex-1">
            <VideoGrid />
          </div>
        </div>
      </main>
    </div>
  )
}
