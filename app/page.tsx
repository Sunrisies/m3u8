import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Zap, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const featuredVideos = [
    {
      id: "1",
      title: "Amazing Nature Documentary",
      thumbnail: "/nature-documentary-wildlife.jpg",
      duration: "45:30",
    },
    {
      id: "2",
      title: "Tech Innovation Summit 2024",
      thumbnail: "/tech-conference-ai-robotics.jpg",
      duration: "1:12:45",
    },
    {
      id: "3",
      title: "Cooking Masterclass",
      thumbnail: "/cooking-masterclass-chef-kitchen.jpg",
      duration: "28:15",
    },
    {
      id: "4",
      title: "Space Exploration Mission",
      thumbnail: "/space-mars-mission-exploration.jpg",
      duration: "52:20",
    },
    {
      id: "5",
      title: "Digital Art Tutorial",
      thumbnail: "/digital-art-tutorial.jpg",
      duration: "35:45",
    },
    {
      id: "6",
      title: "Home Fitness Workout",
      thumbnail: "/fitness-home-workout.jpg",
      duration: "22:30",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container px-4 py-6">
        <section className="mb-12 text-center relative">
          <div className="absolute inset-0 tech-gradient opacity-5 rounded-3xl blur-3xl"></div>
          <div className="relative z-10 py-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight text-balance md:text-6xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                StreamHub
              </h1>
              <Sparkles className="h-8 w-8 text-secondary" />
            </div>
            <p className="mb-8 text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Experience the future of video streaming with cutting-edge technology
            </p>
            <Button asChild size="lg" className="gap-2 tech-glow hover:scale-105 transition-all duration-300">
              <Link href="/videos">
                <Play className="h-5 w-5" />
                Start Streaming
              </Link>
            </Button>
          </div>
        </section>

        <section>
          <h2 className="mb-8 text-2xl font-semibold flex items-center gap-2">
            <div className="w-1 h-8 tech-gradient rounded-full"></div>
            Featured Content
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredVideos.map((video) => (
              <Card key={video.id} className="group overflow-hidden tech-card-hover tech-border">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <Button
                    size="icon"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100 tech-glow scale-110"
                    asChild
                  >
                    <Link href={`/watch/${video.id}`}>
                      <Play className="h-5 w-5" />
                    </Link>
                  </Button>
                  <div className="absolute bottom-3 right-3 rounded-lg bg-black/80 backdrop-blur-sm px-3 py-1 text-xs text-white font-medium">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-balance leading-tight hover:text-primary transition-colors duration-200">
                    {video.title}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
