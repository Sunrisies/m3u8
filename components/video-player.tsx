"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward } from "lucide-react"
import { cn } from "@/lib/utils"

interface Video {
  id: string
  title: string
  videoUrl: string
  thumbnail: string
}

interface VideoPlayerProps {
  video: Video
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [_hlsSupported, setHlsSupported] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [_orientation, setOrientation] = useState<"portrait" | "landscape">("portrait")

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setOrientation(window.innerWidth > window.innerHeight ? "landscape" : "portrait")
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    window.addEventListener("orientationchange", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("orientationchange", checkMobile)
    }
  }, [])

  useEffect(() => {
    const initializePlayer = async () => {
      if (!videoRef.current) return

      const videoElement = videoRef.current
      const videoUrl = video.videoUrl

      // Check if the URL is an M3U8 file
      if (videoUrl.includes(".m3u8")) {
        // Check if HLS is natively supported (Safari)
        if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
          videoElement.src = videoUrl
          setHlsSupported(true)
        } else {
          // Use HLS.js for other browsers
          try {
            const Hls = (await import("hls.js")).default

            if (Hls.isSupported()) {
              const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                maxBufferLength: isMobile ? 20 : 30,
                maxMaxBufferLength: isMobile ? 40 : 60,
                maxBufferSize: isMobile ? 60 * 1000 * 1000 : 120 * 1000 * 1000,
              })

              hls.loadSource(videoUrl)
              hls.attachMedia(videoElement)

              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setHlsSupported(true)
                setIsLoading(false)
              })

              hls.on(Hls.Events.ERROR, (event, data) => {
                console.error("HLS Error:", data)
                setIsLoading(false)
              })

              // Cleanup function
              return () => {
                hls.destroy()
              }
            }
          } catch (error) {
            console.error("Failed to load HLS.js:", error)
            // Fallback to regular video
            videoElement.src = videoUrl
            setIsLoading(false)
          }
        }
      } else {
        // Regular video file
        videoElement.src = videoUrl
        setIsLoading(false)
      }
    }

    initializePlayer()
  }, [video.videoUrl, isMobile])

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const handleTimeUpdate = () => setCurrentTime(videoElement.currentTime)
    const handleDurationChange = () => setDuration(videoElement.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)

    videoElement.addEventListener("timeupdate", handleTimeUpdate)
    videoElement.addEventListener("durationchange", handleDurationChange)
    videoElement.addEventListener("play", handlePlay)
    videoElement.addEventListener("pause", handlePause)
    videoElement.addEventListener("loadstart", handleLoadStart)
    videoElement.addEventListener("canplay", handleCanPlay)

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate)
      videoElement.removeEventListener("durationchange", handleDurationChange)
      videoElement.removeEventListener("play", handlePlay)
      videoElement.removeEventListener("pause", handlePause)
      videoElement.removeEventListener("loadstart", handleLoadStart)
      videoElement.removeEventListener("canplay", handleCanPlay)
    }
  }, [])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const resetTimeout = () => {
      clearTimeout(timeout)
      setShowControls(true)
      // Longer timeout on mobile for easier interaction
      timeout = setTimeout(
        () => {
          if (isPlaying) setShowControls(false)
        },
        isMobile ? 5000 : 3000,
      )
    }

    const handleMouseMove = () => resetTimeout()
    const handleTouchStart = () => resetTimeout()
    const handleMouseLeave = () => {
      clearTimeout(timeout)
      if (isPlaying && !isMobile) setShowControls(false)
    }

    if (containerRef.current) {
      containerRef.current.addEventListener("mousemove", handleMouseMove)
      containerRef.current.addEventListener("touchstart", handleTouchStart)
      containerRef.current.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      clearTimeout(timeout)
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove)
        containerRef.current.removeEventListener("touchstart", handleTouchStart)
        containerRef.current.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [isPlaying, isMobile])

  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }

  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return
    const newVolume = value[0]
    videoRef.current.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (!videoRef.current) return

    if (isMuted) {
      videoRef.current.volume = volume
      setIsMuted(false)
    } else {
      videoRef.current.volume = 0
      setIsMuted(true)
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const skip = (seconds: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime += seconds
  }

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative overflow-hidden rounded-lg bg-black",
        isMobile ? "aspect-video-mobile" : "aspect-video",
      )}
    >
      <video
        ref={videoRef}
        className="h-full w-full"
        poster={video.thumbnail}
        preload="metadata"
        crossOrigin="anonymous"
        playsInline={isMobile}
        controls={false}
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity",
          showControls ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Play/Pause Button (Center) */}
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white hover:bg-white/20",
            isMobile ? "h-20 w-20" : "h-16 w-16",
          )}
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className={cn(isMobile ? "h-10 w-10" : "h-8 w-8")} />
          ) : (
            <Play className={cn(isMobile ? "h-10 w-10" : "h-8 w-8")} />
          )}
        </Button>

        {/* Bottom Controls */}
        <div className={cn("absolute bottom-0 left-0 right-0", isMobile ? "p-2" : "p-4")}>
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className={cn("text-white hover:bg-white/20", isMobile && "h-10 w-10")}
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className={cn("text-white hover:bg-white/20", isMobile && "h-10 w-10")}
                onClick={() => skip(-10)}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className={cn("text-white hover:bg-white/20", isMobile && "h-10 w-10")}
                onClick={() => skip(10)}
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              {!isMobile && (
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="text-white hover:bg-white/20" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>

                  <div className="w-20">
                    <Slider value={[isMuted ? 0 : volume]} max={1} step={0.1} onValueChange={handleVolumeChange} />
                  </div>
                </div>
              )}

              <div className={cn("text-white", isMobile ? "text-xs" : "text-sm")}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isMobile && (
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                  <Settings className="h-4 w-4" />
                </Button>
              )}

              <Button
                size="icon"
                variant="ghost"
                className={cn("text-white hover:bg-white/20", isMobile && "h-10 w-10")}
                onClick={toggleFullscreen}
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
