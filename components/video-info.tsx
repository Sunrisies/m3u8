"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown, Share, Download, Flag, Eye, Calendar, ChevronDown, ChevronUp } from "lucide-react"

interface Video {
  id: string
  title: string
  description: string
  views: string
  uploadDate: string
  creator: string
  creatorAvatar: string
  likes: string
  dislikes: string
  category: string
  rating: number
}

interface VideoInfoProps {
  video: Video
}

export function VideoInfo({ video }: VideoInfoProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (isDisliked) setIsDisliked(false)
  }

  const handleDislike = () => {
    setIsDisliked(!isDisliked)
    if (isLiked) setIsLiked(false)
  }

  return (
    <div className="space-y-4">
      {/* Video Title and Actions */}
      <div className="space-y-3">
        <h1 className="text-xl font-bold text-balance md:text-2xl">{video.title}</h1>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {video.views} views
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {video.uploadDate}
            </div>
            <Badge variant="secondary">{video.category}</Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant={isLiked ? "default" : "outline"} size="sm" className="gap-2" onClick={handleLike}>
              <ThumbsUp className="h-4 w-4" />
              {video.likes}
            </Button>

            <Button
              variant={isDisliked ? "destructive" : "outline"}
              size="sm"
              className="gap-2"
              onClick={handleDislike}
            >
              <ThumbsDown className="h-4 w-4" />
              {video.dislikes}
            </Button>

            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Share className="h-4 w-4" />
              Share
            </Button>

            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download
            </Button>

            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Flag className="h-4 w-4" />
              Report
            </Button>
          </div>
        </div>
      </div>

      {/* Creator Info */}
      <div className="flex items-center justify-between rounded-lg bg-card p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={video.creatorAvatar || "/placeholder.svg"} alt={video.creator} />
            <AvatarFallback>{video.creator.charAt(0)}</AvatarFallback>
          </Avatar>

          <div>
            <h3 className="font-semibold">{video.creator}</h3>
            <p className="text-sm text-muted-foreground">1.2M subscribers</p>
          </div>
        </div>

        <Button>Subscribe</Button>
      </div>

      {/* Description */}
      <div className="rounded-lg bg-card p-4">
        <div className="space-y-2">
          <p className={`text-sm leading-relaxed ${!isDescriptionExpanded ? "line-clamp-3" : ""}`}>
            {video.description}
          </p>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 p-0 h-auto text-muted-foreground hover:text-foreground"
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          >
            {isDescriptionExpanded ? (
              <>
                Show less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show more <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
