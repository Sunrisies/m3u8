import { Navigation } from "@/components/navigation"
import { VideoPlayer } from "@/components/video-player"
import { VideoRecommendations } from "@/components/video-recommendations"
import { VideoInfo } from "@/components/video-info"
import { notFound } from "next/navigation"

// Mock video data - in a real app, this would come from a database
const getVideoById = (id: string) => {
  const videos = {
    "1": {
      id: "1",
      title: "Amazing Nature Documentary: Wildlife in 4K",
      description:
        "Explore the breathtaking world of wildlife captured in stunning 4K resolution. From majestic lions to colorful birds, this documentary takes you on an incredible journey through nature's most spectacular moments.",
      thumbnail: "/nature-documentary-wildlife.jpg",
      videoUrl: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", // Sample M3U8 stream
      duration: "45:30",
      views: "2.1M",
      rating: 4.8,
      category: "Education",
      uploadDate: "2 days ago",
      creator: "Nature Films HD",
      creatorAvatar: "/placeholder.svg?height=40&width=40",
      likes: "125K",
      dislikes: "2.1K",
    },
    "2": {
      id: "2",
      title: "Tech Innovation Summit 2024: AI & Robotics",
      description:
        "Latest breakthroughs in artificial intelligence and robotics presented by industry leaders and researchers. Discover the future of technology and how it will shape our world.",
      thumbnail: "/tech-conference-ai-robotics.jpg",
      videoUrl: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8", // Sample M3U8 stream
      duration: "1:12:45",
      views: "856K",
      rating: 4.6,
      category: "Technology",
      uploadDate: "1 week ago",
      creator: "Tech Summit",
      creatorAvatar: "/placeholder.svg?height=40&width=40",
      likes: "45K",
      dislikes: "1.2K",
    },
    "3": {
      id: "3",
      title: "Cooking Masterclass: Professional Techniques",
      description:
        "Learn professional cooking techniques from world-class chefs. Master the art of fine dining at home with step-by-step instructions and expert tips.",
      thumbnail: "/cooking-masterclass-chef-kitchen.jpg",
      videoUrl:
        "https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8", // Sample M3U8 stream
      duration: "28:15",
      views: "1.5M",
      rating: 4.9,
      category: "Cooking",
      uploadDate: "3 days ago",
      creator: "Chef Academy",
      creatorAvatar: "/placeholder.svg?height=40&width=40",
      likes: "89K",
      dislikes: "892",
    },
    "4": {
      id: "4",
      title: "Space Exploration: Mars Mission Updates",
      description:
        "Latest updates from NASA's Mars exploration missions with exclusive footage and expert interviews. Get an inside look at humanity's journey to the Red Planet.",
      thumbnail: "/space-mars-mission-exploration.jpg",
      videoUrl: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", // Sample M3U8 stream
      duration: "35:20",
      views: "3.2M",
      rating: 4.7,
      category: "Science",
      uploadDate: "5 days ago",
      creator: "Space Channel",
      creatorAvatar: "/placeholder.svg?height=40&width=40",
      likes: "198K",
      dislikes: "3.4K",
    },
  }

  return videos[id as keyof typeof videos] || null
}

interface WatchPageProps {
  params: {
    id: string
  }
}

export default function WatchPage({ params }: WatchPageProps) {
  const video = getVideoById(params.id)

  if (!video) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background flex justify-center items-center flex-col">
      <Navigation />

      <main className="container px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Video Section */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {/* Video Player */}
              <VideoPlayer video={video} />

              {/* Video Info */}
              <VideoInfo video={video} />
            </div>
          </div>

          {/* Sidebar - Recommendations */}
          <div className="lg:col-span-1">
            <VideoRecommendations currentVideoId={video.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
