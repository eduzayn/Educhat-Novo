import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface AudioPlayerProps {
  audioUrl: string
  isOwnMessage?: boolean
  duration?: number
  className?: string
}

export function AudioPlayer({ audioUrl, isOwnMessage = false, duration, className }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(duration || 0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setTotalDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = `audio-${Date.now()}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={cn(
      "flex items-center space-x-3 p-3 rounded-lg border max-w-xs",
      isOwnMessage 
        ? "bg-primary/10 border-primary/20" 
        : "bg-muted/50 border-border",
      className
    )}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Play/Pause Button */}
      <Button
        variant="ghost"
        size="sm"
        className="p-2 h-auto rounded-full"
        onClick={togglePlayPause}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      {/* Waveform/Progress */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center space-x-2">
          <Volume2 className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Áudio</span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative w-full h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-150",
              isOwnMessage ? "bg-primary" : "bg-primary/70"
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Time Display */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Download Button */}
      <Button
        variant="ghost"
        size="sm"
        className="p-1 h-auto"
        onClick={handleDownload}
        title="Baixar áudio"
      >
        <Download className="h-3 w-3" />
      </Button>
    </div>
  )
}