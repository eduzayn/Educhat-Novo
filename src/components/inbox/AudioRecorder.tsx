
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Send, 
  Trash2,
  Volume2
} from "lucide-react"

interface AudioRecorderProps {
  onSendAudio: (audioBlob: Blob) => void
  onCancel: () => void
}

export function AudioRecorder({ onSendAudio, onCancel }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl)
        }
        
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
    } catch (error) {
      toast({
        title: "Erro de áudio",
        description: "Não foi possível acessar o microfone.",
        variant: "destructive"
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const playAudio = () => {
    if (audioUrl && !isPlaying) {
      const audio = new Audio(audioUrl)
      audioRef.current = audio
      
      audio.onended = () => {
        setIsPlaying(false)
        audioRef.current = null
      }
      
      audio.play()
      setIsPlaying(true)
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      audioRef.current = null
    }
  }

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
    stopAudio()
  }

  const sendAudio = () => {
    if (audioBlob) {
      onSendAudio(audioBlob)
      deleteRecording()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Recording Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {isRecording ? "Gravando..." : audioBlob ? "Gravação pronta" : "Gravador de áudio"}
              </span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {formatTime(recordingTime)}
            </div>
          </div>

          {/* Recording Controls */}
          <div className="flex items-center justify-center space-x-2">
            {!audioBlob && (
              <Button
                variant={isRecording ? "destructive" : "default"}
                size="lg"
                onClick={isRecording ? stopRecording : startRecording}
                className="px-6"
              >
                {isRecording ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Parar
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Gravar
                  </>
                )}
              </Button>
            )}

            {audioBlob && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isPlaying ? stopAudio : playAudio}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deleteRecording}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Action Buttons */}
          {audioBlob && (
            <div className="flex items-center justify-between space-x-2">
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancelar
              </Button>
              
              <Button
                onClick={sendAudio}
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </div>
          )}

          {/* Recording indicator */}
          {isRecording && (
            <div className="flex items-center justify-center space-x-2 text-destructive">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
              <span className="text-xs">Gravando áudio...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
