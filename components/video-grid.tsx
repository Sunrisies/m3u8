"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, Eye, Star, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function VideoGrid() {
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null)

  const videos = [
    {
      id: "1",
      title: "Amazing Nature Documentary: Wildlife in 4K",
      description:
        "Explore the breathtaking world of wildlife captured in stunning 4K resolution. From majestic lions to colorful birds.",
      thumbnail: "nature-documentary-wildlife.jpg",
      duration: "45:30",
      views: "2.1M",
      rating: 4.8,
      category: "Education",
      uploadDate: "2 days ago",
      creator: "Nature Films HD",
    },
    {
      id: "2",
      title: "Tech Innovation Summit 2024: AI & Robotics",
      description:
        "Latest breakthroughs in artificial intelligence and robotics presented by industry leaders and researchers.",
      thumbnail: "/tech-conference-ai-robotics.jpg",
      duration: "1:12:45",
      views: "856K",
      rating: 4.6,
      category: "Technology",
      uploadDate: "1 week ago",
      creator: "Tech Summit",
    },
    {
      id: "3",
      title: "Cooking Masterclass: Professional Techniques",
      description:
        "Learn professional cooking techniques from world-class chefs. Master the art of fine dining at home.",
      thumbnail: "/cooking-masterclass-chef-kitchen.jpg",
      duration: "28:15",
      views: "1.5M",
      rating: 4.9,
      category: "Cooking",
      uploadDate: "3 days ago",
      creator: "Chef Academy",
    },
    {
      id: "4",
      title: "Space Exploration: Mars Mission Updates",
      description: "Latest updates from NASA's Mars exploration missions with exclusive footage and expert interviews.",
      thumbnail: "/space-mars-mission-exploration.jpg",
      duration: "35:20",
      views: "3.2M",
      rating: 4.7,
      category: "Science",
      uploadDate: "5 days ago",
      creator: "Space Channel",
    },
    {
      id: "5",
      title: "Digital Art Tutorial: Advanced Techniques",
      description:
        "Master advanced digital art techniques using industry-standard software and professional workflows.",
      thumbnail: "/digital-art-tutorial-design.jpg",
      duration: "52:10",
      views: "892K",
      rating: 4.8,
      category: "Art & Design",
      uploadDate: "1 week ago",
      creator: "Art Studio Pro",
    },
    {
      id: "6",
      title: "Fitness Journey: Complete Home Workout",
      description: "Transform your fitness with this comprehensive home workout routine. No equipment needed.",
      thumbnail: "/fitness-home-workout-exercise.jpg",
      duration: "42:30",
      views: "1.8M",
      rating: 4.6,
      category: "Sports",
      uploadDate: "4 days ago",
      creator: "Fit Life",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Showing {videos.length} videos</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Button variant="ghost" size="sm">
            Most Recent
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
          <Card
            key={video.id}
            className="group overflow-hidden transition-all hover:shadow-lg"
            onMouseEnter={() => setHoveredVideo(video.id)}
            onMouseLeave={() => setHoveredVideo(null)}
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />

              {hoveredVideo === video.id && (
                <Button
                  size="icon"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all"
                  asChild
                >
                  <Link href={`/watch/${video.id}`}>
                    <Play className="h-4 w-4" />
                  </Link>
                </Button>
              )}

              <div className="absolute bottom-2 left-2">
                <Badge variant="secondary" className="text-xs">
                  {video.category}
                </Badge>
              </div>

              <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/80 px-2 py-1 text-xs text-white">
                <Clock className="h-3 w-3" />
                {video.duration}
              </div>
            </div>

            <CardContent className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-semibold text-balance leading-tight">{video.title}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Add to Watchlist</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem>Report</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="mb-3 text-sm text-muted-foreground text-pretty line-clamp-2">{video.description}</p>

              <div className="mb-2 text-xs text-muted-foreground">
                {video.creator} • {video.uploadDate}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
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
    </div>
  )
}
