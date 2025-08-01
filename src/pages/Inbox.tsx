import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MobileHeader } from "@/components/inbox/MobileHeader"
import { InboxFilters } from "@/components/inbox/InboxFilters"
import { ConversationList } from "@/components/inbox/ConversationList"
import { ChatWindow } from "@/components/inbox/ChatWindow"
import { ContactDetails } from "@/components/inbox/ContactDetails"

export default function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null)
  const [onNoteAddedToConversation, setOnNoteAddedToConversation] = useState<((note: { content: string, authorName: string, authorId?: string }) => void) | undefined>(undefined)
  const [isMobileView, setIsMobileView] = useState(false)
  const [currentView, setCurrentView] = useState<'filters' | 'conversations' | 'chat' | 'details'>('conversations')

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Função para navegar entre views no mobile
  const handleMobileNavigation = (view: 'filters' | 'conversations' | 'chat' | 'details') => {
    setCurrentView(view)
  }

  // No mobile, mostrar apenas a view atual
  if (isMobileView) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {/* Mobile Header */}
        <MobileHeader
          currentView={currentView}
          onViewChange={handleMobileNavigation}
          selectedConversation={selectedConversation}
          conversationName="Maria Silva"
          unreadCount={3}
        />

        {/* Mobile Content */}
        <div className="flex-1 overflow-hidden">
          {currentView === 'filters' && <InboxFilters />}
          
          {currentView === 'conversations' && (
            <ConversationList 
              selectedConversation={selectedConversation}
              onSelectConversation={(id) => {
                setSelectedConversation(id)
                handleMobileNavigation('chat')
              }}
            />
          )}
          
          {currentView === 'chat' && selectedConversation && (
            <ChatWindow 
              conversationId={selectedConversation} 
              onNoteCallbackReady={setOnNoteAddedToConversation}
            />
          )}
          
          {currentView === 'details' && selectedConversation && (
            <ContactDetails onNoteAddedToConversation={onNoteAddedToConversation} />
          )}
        </div>
      </div>
    )
  }

  // Desktop layout original
  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Coluna 1: Filtros e Equipes */}
      <InboxFilters />
      
      {/* Coluna 2: Lista de Conversas */}
      <ConversationList 
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
      />
      
      {/* Coluna 3: Chat da Conversa */}
      <ChatWindow 
        conversationId={selectedConversation} 
        onNoteCallbackReady={setOnNoteAddedToConversation}
      />
      
      {/* Coluna 4: Detalhes do Contato */}
      <ContactDetails onNoteAddedToConversation={onNoteAddedToConversation} />
    </div>
  )
}