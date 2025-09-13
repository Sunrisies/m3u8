import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, TrendingUp, Star } from "lucide-react"
import Link from "next/link"

export default function HomePage() {

  const featuredVideos = [
    {
      id: "1",
      title: "Amazing Nature Documentary",
      description: "Explore the wonders of wildlife in stunning 4K quality",
      thumbnail: "nature-documentary-wildlife.jpg",
      duration: "45:30",
      views: "2.1M",
      rating: 4.8,
    },
    {
      id: "2",
      title: "Tech Innovation Summit 2024",
      description: "Latest breakthroughs in artificial intelligence and robotics",
      thumbnail: "/tech-conference-ai-robotics.jpg",
      duration: "1:12:45",
      views: "856K",
      rating: 4.6,
    },
    {
      id: "3",
      title: "Cooking Masterclass",
      description: "Learn professional cooking techniques from world-class chefs",
      thumbnail: "/cooking-masterclass-chef-kitchen.jpg",
      duration: "28:15",
      views: "1.5M",
      rating: 4.9,
    },
  ]

  return (
    <div className="min-h-screen bg-background flex justify-center items-center flex-col">
      <Navigation />

      <main className="container px-4 py-8">
        {/* Hero Section */}
        <section className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 p-8 md:p-12">
          <div className="relative z-10 max-w-2xl">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-balance md:text-6xl">Discover Amazing Videos</h1>
            <p className="mb-6 text-lg text-muted-foreground text-pretty">
              Stream high-quality content from creators around the world. Find your next favorite video today.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/videos">
                  <Play className="h-4 w-4" />
                  Start Watching
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Videos */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Featured Videos</h2>
            <Button variant="ghost" asChild>
              <Link href="/videos">View All</Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredVideos.map((video) => (
              <Card key={video.id} className="group overflow-hidden transition-all hover:shadow-lg">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
                  <Button
                    size="icon"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
                    asChild
                  >
                    <Link href={`/watch/${video.id}`}>
                      <Play className="h-4 w-4" />
                    </Link>
                  </Button>
                  <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs text-white">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-2 font-semibold text-balance">{video.title}</h3>
                  <p className="mb-3 text-sm text-muted-foreground text-pretty">{video.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {video.views} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {video.rating}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="rounded-2xl bg-card p-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary">10M+</div>
              <div className="text-sm text-muted-foreground">Videos Available</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary">5M+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
