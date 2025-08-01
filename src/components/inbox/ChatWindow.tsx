import { useState, useRef, useMemo, useEffect } from "react"
import { QuickRepliesModal } from "@/components/modals/QuickRepliesModal"
import { AudioRecorder } from "@/components/inbox/AudioRecorder"
import { AudioPlayer } from "@/components/inbox/AudioPlayer"
import { AttachmentModal } from "@/components/inbox/AttachmentModal"
import { InternalNoteButton } from "@/components/inbox/InternalNoteButton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { enhancedAIService } from "@/components/copilot/EnhancedAIService"
import { KnowledgeIndicator } from "@/components/copilot/KnowledgeIndicator"
import { 
  Send, 
  Paperclip, 
  Mic, 
  Bot, 
  MoreVertical,
  Phone,
  PhoneCall,
  PhoneOff,
  Video,
  VideoOff,
  MessageSquare,
  Clock,
  Check,
  CheckCheck,
  ArrowRight,
  UserPlus,
  Archive,
  Star,
  Flag,
  Trash2,
  Settings,
  FileText,
  Download,
  Mail,
  Users,
  User,
  StickyNote
} from "lucide-react"

interface Message {
  id: number
  content: string
  timestamp: string
  date: string // Nova propriedade para agrupamento por data
  isFromUser: boolean
  isFromBot?: boolean
  status?: "sent" | "delivered" | "read"
  type?: "text" | "audio" | "internal_note" // Adicionar tipo de nota interna
  audioUrl?: string // URL do áudio para mensagens de áudio
  audioDuration?: number // Duração do áudio em segundos
  isInternalNote?: boolean // Flag para identificar notas internas
  authorName?: string // Nome do autor da nota interna
  authorId?: string // ID do autor da nota interna
}

// Funções utilitárias para agrupamento de mensagens por data
const formatDateSection = (dateString: string): string => {
  const messageDate = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  // Reset hours for comparison
  const messageDateOnly = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate())
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())
  
  if (messageDateOnly.getTime() === todayOnly.getTime()) {
    return "Hoje"
  } else if (messageDateOnly.getTime() === yesterdayOnly.getTime()) {
    return "Ontem"
  } else {
    return messageDate.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

const groupMessagesByDate = (messages: Message[]) => {
  const grouped: { [key: string]: Message[] } = {}
  
  messages.forEach(message => {
    const dateKey = message.date
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(message)
  })
  
  return grouped
}

// Mock data para mensagens com datas completas
const messages: Message[] = [
  {
    id: 1,
    content: "Olá! Gostaria de saber mais sobre os produtos de vocês.",
    timestamp: "10:25",
    date: "2024-01-26", // Hoje
    isFromUser: false
  },
  {
    id: 2,
    content: "Olá Maria! Claro, ficarei feliz em ajudar. Qual tipo de produto você tem interesse?",
    timestamp: "10:26",
    date: "2024-01-26", // Hoje
    isFromUser: true,
    status: "read"
  },
  {
    id: 3,
    content: "Estou procurando algo para automação residencial. Vocês trabalham com isso?",
    timestamp: "10:28",
    date: "2024-01-26", // Hoje
    isFromUser: false,
    type: "audio",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    audioDuration: 45
  },
  {
    id: 4,
    content: "Sim! Temos uma linha completa de automação. Posso enviar nosso catálogo para você dar uma olhada?",
    timestamp: "10:29",
    date: "2024-01-26", // Hoje
    isFromUser: true,
    status: "delivered",
    type: "audio",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    audioDuration: 32
  },
  {
    id: 5,
    content: "Cliente interessado em automação residencial. Já enviamos o catálogo por email.",
    timestamp: "10:30",
    date: "2024-01-26", // Hoje
    isFromUser: false,
    type: "internal_note",
    isInternalNote: true,
    authorName: "João Silva",
    authorId: "1"
  },
  {
    id: 6,
    content: "Perfeito! Vou aguardar o catálogo. Muito obrigada!",
    timestamp: "16:45",
    date: "2024-01-25", // Ontem
    isFromUser: false
  },
  {
    id: 7,
    content: "De nada! Acabei de enviar por email. Qualquer dúvida, estou aqui.",
    timestamp: "16:47",
    date: "2024-01-25", // Ontem
    isFromUser: true,
    status: "read"
  },
  {
    id: 8,
    content: "Demonstração agendada para próxima semana. Cliente demonstrou muito interesse no kit básico.",
    timestamp: "16:50",
    date: "2024-01-25", // Ontem
    isFromUser: false,
    type: "internal_note",
    isInternalNote: true,
    authorName: "Maria Santos",
    authorId: "2"
  },
  {
    id: 9,
    content: "Bom dia! Recebi o catálogo ontem. Estou interessada no kit básico.",
    timestamp: "09:15",
    date: "2024-01-24", // Anteontem
    isFromUser: false
  },
  {
    id: 10,
    content: "Ótima escolha! O kit básico é perfeito para começar. Posso agendar uma demonstração?",
    timestamp: "09:18",
    date: "2024-01-24", // Anteontem
    isFromUser: true,
    status: "read"
  },
  {
    id: 11,
    content: "Sim, seria perfeito! Que tal na próxima semana?",
    timestamp: "14:30",
    date: "2024-01-22", // Alguns dias atrás
    isFromUser: false
  },
  {
    id: 12,
    content: "Perfeito! Vou verificar minha agenda e te dou um retorno ainda hoje.",
    timestamp: "14:32",
    date: "2024-01-22", // Alguns dias atrás
    isFromUser: true,
    status: "delivered"
  }
]

const quickReplies = [
  "Obrigado pelo contato!",
  "Vou verificar isso para você",
  "Posso ajudar com mais alguma coisa?",
  "Aguarde um momento, por favor"
]

// Mock data para usuários disponíveis
const availableUsers = [
  { id: "1", name: "João Silva", team: "Vendas", status: "online", avatar: "J" },
  { id: "2", name: "Ana Costa", team: "Suporte", status: "online", avatar: "A" },
  { id: "3", name: "Pedro Santos", team: "Vendas", status: "busy", avatar: "P" },
  { id: "4", name: "Maria Oliveira", team: "Financeiro", status: "online", avatar: "M" },
  { id: "5", name: "Carlos Lima", team: "Suporte", status: "offline", avatar: "C" },
]

interface ChatWindowProps {
  conversationId: number | null
  onNoteCallbackReady?: (callback: (note: { content: string, authorName: string, authorId?: string }) => void) => void
}

export function ChatWindow({ conversationId, onNoteCallbackReady }: ChatWindowProps) {
  const [message, setMessage] = useState("")
  const [internalMessages, setInternalMessages] = useState<Message[]>(messages)
  const [isRecording, setIsRecording] = useState(false)
  const [showAudioRecorder, setShowAudioRecorder] = useState(false)
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState("00:00")
  const [isVideoCallActive, setIsVideoCallActive] = useState(false)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false)
  const [isQuickRepliesModalOpen, setIsQuickRepliesModalOpen] = useState(false)
  const [transferType, setTransferType] = useState("team")
  const [transferTeam, setTransferTeam] = useState("")
  const [transferUser, setTransferUser] = useState("")
  const [transferNote, setTransferNote] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Agrupar mensagens por data usando useMemo para performance
  const groupedMessages = useMemo(() => {
    const sorted = [...internalMessages].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    return groupMessagesByDate(sorted)
  }, [internalMessages])

  // Ordenar as datas para exibição cronológica
  const sortedDateKeys = useMemo(() => {
    return Object.keys(groupedMessages).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  }, [groupedMessages])

  const handleSendMessage = () => {
    if (message.trim()) {
      // Aqui seria enviada a mensagem
      setMessage("")
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const fileName = file.name
      const fileSize = (file.size / 1024 / 1024).toFixed(2) // MB
      
      toast({
        title: "Arquivo selecionado",
        description: `${fileName} (${fileSize} MB) pronto para envio.`
      })
      
      // Here you would handle the file upload logic
      console.log('Selected file:', file)
    }
  }

  const handleSendAudio = (audioBlob: Blob) => {
    // Aqui seria enviado o áudio
    toast({
      title: "Áudio enviado",
      description: "Mensagem de áudio foi enviada com sucesso."
    })
    setShowAudioRecorder(false)
  }

  const handleCancelAudio = () => {
    setShowAudioRecorder(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Função para detectar comandos de respostas rápidas
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMessage(value)
    
    // Detectar se o usuário digitou "/" ou "\" para abrir respostas rápidas
    if (value === "/" || value === "\\") {
      setIsQuickRepliesModalOpen(true)
      setMessage("") // Limpar o campo após abrir o modal
    }
  }

  // Função para lidar com a seleção de resposta rápida
  const handleQuickReplySelect = (reply: { content: string }) => {
    setMessage(reply.content)
    setIsQuickRepliesModalOpen(false)
  }

  // Função para adicionar nota interna como mensagem na conversa
  const handleAddInternalNoteToConversation = (noteData: { content: string, authorName: string, authorId?: string }) => {
    console.log('handleAddInternalNoteToConversation called with:', noteData)
    
    if (!noteData || !noteData.content) {
      console.error('Invalid noteData received:', noteData)
      return
    }
    
    const now = new Date()
    const timestamp = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    const date = now.toISOString().split('T')[0]

    const newInternalNote: Message = {
      id: Math.max(...internalMessages.map(m => m.id)) + 1,
      content: noteData.content,
      timestamp: timestamp,
      date: date,
      isFromUser: false,
      type: "internal_note",
      isInternalNote: true,
      authorName: noteData.authorName,
      authorId: noteData.authorId
    }

    setInternalMessages(prev => [...prev, newInternalNote])
  }

  // Expor a callback para componentes externos
  useEffect(() => {
    if (onNoteCallbackReady) {
      onNoteCallbackReady(handleAddInternalNoteToConversation)
    }
  }, [onNoteCallbackReady])

  const handleStartCall = () => {
    setIsCallActive(true)
    // Simulate call timer
    let seconds = 0
    const timer = setInterval(() => {
      seconds++
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      setCallDuration(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`)
    }, 1000)
    
    toast({
      title: "Chamada iniciada",
      description: "Conectando com Maria Silva..."
    })
    
    // Store timer in a ref if you want to clear it later
    setTimeout(() => {
      if (timer) {
        // Auto cleanup for demo purposes
      }
    }, 60000)
  }

  const handleEndCall = () => {
    setIsCallActive(false)
    setCallDuration("00:00")
    toast({
      title: "Chamada finalizada",
      description: `Duração: ${callDuration}`
    })
  }

  const handleStartVideoCall = () => {
    setIsVideoCallActive(true)
    // Simulate call timer
    let seconds = 0
    const timer = setInterval(() => {
      seconds++
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      setCallDuration(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`)
    }, 1000)
    
    toast({
      title: "Videochamada iniciada",
      description: "Conectando via Agora.io..."
    })
    
    // Store timer in a ref if you want to clear it later
    setTimeout(() => {
      if (timer) {
        // Auto cleanup for demo purposes
      }
    }, 60000)
  }

  const handleEndVideoCall = () => {
    setIsVideoCallActive(false)
    setCallDuration("00:00")
    toast({
      title: "Videochamada finalizada",
      description: `Duração: ${callDuration}`
    })
  }

  const handleTransfer = () => {
    if (transferType === "team" && !transferTeam) {
      toast({
        title: "Erro",
        description: "Selecione uma equipe para transferir.",
        variant: "destructive"
      })
      return
    }

    if (transferType === "user" && !transferUser) {
      toast({
        title: "Erro", 
        description: "Selecione um usuário para transferir.",
        variant: "destructive"
      })
      return
    }

    const transferTarget = transferType === "team" ? transferTeam : availableUsers.find(u => u.id === transferUser)?.name
    
    toast({
      title: "Conversa transferida",
      description: `Transferido para ${transferType === "team" ? "equipe" : "usuário"}: ${transferTarget}`
    })
    
    setIsTransferModalOpen(false)
    setTransferType("team")
    setTransferTeam("")
    setTransferUser("")
    setTransferNote("")
  }

  const handleAttachmentSelect = (type: string) => {
    switch (type) {
      case "document":
        // Trigger file input for documents
        const documentInput = document.createElement('input')
        documentInput.type = 'file'
        documentInput.accept = '.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx'
        documentInput.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0]
          if (file) {
            toast({
              title: "Documento selecionado",
              description: `${file.name} pronto para envio.`
            })
          }
        }
        documentInput.click()
        break
      
      case "media":
        // Trigger file input for images/videos
        const mediaInput = document.createElement('input')
        mediaInput.type = 'file'
        mediaInput.accept = 'image/*,video/*'
        mediaInput.multiple = true
        mediaInput.onchange = (e) => {
          const files = (e.target as HTMLInputElement).files
          if (files && files.length > 0) {
            toast({
              title: "Mídia selecionada",
              description: `${files.length} arquivo(s) pronto(s) para envio.`
            })
          }
        }
        mediaInput.click()
        break
      
      case "camera":
        toast({
          title: "Câmera",
          description: "Funcionalidade em desenvolvimento."
        })
        break
      
      case "audio":
        setShowAudioRecorder(true)
        break
      
      case "contact":
        toast({
          title: "Compartilhar contato",
          description: "Funcionalidade em desenvolvimento."
        })
        break
      
      case "poll":
        toast({
          title: "Criar enquete",
          description: "Funcionalidade em desenvolvimento."
        })
        break
      
      case "event":
        toast({
          title: "Criar evento",
          description: "Funcionalidade em desenvolvimento."
        })
        break
      
      case "sticker":
        toast({
          title: "Nova figurinha",
          description: "Funcionalidade em desenvolvimento."
        })
        break
      
      default:
        break
    }
  }

  const handleArchiveConversation = () => {
    toast({
      title: "Conversa arquivada",
      description: "A conversa foi movida para o arquivo."
    })
  }

  const handleStarConversation = () => {
    toast({
      title: "Conversa marcada",
      description: "Adicionada aos favoritos."
    })
  }

  const handleFlagConversation = () => {
    toast({
      title: "Conversa sinalizada",
      description: "Marcada para revisão."
    })
  }

  const handleMarkAsUnread = () => {
    toast({
      title: "Marcado como não lido",
      description: "A conversa foi marcada como não lida e aparecerá na lista."
    })
  }

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/10">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Selecione uma conversa
          </h3>
          <p className="text-muted-foreground">
            Escolha uma conversa da lista para começar a responder
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header da conversa */}
      <Card className="rounded-none border-0 border-b border-border">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  M
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="font-semibold text-foreground">Maria Silva</h3>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <MessageSquare className="h-3 w-3 text-success" />
                  <span>WhatsApp</span>
                  <span>•</span>
                  <span>Online há 2 min</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Internal Note Button */}
              <InternalNoteButton 
                contactId={conversationId} 
                className="h-8 w-8"
                onNoteAddedToConversation={handleAddInternalNoteToConversation}
              />
              
              {/* Call Buttons */}
              {!isCallActive ? (
                <Button variant="outline" size="sm" onClick={handleStartCall}>
                  <Phone className="h-4 w-4 mr-2" />
                  Ligar
                </Button>
              ) : (
                <Button variant="destructive" size="sm" onClick={handleEndCall}>
                  <PhoneOff className="h-4 w-4 mr-2" />
                  {callDuration}
                </Button>
              )}

              {/* Video Call Button */}
              {!isVideoCallActive ? (
                <Button variant="outline" size="sm" onClick={handleStartVideoCall}>
                  <Video className="h-4 w-4 mr-2" />
                  Vídeo
                </Button>
              ) : (
                <Button variant="destructive" size="sm" onClick={handleEndVideoCall}>
                  <VideoOff className="h-4 w-4 mr-2" />
                  {callDuration}
                </Button>
              )}
              
              {/* Transfer Button */}
              <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Transferir
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Transferir Conversa</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Tipo de Transferência</Label>
                      <RadioGroup
                        value={transferType}
                        onValueChange={setTransferType}
                        className="flex flex-col space-y-2 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="team" id="team" />
                          <Label htmlFor="team" className="flex items-center cursor-pointer">
                            <Users className="h-4 w-4 mr-2" />
                            Transferir para equipe
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="user" id="user" />
                          <Label htmlFor="user" className="flex items-center cursor-pointer">
                            <User className="h-4 w-4 mr-2" />
                            Transferir para usuário
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {transferType === "team" && (
                      <div>
                        <Label>Equipe de Destino</Label>
                        <Select value={transferTeam} onValueChange={setTransferTeam}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma equipe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vendas">Vendas</SelectItem>
                            <SelectItem value="suporte">Suporte Técnico</SelectItem>
                            <SelectItem value="financeiro">Financeiro</SelectItem>
                            <SelectItem value="gerencia">Gerência</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {transferType === "user" && (
                      <div>
                        <Label>Usuário de Destino</Label>
                        <Select value={transferUser} onValueChange={setTransferUser}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um usuário" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableUsers.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                <div className="flex items-center space-x-2">
                                  <div className="relative">
                                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                      <span className="text-primary-foreground text-xs font-medium">
                                        {user.avatar}
                                      </span>
                                    </div>
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-card ${
                                      user.status === "online" ? "bg-success" : 
                                      user.status === "busy" ? "bg-warning" : "bg-muted"
                                    }`} />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm">{user.name}</span>
                                    <span className="text-xs text-muted-foreground">{user.team}</span>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div>
                      <Label>Nota de Transferência (opcional)</Label>
                      <Textarea
                        value={transferNote}
                        onChange={(e) => setTransferNote(e.target.value)}
                        placeholder="Contexto ou observações para a transferência..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsTransferModalOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleTransfer}>
                        Transferir
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              {/* More Options Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleStarConversation}>
                    <Star className="h-4 w-4 mr-2" />
                    Marcar como favorito
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleFlagConversation}>
                    <Flag className="h-4 w-4 mr-2" />
                    Sinalizar conversa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleMarkAsUnread}>
                    <Mail className="h-4 w-4 mr-2" />
                    Marcar como não lido
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar participante
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar conversa
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleArchiveConversation}>
                    <Archive className="h-4 w-4 mr-2" />
                    Arquivar conversa
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir conversa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Área de mensagens com seções diárias */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {sortedDateKeys.map((dateKey) => (
          <div key={dateKey} className="space-y-4">
            {/* Cabeçalho da seção diária */}
            <div className="flex items-center justify-center">
              <div className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full border border-gray-600">
                {formatDateSection(dateKey)}
              </div>
            </div>
            
            {/* Mensagens do dia */}
            <div className="space-y-4">
              {groupedMessages[dateKey].map((msg) => (
                <div key={msg.id}>
                  {/* Nota interna - Design especial */}
                  {msg.isInternalNote ? (
                    <div className="flex justify-center">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-[80%] shadow-sm">
                        <div className="flex items-start space-x-2">
                          <StickyNote className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium text-yellow-800">
                                Nota Interna
                              </span>
                              <span className="text-xs text-yellow-600">
                                {msg.authorName}
                              </span>
                            </div>
                            <p className="text-sm text-yellow-800 bg-yellow-100/50 rounded px-2 py-1">
                              {msg.content}
                            </p>
                            <div className="flex justify-end mt-1">
                              <span className="text-xs text-yellow-600">
                                {msg.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Mensagens normais */
                    <div className={`flex ${msg.isFromUser ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.isFromUser
                            ? "bg-chat-bubble-user text-chat-bubble-user-foreground"
                            : "bg-chat-bubble-other text-chat-bubble-other-foreground border border-border"
                        }`}
                      >
                        {/* Renderizar AudioPlayer ou texto baseado no tipo da mensagem */}
                        {msg.type === "audio" && msg.audioUrl ? (
                          <div className="space-y-2">
                            <AudioPlayer 
                              audioUrl={msg.audioUrl}
                              isOwnMessage={msg.isFromUser}
                              duration={msg.audioDuration}
                            />
                            {msg.content && (
                              <p className="text-sm mt-2">{msg.content}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm">{msg.content}</p>
                        )}
                        
                        <div className="flex items-center justify-end space-x-1 mt-2">
                          <span className={`text-xs ${
                            msg.isFromUser ? "text-chat-bubble-user-foreground/70" : "text-muted-foreground"
                          }`}>
                            {msg.timestamp}
                          </span>
                          
                          {msg.isFromUser && msg.status && (
                            <div className="text-chat-bubble-user-foreground/70">
                              {msg.status === "sent" && <Check className="h-3 w-3" />}
                              {msg.status === "delivered" && <CheckCheck className="h-3 w-3" />}
                              {msg.status === "read" && <CheckCheck className="h-3 w-3 text-primary-light" />}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Respostas rápidas */}
      <div className="px-4 py-2 border-t border-border bg-muted/10">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Bot className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          {quickReplies.map((reply, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs whitespace-nowrap"
              onClick={() => setMessage(reply)}
            >
              {reply}
            </Button>
          ))}
          
          <QuickRepliesModal
            trigger={
              <Button variant="outline" size="sm" className="text-xs whitespace-nowrap">
                + Mais
              </Button>
            }
            onSelectReply={handleQuickReplySelect}
          />
          
          {/* Modal separado para acionamento por barra */}
          <QuickRepliesModal
            open={isQuickRepliesModalOpen}
            onOpenChange={setIsQuickRepliesModalOpen}
            onSelectReply={handleQuickReplySelect}
          />
        </div>
      </div>

      {/* Audio Recorder */}
      {showAudioRecorder && (
        <div className="p-4 border-t border-border bg-card">
          <AudioRecorder
            onSendAudio={handleSendAudio}
            onCancel={handleCancelAudio}
          />
        </div>
      )}

      {/* Input de mensagem */}
      {!showAudioRecorder && (
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 border border-border rounded-lg p-2 focus-within:ring-2 focus-within:ring-primary">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1"
                  onClick={() => setIsAttachmentModalOpen(true)}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <Input
                  value={message}
                  onChange={handleMessageChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem... (use / para respostas rápidas)"
                  className="border-0 focus:ring-0 focus-visible:ring-0 p-0"
                />
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1"
                  onClick={() => setShowAudioRecorder(true)}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  size="sm"
                  className="p-1"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Sugestão de IA com Base de Conhecimento */}
              <div className="mt-2 space-y-2">
                <div className="p-2 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start space-x-2">
                    <Bot className="h-4 w-4 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-primary font-medium">Sugestão da IA:</p>
                      <p className="text-xs text-primary/80 mt-1">
                        "Baseado no histórico, sugiro oferecer desconto de 10% para finalizar a venda."
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary p-1">
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {/* Knowledge Indicator Example */}
                <KnowledgeIndicator
                  usedKnowledge={true}
                  knowledgeSources={["Política de Desconto", "Tabela de Preços", "FAQ - Vendas"]}
                  confidence={0.92}
                  onViewSources={() => {
                    toast({
                      title: "Fontes da resposta",
                      description: "Consulte a aba Base de Conhecimento para mais detalhes."
                    })
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Anexos */}
      <AttachmentModal
        open={isAttachmentModalOpen}
        onOpenChange={setIsAttachmentModalOpen}
        onSelectAttachment={handleAttachmentSelect}
      />
    </div>
  )
}
