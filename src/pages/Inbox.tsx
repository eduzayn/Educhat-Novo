import { useState } from "react"
import { InboxFilters } from "@/components/inbox/InboxFilters"
import { ConversationList } from "@/components/inbox/ConversationList"
import { ChatWindow } from "@/components/inbox/ChatWindow"
import { ContactDetails } from "@/components/inbox/ContactDetails"

export default function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null)

  return (
    <div className="h-screen flex bg-background">
      {/* Coluna 1: Filtros e Equipes */}
      <InboxFilters />
      
      {/* Coluna 2: Lista de Conversas */}
      <ConversationList 
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
      />
      
      {/* Coluna 3: Chat da Conversa */}
      <ChatWindow conversationId={selectedConversation} />
      
      {/* Coluna 4: Detalhes do Contato */}
      <ContactDetails />
    </div>
  )
}