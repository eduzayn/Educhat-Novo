import { useState } from "react"
import { QuickRepliesModal } from "@/components/modals/QuickRepliesModal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Send, 
  Paperclip, 
  Mic, 
  Bot, 
  MoreVertical,
  Phone,
  MessageSquare,
  Clock,
  Check,
  CheckCheck,
  ArrowRight
} from "lucide-react"

interface Message {
  id: number
  content: string
  timestamp: string
  isFromUser: boolean
  isFromBot?: boolean
  status?: "sent" | "delivered" | "read"
}

// Mock data para mensagens
const messages: Message[] = [
  {
    id: 1,
    content: "Olá! Gostaria de saber mais sobre os produtos de vocês.",
    timestamp: "10:25",
    isFromUser: false
  },
  {
    id: 2,
    content: "Olá Maria! Claro, ficarei feliz em ajudar. Qual tipo de produto você tem interesse?",
    timestamp: "10:26",
    isFromUser: true,
    status: "read"
  },
  {
    id: 3,
    content: "Estou procurando algo para automação residencial. Vocês trabalham com isso?",
    timestamp: "10:28",
    isFromUser: false
  },
  {
    id: 4,
    content: "Sim! Temos uma linha completa de automação. Posso enviar nosso catálogo para você dar uma olhada?",
    timestamp: "10:29",
    isFromUser: true,
    status: "delivered"
  },
  {
    id: 5,
    content: "Oi, gostaria de saber mais sobre os produtos...",
    timestamp: "10:30",
    isFromUser: false
  },
]

const quickReplies = [
  "Obrigado pelo contato!",
  "Vou verificar isso para você",
  "Posso ajudar com mais alguma coisa?",
  "Aguarde um momento, por favor"
]

interface ChatWindowProps {
  conversationId: number | null
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)

  const handleSendMessage = () => {
    if (message.trim()) {
      // Aqui seria enviada a mensagem
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
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
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Ligar
              </Button>
              
              <Button variant="outline" size="sm">
                <ArrowRight className="h-4 w-4 mr-2" />
                Transferir
              </Button>
              
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isFromUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.isFromUser
                  ? "bg-chat-bubble-user text-chat-bubble-user-foreground"
                  : "bg-chat-bubble-other text-chat-bubble-other-foreground border border-border"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              
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
            onSelectReply={(reply) => setMessage(reply.content)}
          />
        </div>
      </div>

      {/* Input de mensagem */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <div className="flex items-center space-x-2 border border-border rounded-lg p-2 focus-within:ring-2 focus-within:ring-primary">
              <Button
                variant="ghost"
                size="sm"
                className="p-1"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="border-0 focus:ring-0 focus-visible:ring-0 p-0"
              />
              
              <Button
                variant="ghost"
                size="sm"
                className={`p-1 ${isRecording ? "text-destructive" : ""}`}
                onClick={() => setIsRecording(!isRecording)}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Sugestão de IA */}
            <div className="mt-2 p-2 bg-primary-light rounded-lg border border-primary/20">
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
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}