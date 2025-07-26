import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import { enhancedAIService } from "@/components/copilot/EnhancedAIService"
import { 
  Bot, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  FileText, 
  Volume2,
  VolumeX,
  Brain,
  Zap
} from "lucide-react"

interface ZAIAControlsProps {
  conversationId: number | null
  onAIResponse: (message: string, audioUrl?: string) => void
}

export function ZAIAControls({ conversationId, onAIResponse }: ZAIAControlsProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessingAudio, setIsProcessingAudio] = useState(false)
  const [isProcessingImage, setIsProcessingImage] = useState(false)
  const [isProcessingDoc, setIsProcessingDoc] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Start/Stop voice recording
  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        
        audioChunksRef.current = []
        
        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data)
        }
        
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
          await processAudioMessage(audioBlob)
          stream.getTracks().forEach(track => track.stop())
        }
        
        mediaRecorderRef.current = mediaRecorder
        mediaRecorder.start()
        setIsRecording(true)
        
        toast({
          title: "Gravando áudio",
          description: "Fale sua mensagem. Clique novamente para parar."
        })
      } catch (error) {
        toast({
          title: "Erro de áudio",
          description: "Não foi possível acessar o microfone.",
          variant: "destructive"
        })
      }
    } else {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
    }
  }

  // Process audio message
  const processAudioMessage = async (audioBlob: Blob) => {
    setIsProcessingAudio(true)
    setProcessingProgress(0)
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      // Transcribe audio
      const transcription = await enhancedAIService.transcribeAudio(audioBlob)
      
      clearInterval(progressInterval)
      setProcessingProgress(100)
      
      // Generate AI response
      const response = await enhancedAIService.generateResponse([
        { role: 'user', content: transcription, type: 'audio' }
      ])
      
      onAIResponse(response.response, response.audioUrl)
      
      toast({
        title: "Áudio processado",
        description: `Mensagem: "${transcription.substring(0, 50)}..."`
      })
      
    } catch (error) {
      toast({
        title: "Erro no processamento",
        description: "Não foi possível processar o áudio.",
        variant: "destructive"
      })
    } finally {
      setIsProcessingAudio(false)
      setProcessingProgress(0)
    }
  }

  // Process image
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setIsProcessingImage(true)
    
    try {
      const imageUrl = URL.createObjectURL(file)
      
      const response = await enhancedAIService.generateResponse([
        { role: 'user', content: "Usuário enviou uma imagem", type: 'image', imageUrl }
      ])
      
      onAIResponse(response.response, response.audioUrl)
      
      toast({
        title: "Imagem analisada",
        description: "IA analisou a imagem e gerou uma resposta."
      })
      
    } catch (error) {
      toast({
        title: "Erro na análise",
        description: "Não foi possível analisar a imagem.",
        variant: "destructive"
      })
    } finally {
      setIsProcessingImage(false)
    }
  }

  // Process document/URL
  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setIsProcessingDoc(true)
    
    try {
      // For now, we'll simulate document processing
      // In a real implementation, you'd upload to a service and get a URL
      const response = await enhancedAIService.generateResponse([
        { role: 'user', content: `Usuário enviou documento: ${file.name}`, type: 'document' }
      ])
      
      onAIResponse(response.response, response.audioUrl)
      
      toast({
        title: "Documento processado",
        description: `Analisou: ${file.name}`
      })
      
    } catch (error) {
      toast({
        title: "Erro no documento",
        description: "Não foi possível processar o documento.",
        variant: "destructive"
      })
    } finally {
      setIsProcessingDoc(false)
    }
  }

  // Play/stop audio response
  const toggleAudio = () => {
    if (currentAudio) {
      currentAudio.pause()
      setCurrentAudio(null)
    }
    setIsAudioEnabled(!isAudioEnabled)
  }

  // Play AI audio response
  const playAudioResponse = (audioUrl: string) => {
    if (!isAudioEnabled) return
    
    if (currentAudio) {
      currentAudio.pause()
    }
    
    const audio = new Audio(audioUrl)
    audio.play()
    setCurrentAudio(audio)
    
    audio.onended = () => setCurrentAudio(null)
  }

  if (!conversationId) return null

  return (
    <Card className="mb-4 border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-medium text-primary">ZAIA - Assistente Multimodal</span>
            <Badge variant="outline" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Ativo
            </Badge>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAudio}
            className={isAudioEnabled ? "text-primary" : "text-muted-foreground"}
          >
            {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>

        {/* Processing Progress */}
        {(isProcessingAudio || isProcessingImage || isProcessingDoc) && (
          <div className="mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Processando com IA...
              </span>
            </div>
            <Progress value={processingProgress} className="h-2" />
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex items-center space-x-2">
          {/* Voice Recording */}
          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="sm"
            onClick={toggleRecording}
            disabled={isProcessingAudio}
            className="flex-1"
          >
            {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
            {isRecording ? "Parar Gravação" : "Gravar Áudio"}
          </Button>

          {/* Image Upload */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => imageInputRef.current?.click()}
            disabled={isProcessingImage}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>

          {/* Document Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleDocumentUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingDoc}
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-secondary/80">
            🎯 Análise de Sentimento
          </Badge>
          <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-secondary/80">
            🧠 Sugestão Inteligente
          </Badge>
          <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-secondary/80">
            📊 Classificação Automática
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}