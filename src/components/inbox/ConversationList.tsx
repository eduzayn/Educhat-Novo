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
  Mail
} from "lucide-react"

// Mock data para conversas
const conversations = [
  {
    id: 1,
    name: "Maria Silva",
    channel: "whatsapp",
    lastMessage: "Oi, gostaria de saber mais sobre os produtos...",
    timestamp: "10:30",
    unreadCount: 3,
    isPinned: true,
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
    avatar: null,
    status: "closed"
  },
]

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
  return (
    <div className="w-80 bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Conversas</h2>
          <Badge variant="secondary" className="text-xs">
            {conversations.length}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {conversations.filter(c => c.unreadCount > 0).length} não lidas
        </p>
      </div>

      {/* Lista de Conversas */}
      <div className="h-full overflow-y-auto">
        {conversations.map((conversation) => (
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
                    {/* Status da conversa */}
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(conversation.status)}`} />
                      <span className="text-xs text-muted-foreground capitalize">
                        {conversation.status === "pending" ? "Pendente" : 
                         conversation.status === "answered" ? "Respondida" : "Finalizada"}
                      </span>
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