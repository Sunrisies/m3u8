"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Star } from "lucide-react"

interface VideoRecommendationsProps {
  currentVideoId: string
}

export function VideoRecommendations({ currentVideoId }: VideoRecommendationsProps) {
  // Mock recommended videos - filter out current video
  const recommendedVideos = [
    {
      id: "2",
      title: "Tech Innovation Summit 2024: AI & Robotics",
      description: "Latest breakthroughs in artificial intelligence and robotics",
      thumbnail: "/tech-conference-ai-robotics.jpg",
      duration: "1:12:45",
      views: "856K",
      rating: 4.6,
      category: "Technology",
      creator: "Tech Summit",
    },
    {
      id: "3",
      title: "Cooking Masterclass: Professional Techniques",
      description: "Learn professional cooking techniques from world-class chefs",
      thumbnail: "/cooking-masterclass-chef-kitchen.jpg",
      duration: "28:15",
      views: "1.5M",
      rating: 4.9,
      category: "Cooking",
      creator: "Chef Academy",
    },
    {
      id: "4",
      title: "Space Exploration: Mars Mission Updates",
      description: "Latest updates from NASA's Mars exploration missions",
      thumbnail: "/space-mars-mission-exploration.jpg",
      duration: "35:20",
      views: "3.2M",
      rating: 4.7,
      category: "Science",
      creator: "Space Channel",
    },
    {
      id: "5",
      title: "Digital Art Tutorial: Advanced Techniques",
      description: "Master advanced digital art techniques using industry-standard software",
      thumbnail: "/digital-art-tutorial.jpg",
      duration: "52:10",
      views: "892K",
      rating: 4.8,
      category: "Art & Design",
      creator: "Art Studio Pro",
    },
    {
      id: "6",
      title: "Fitness Journey: Complete Home Workout",
      description: "Transform your fitness with this comprehensive home workout routine",
      thumbnail: "/fitness-home-workout.jpg",
      duration: "42:30",
      views: "1.8M",
      rating: 4.6,
      category: "Sports",
      creator: "Fit Life",
    },
  ].filter((video) => video.id !== currentVideoId)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Recommended Videos</h2>

      <div className="space-y-3">
        {recommendedVideos.map((video) => (
          <Card key={video.id} className="group overflow-hidden transition-all hover:shadow-md">
            <Link href={`/watch/${video.id}`}>
              <div className="flex gap-3 p-3">
                <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />

                  <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-xs text-white">
                    {video.duration}
                  </div>

                  <Badge variant="secondary" className="absolute left-1 top-1 text-xs">
                    {video.category}
                  </Badge>
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className="font-medium text-sm leading-tight text-balance line-clamp-2 group-hover:text-primary">
                    {video.title}
                  </h3>

                  <p className="text-xs text-muted-foreground">{video.creator}</p>

                  <p className="text-xs text-muted-foreground text-pretty line-clamp-2">{video.description}</p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {video.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {video.rating}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
