import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Filter, MessageSquare, User, Settings } from "lucide-react"

interface MobileHeaderProps {
  currentView: 'filters' | 'conversations' | 'chat' | 'details'
  onViewChange: (view: 'filters' | 'conversations' | 'chat' | 'details') => void
  selectedConversation: number | null
  conversationName?: string
  unreadCount?: number
}

export function MobileHeader({ 
  currentView, 
  onViewChange, 
  selectedConversation, 
  conversationName = "Maria Silva",
  unreadCount = 0 
}: MobileHeaderProps) {
  
  const getTitle = () => {
    switch (currentView) {
      case 'filters':
        return 'Filtros'
      case 'conversations':
        return 'Conversas'
      case 'chat':
        return conversationName
      case 'details':
        return 'Detalhes do Contato'
      default:
        return 'EduChat'
    }
  }

  const showBackButton = currentView !== 'conversations'

  return (
    <div className="flex items-center justify-between p-3 bg-card border-b border-border shadow-sm">
      <div className="flex items-center space-x-3">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('conversations')}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        
        <div className="flex flex-col">
          <h1 className="font-semibold text-foreground text-base">{getTitle()}</h1>
          {currentView === 'chat' && selectedConversation && (
            <span className="text-xs text-muted-foreground">WhatsApp • Online</span>
          )}
        </div>
        
        {currentView === 'conversations' && unreadCount > 0 && (
          <Badge variant="destructive" className="text-xs">
            {unreadCount}
          </Badge>
        )}
      </div>

      <div className="flex items-center space-x-1">
        {currentView === 'conversations' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('filters')}
            className="p-2"
          >
            <Filter className="h-4 w-4" />
          </Button>
        )}
        
        {currentView === 'chat' && selectedConversation && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('details')}
            className="p-2"
          >
            <User className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}