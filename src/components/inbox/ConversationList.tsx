import { useState, useEffect, useRef, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { 
  MessageSquare, 
  Pin, 
  Clock,
  Instagram,
  Facebook,
  Mail,
  Star,
  Filter,
  CheckCircle,
  RotateCcw,
  Loader2
} from "lucide-react"

// Função para gerar conversas mock para simulação
const generateMockConversation = (id: number) => {
  const names = [
    "Maria Silva", "João Santos", "Ana Costa", "Pedro Oliveira", "Carla Lima",
    "Rafael Santos", "Lucia Fernandes", "Carlos Alberto", "Fernanda Souza", "Marcos Pereira",
    "Juliana Castro", "Roberto Alves", "Patrícia Moreira", "Antonio Silva", "Camila Rodrigues",
    "Eduardo Santos", "Melissa Costa", "Felipe Araújo", "Gabriela Lima", "Thiago Martins"
  ]
  
  const channels = ["whatsapp", "instagram", "facebook", "email"]
  const statuses = ["pending", "answered", "closed"]
  const messages = [
    "Olá, tenho interesse nos seus produtos",
    "Gostaria de saber mais informações",
    "Quando vocês podem fazer uma apresentação?",
    "Obrigado pelo atendimento!",
    "Preciso de ajuda com meu pedido",
    "Qual o prazo de entrega?",
    "Vocês fazem entrega na minha região?",
    "Muito obrigado pela atenção",
    "Estou interessado em fazer uma compra",
    "Podem me enviar o catálogo?"
  ]
  
  const randomName = names[Math.floor(Math.random() * names.length)]
  const randomChannel = channels[Math.floor(Math.random() * channels.length)]
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
  const randomMessage = messages[Math.floor(Math.random() * messages.length)]
  const randomUnread = Math.floor(Math.random() * 5)
  const randomHour = String(Math.floor(Math.random() * 24)).padStart(2, '0')
  const randomMinute = String(Math.floor(Math.random() * 60)).padStart(2, '0')
  
  return {
    id,
    name: randomName,
    channel: randomChannel,
    lastMessage: randomMessage,
    timestamp: `${randomHour}:${randomMinute}`,
    unreadCount: randomUnread,
    isPinned: Math.random() > 0.9,
    isFavorite: Math.random() > 0.8,
    isResolved: Math.random() > 0.7,
    avatar: null,
    status: randomStatus
  }
}

// Mock data inicial para conversas
const initialConversations = [
  {
    id: 1,
    name: "Maria Silva",
    channel: "whatsapp",
    lastMessage: "Oi, gostaria de saber mais sobre os produtos...",
    timestamp: "10:30",
    unreadCount: 3,
    isPinned: true,
    isFavorite: true,
    isResolved: false,
    avatar: null,
    status: "pending"
  },
  {
    id: 2,
    name: "João Santos",
    channel: "instagram",
    lastMessage: "Obrigado pelo atendimento!",
    timestamp: "10:15",
    unreadCount: 0,
    isPinned: false,
    isFavorite: false,
    isResolved: true,
    avatar: null,
    status: "answered"
  },
  {
    id: 3,
    name: "Empresa XYZ",
    channel: "email",
    lastMessage: "Quando vocês podem fazer a apresentação?",
    timestamp: "09:45",
    unreadCount: 1,
    isPinned: false,
    isFavorite: true,
    isResolved: false,
    avatar: null,
    status: "pending"
  },
  {
    id: 4,
    name: "Ana Costa",
    channel: "facebook",
    lastMessage: "Perfeito! Vou aguardar o retorno.",
    timestamp: "09:30",
    unreadCount: 0,
    isPinned: false,
    isFavorite: false,
    isResolved: true,
    avatar: null,
    status: "closed"
  },
  // Gerar mais conversas iniciais
  ...Array.from({ length: 16 }, (_, i) => generateMockConversation(i + 5))
]

type FilterType = "all" | "unread" | "favorites" | "active" | "resolved"

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "whatsapp":
      return <MessageSquare className="h-3 w-3 text-success" />
    case "instagram":
      return <Instagram className="h-3 w-3 text-purple-500" />
    case "facebook":
      return <Facebook className="h-3 w-3 text-blue-500" />
    case "email":
      return <Mail className="h-3 w-3 text-gray-500" />
    default:
      return <MessageSquare className="h-3 w-3" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-warning"
    case "answered":
      return "bg-primary"
    case "closed":
      return "bg-success"
    default:
      return "bg-muted"
  }
}

interface ConversationListProps {
  selectedConversation: number | null
  onSelectConversation: (id: number) => void
}

export function ConversationList({ selectedConversation, onSelectConversation }: ConversationListProps) {
  const [conversations, setConversations] = useState(initialConversations)
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<HTMLDivElement>(null)

  // Simular carregamento de mais conversas
  const loadMoreConversations = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const conversationsPerPage = 20
    const startId = conversations.length + 1
    const newConversations = Array.from(
      { length: conversationsPerPage }, 
      (_, i) => generateMockConversation(startId + i)
    )

    setConversations(prev => [...prev, ...newConversations])
    setPage(prev => prev + 1)
    
    // Simular limite de páginas (máximo 10 páginas = 200 conversas)
    if (page >= 10) {
      setHasMore(false)
    }
    
    setLoading(false)
  }, [loading, hasMore, conversations.length, page])

  // Intersection Observer para detectar quando chegou ao final da lista
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !loading) {
          loadMoreConversations()
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [loadMoreConversations, hasMore, loading])

  const toggleFavorite = (id: number, event: React.MouseEvent) => {
    event.stopPropagation()
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id ? { ...conv, isFavorite: !conv.isFavorite } : conv
      )
    )
  }

  const toggleResolved = (id: number, event: React.MouseEvent) => {
    event.stopPropagation()
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id ? { ...conv, isResolved: !conv.isResolved } : conv
      )
    )
  }

  const filteredConversations = conversations.filter(conv => {
    switch (activeFilter) {
      case "unread":
        return conv.unreadCount > 0
      case "favorites":
        return conv.isFavorite
      case "active":
        return !conv.isResolved
      case "resolved":
        return conv.isResolved
      default:
        return true
    }
  })

  const filterCounts = {
    all: conversations.length,
    unread: conversations.filter(c => c.unreadCount > 0).length,
    favorites: conversations.filter(c => c.isFavorite).length,
    active: conversations.filter(c => !c.isResolved).length,
    resolved: conversations.filter(c => c.isResolved).length
  }

  return (
    <div className="w-80 bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Conversas</h2>
          <Badge variant="secondary" className="text-xs">
            {filteredConversations.length}
          </Badge>
        </div>
        
        {/* Filtros Rápidos - Linha 1 */}
        <div className="flex gap-1 mt-3">
          <Button
            variant={activeFilter === "all" ? "default" : "ghost"}
            size="sm"
            className="text-xs h-7"
            onClick={() => setActiveFilter("all")}
          >
            Todas ({filterCounts.all})
          </Button>
          <Button
            variant={activeFilter === "active" ? "default" : "ghost"}
            size="sm"
            className="text-xs h-7"
            onClick={() => setActiveFilter("active")}
          >
            Ativas ({filterCounts.active})
          </Button>
          <Button
            variant={activeFilter === "resolved" ? "default" : "ghost"}
            size="sm"
            className="text-xs h-7"
            onClick={() => setActiveFilter("resolved")}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Resolvidas ({filterCounts.resolved})
          </Button>
        </div>
        
        {/* Filtros Rápidos - Linha 2 */}
        <div className="flex gap-1 mt-2">
          <Button
            variant={activeFilter === "unread" ? "default" : "ghost"}
            size="sm"
            className="text-xs h-7"
            onClick={() => setActiveFilter("unread")}
          >
            Não lidas ({filterCounts.unread})
          </Button>
          <Button
            variant={activeFilter === "favorites" ? "default" : "ghost"}
            size="sm"
            className="text-xs h-7"
            onClick={() => setActiveFilter("favorites")}
          >
            <Star className="h-3 w-3 mr-1" />
            Favoritos ({filterCounts.favorites})
          </Button>
        </div>
      </div>

      {/* Lista de Conversas */}
      <div className="h-full overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <Card
            key={conversation.id}
            className={cn(
              "m-2 cursor-pointer transition-all border-border hover:shadow-md",
              selectedConversation === conversation.id && "ring-2 ring-primary border-primary"
            )}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="p-3">
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {conversation.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Status do canal */}
                  <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-0.5 border border-border">
                    {getChannelIcon(conversation.channel)}
                  </div>
                </div>

                {/* Conteúdo da conversa */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-sm text-foreground truncate">
                        {conversation.name}
                      </h3>
                      {conversation.isPinned && (
                        <Pin className="h-3 w-3 text-primary fill-current" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto hover:bg-transparent"
                        onClick={(e) => toggleFavorite(conversation.id, e)}
                      >
                        <Star 
                          className={cn(
                            "h-3 w-3 transition-colors",
                            conversation.isFavorite 
                              ? "fill-yellow-400 text-yellow-400" 
                              : "text-muted-foreground hover:text-yellow-400"
                          )} 
                        />
                      </Button>
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {conversation.timestamp}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {conversation.lastMessage}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    {/* Status da conversa e botão resolver */}
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(conversation.status)}`} />
                        <span className="text-xs text-muted-foreground capitalize">
                          {conversation.status === "pending" ? "Pendente" : 
                           conversation.status === "answered" ? "Respondida" : "Finalizada"}
                        </span>
                      </div>
                      
                      {/* Botão Resolver/Reativar */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto hover:bg-transparent"
                        onClick={(e) => toggleResolved(conversation.id, e)}
                        title={conversation.isResolved ? "Reativar conversa" : "Marcar como resolvida"}
                      >
                        {conversation.isResolved ? (
                          <RotateCcw className="h-3 w-3 text-muted-foreground hover:text-primary" />
                        ) : (
                          <CheckCircle className="h-3 w-3 text-muted-foreground hover:text-success" />
                        )}
                      </Button>
                    </div>

                    {/* Contador de não lidas */}
                    {conversation.unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        {/* Loading indicator e observador para scroll infinito */}
        {loading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-muted-foreground">Carregando mais conversas...</span>
          </div>
        )}
        
        {/* Elemento observado para detectar final da lista */}
        <div ref={observerRef} className="h-4" />
        
        {/* Indicador quando não há mais conversas */}
        {!hasMore && conversations.length > 20 && (
          <div className="flex items-center justify-center p-4">
            <span className="text-xs text-muted-foreground">
              Todas as conversas foram carregadas ({conversations.length} total)
            </span>
          </div>
        )}
      </div>

      {/* Footer com informações de performance */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          {filteredConversations.length} de {conversations.length} conversas
          {loading && " • Carregando..."}
        </div>
      </div>
    </div>
  )
}