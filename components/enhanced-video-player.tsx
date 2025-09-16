"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  SkipBack, 
  SkipForward,
  PictureInPicture,
  Wifi,
  WifiOff,
  Loader2
} from "lucide-react"
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

interface QualityLevel {
  height: number
  bitrate: number
  name: string
}

interface NetworkInfo {
  effectiveType: string
  downlink: number
  rtt: number
}

export function EnhancedVideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hlsRef = useRef<any>(null)
  
  // 基础播放状态
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  
  // 高级功能状态
  const [playbackRate, setPlaybackRate] = useState(1)
  const [qualityLevels, setQualityLevels] = useState<QualityLevel[]>([])
  const [currentQuality, setCurrentQuality] = useState<number>(-1) // -1 表示自动
  const [isPictureInPicture, setIsPictureInPicture] = useState(false)
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null)
  const [bufferHealth, setBufferHealth] = useState(0)
  const [isBuffering, setIsBuffering] = useState(false)

  // 设备检测
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    window.addEventListener("orientationchange", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("orientationchange", checkMobile)
    }
  }, [])

  // 网络状况检测
  useEffect(() => {
    const updateNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        setNetworkInfo({
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0
        })
      }
    }

    updateNetworkInfo()
    
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      connection.addEventListener('change', updateNetworkInfo)
      
      return () => {
        connection.removeEventListener('change', updateNetworkInfo)
      }
    }
  }, [])

  // HLS.js 初始化和配置
  useEffect(() => {
    const initializePlayer = async () => {
      if (!videoRef.current) return

      const videoElement = videoRef.current
      const videoUrl = video.videoUrl

      // 清理之前的HLS实例
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }

      if (videoUrl.includes(".m3u8")) {
        // 检查原生HLS支持 (Safari)
        if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
          videoElement.src = videoUrl
          setIsLoading(false)
        } else {
          // 使用HLS.js
          try {
            const Hls = (await import("hls.js")).default

            if (Hls.isSupported()) {
              const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                // 根据设备类型和网络状况调整缓冲策略
                maxBufferLength: getOptimalBufferLength(),
                maxMaxBufferLength: getOptimalMaxBufferLength(),
                maxBufferSize: getOptimalBufferSize(),
                // 自适应比特率配置
                abrEwmaFastLive: 3.0,
                abrEwmaSlowLive: 9.0,
                abrEwmaFastVoD: 3.0,
                abrEwmaSlowVoD: 9.0,
                abrEwmaDefaultEstimate: 500000,
                abrBandWidthFactor: 0.95,
                abrBandWidthUpFactor: 0.7,
                // 错误恢复配置
                fragLoadingTimeOut: 20000,
                manifestLoadingTimeOut: 10000,
                levelLoadingTimeOut: 10000,
              })

              hlsRef.current = hls
              hls.loadSource(videoUrl)
              hls.attachMedia(videoElement)

              // 监听清单解析完成
              hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                console.log('HLS manifest parsed, levels:', data.levels)
                
                // 设置可用画质等级
                const levels = data.levels.map((level: any, index: number) => ({
                  height: level.height,
                  bitrate: level.bitrate,
                  name: getQualityName(level.height)
                }))
                setQualityLevels(levels)
                setIsLoading(false)
              })

              // 监听画质切换
              hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
                console.log('Quality switched to level:', data.level)
                setCurrentQuality(data.level)
              })

              // 监听缓冲状态
              hls.on(Hls.Events.BUFFER_APPENDED, () => {
                updateBufferHealth()
              })

              // 监听错误
              hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('HLS Error:', data)
                
                if (data.fatal) {
                  switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                      console.log('Network error, trying to recover...')
                      hls.startLoad()
                      break
                    case Hls.ErrorTypes.MEDIA_ERROR:
                      console.log('Media error, trying to recover...')
                      hls.recoverMediaError()
                      break
                    default:
                      console.log('Fatal error, destroying HLS instance')
                      hls.destroy()
                      break
                  }
                }
                setIsLoading(false)
              })

              // 监听加载状态
              hls.on(Hls.Events.FRAG_LOADING, () => {
                setIsBuffering(true)
              })

              hls.on(Hls.Events.FRAG_LOADED, () => {
                setIsBuffering(false)
              })

            }
          } catch (error) {
            console.error("Failed to load HLS.js:", error)
            videoElement.src = videoUrl
            setIsLoading(false)
          }
        }
      } else {
        // 普通视频文件
        videoElement.src = videoUrl
        setIsLoading(false)
      }
    }

    initializePlayer()

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [video.videoUrl])

  // 根据网络状况获取最优缓冲配置
  const getOptimalBufferLength = useCallback(() => {
    if (!networkInfo) return isMobile ? 20 : 30
    
    switch (networkInfo.effectiveType) {
      case 'slow-2g':
      case '2g':
        return 10
      case '3g':
        return isMobile ? 15 : 20
      case '4g':
      default:
        return isMobile ? 25 : 35
    }
  }, [networkInfo, isMobile])

  const getOptimalMaxBufferLength = useCallback(() => {
    return getOptimalBufferLength() * 2
  }, [getOptimalBufferLength])

  const getOptimalBufferSize = useCallback(() => {
    if (!networkInfo) return isMobile ? 60 * 1000 * 1000 : 120 * 1000 * 1000
    
    switch (networkInfo.effectiveType) {
      case 'slow-2g':
      case '2g':
        return 30 * 1000 * 1000
      case '3g':
        return 60 * 1000 * 1000
      case '4g':
      default:
        return isMobile ? 100 * 1000 * 1000 : 150 * 1000 * 1000
    }
  }, [networkInfo, isMobile])

  // 获取画质名称
  const getQualityName = (height: number): string => {
    if (height >= 2160) return '4K'
    if (height >= 1440) return '1440p'
    if (height >= 1080) return '1080p'
    if (height >= 720) return '720p'
    if (height >= 480) return '480p'
    if (height >= 360) return '360p'
    return '240p'
  }

  // 更新缓冲健康度
  const updateBufferHealth = useCallback(() => {
    if (!videoRef.current) return
    
    const video = videoRef.current
    const buffered = video.buffered
    
    if (buffered.length > 0) {
      const currentTime = video.currentTime
      const bufferedEnd = buffered.end(buffered.length - 1)
      const health = Math.min((bufferedEnd - currentTime) / 30, 1) // 30秒为满缓冲
      setBufferHealth(health)
    }
  }, [])

  // 视频事件监听
  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime)
      updateBufferHealth()
    }
    const handleDurationChange = () => setDuration(videoElement.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleWaiting = () => setIsBuffering(true)
    const handlePlaying = () => setIsBuffering(false)

    videoElement.addEventListener("timeupdate", handleTimeUpdate)
    videoElement.addEventListener("durationchange", handleDurationChange)
    videoElement.addEventListener("play", handlePlay)
    videoElement.addEventListener("pause", handlePause)
    videoElement.addEventListener("loadstart", handleLoadStart)
    videoElement.addEventListener("canplay", handleCanPlay)
    videoElement.addEventListener("waiting", handleWaiting)
    videoElement.addEventListener("playing", handlePlaying)

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate)
      videoElement.removeEventListener("durationchange", handleDurationChange)
      videoElement.removeEventListener("play", handlePlay)
      videoElement.removeEventListener("pause", handlePause)
      videoElement.removeEventListener("loadstart", handleLoadStart)
      videoElement.removeEventListener("canplay", handleCanPlay)
      videoElement.removeEventListener("waiting", handleWaiting)
      videoElement.removeEventListener("playing", handlePlaying)
    }
  }, [updateBufferHealth])

  // 控制栏自动隐藏
  useEffect(() => {
    let timeout: NodeJS.Timeout

    const resetTimeout = () => {
      clearTimeout(timeout)
      setShowControls(true)
      timeout = setTimeout(
        () => {
          if (isPlaying && !isPictureInPicture) setShowControls(false)
        },
        isMobile ? 5000 : 3000,
      )
    }

    const handleMouseMove = () => resetTimeout()
    const handleTouchStart = () => resetTimeout()
    const handleMouseLeave = () => {
      clearTimeout(timeout)
      if (isPlaying && !isMobile && !isPictureInPicture) setShowControls(false)
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
  }, [isPlaying, isMobile, isPictureInPicture])

  // 画中画模式监听
  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const handleEnterPiP = () => setIsPictureInPicture(true)
    const handleLeavePiP = () => setIsPictureInPicture(false)

    videoElement.addEventListener('enterpictureinpicture', handleEnterPiP)
    videoElement.addEventListener('leavepictureinpicture', handleLeavePiP)

    return () => {
      videoElement.removeEventListener('enterpictureinpicture', handleEnterPiP)
      videoElement.removeEventListener('leavepictureinpicture', handleLeavePiP)
    }
  }, [])

  // 播放控制函数
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

  const togglePictureInPicture = async () => {
    if (!videoRef.current) return

    try {
      if (isPictureInPicture) {
        await document.exitPictureInPicture()
      } else {
        await videoRef.current.requestPictureInPicture()
      }
    } catch (error) {
      console.error('Picture-in-Picture error:', error)
    }
  }

  const skip = (seconds: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime += seconds
  }

  const changePlaybackRate = (rate: number) => {
    if (!videoRef.current) return
    videoRef.current.playbackRate = rate
    setPlaybackRate(rate)
  }

  const changeQuality = (levelIndex: number) => {
    if (!hlsRef.current) return
    
    if (levelIndex === -1) {
      // 自动画质
      hlsRef.current.currentLevel = -1
    } else {
      hlsRef.current.currentLevel = levelIndex
    }
    setCurrentQuality(levelIndex)
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

  const getNetworkIcon = () => {
    if (!networkInfo) return <Wifi className="h-3 w-3" />
    
    switch (networkInfo.effectiveType) {
      case 'slow-2g':
      case '2g':
        return <WifiOff className="h-3 w-3 text-red-400" />
      case '3g':
        return <Wifi className="h-3 w-3 text-yellow-400" />
      case '4g':
      default:
        return <Wifi className="h-3 w-3 text-green-400" />
    }
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

      {/* 加载指示器 */}
      {(isLoading || isBuffering) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="text-sm text-white">
              {isLoading ? '加载中...' : '缓冲中...'}
            </span>
          </div>
        </div>
      )}

      {/* 网络状态指示器 */}
      {networkInfo && (
        <div className="absolute top-4 left-4 flex items-center gap-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
          {getNetworkIcon()}
          <span>{networkInfo.effectiveType.toUpperCase()}</span>
        </div>
      )}

      {/* 缓冲健康度指示器 */}
      <div className="absolute top-4 right-4 w-16 h-1 bg-white/20 rounded">
        <div 
          className="h-full bg-green-400 rounded transition-all duration-300"
          style={{ width: `${bufferHealth * 100}%` }}
        />
      </div>

      {/* 控制栏覆盖层 */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity",
          showControls ? "opacity-100" : "opacity-0",
        )}
      >
        {/* 中央播放/暂停按钮 */}
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

        {/* 底部控制栏 */}
        <div className={cn("absolute bottom-0 left-0 right-0", isMobile ? "p-2" : "p-4")}>
          {/* 进度条 */}
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
          </div>

          {/* 控制按钮 */}
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
              {/* 播放速度控制 */}
              {!isMobile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      {playbackRate}x
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <DropdownMenuItem key={rate} onClick={() => changePlaybackRate(rate)}>
                        {rate}x
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* 画质选择 */}
              {qualityLevels.length > 0 && !isMobile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      {currentQuality === -1 ? '自动' : qualityLevels[currentQuality]?.name || '自动'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => changeQuality(-1)}>
                      自动
                    </DropdownMenuItem>
                    {qualityLevels.map((level, index) => (
                      <DropdownMenuItem key={index} onClick={() => changeQuality(index)}>
                        {level.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* 画中画按钮 */}
              {!isMobile && 'pictureInPictureEnabled' in document && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={togglePictureInPicture}
                >
                  <PictureInPicture className="h-4 w-4" />
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