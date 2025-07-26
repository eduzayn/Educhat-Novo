import { useState } from "react"
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
  RotateCcw
} from "lucide-react"

// Mock data para conversas
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
    status: "pending" // pending, answered, closed
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
      </div>

      {/* Footer com ações */}
      <div className="p-4 border-t border-border">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
        >
          Carregar mais conversas
        </Button>
      </div>
    </div>
  )
}