import { useState } from "react"
import { QuickReplies } from "./QuickReplies"
import { AISuggestion } from "./AISuggestion"
import { MessageInput } from "./MessageInput"
import { KnowledgeBaseIndicator } from "./KnowledgeBaseIndicator"

interface MessageComposerProps {
  onSendMessage: (message: string) => void
  onAttachFile: () => void
  onShowQuickReplies: () => void
  isRecording: boolean
  onToggleRecording: () => void
  disabled?: boolean
}

export function MessageComposer({
  onSendMessage,
  onAttachFile,
  onShowQuickReplies,
  isRecording,
  onToggleRecording,
  disabled = false
}: MessageComposerProps) {
  const [message, setMessage] = useState("")
  const [showAISuggestion, setShowAISuggestion] = useState(true)
  const [knowledgeBaseActive, setKnowledgeBaseActive] = useState(true)

  // Simulando uma sugestão da IA
  const aiSuggestion = "Baseado no histórico, sugiro oferecer desconto de 10% para finalizar a venda."

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleQuickReplySelect = (reply: string) => {
    onSendMessage(reply)
  }

  const handleUseSuggestion = (suggestion: string) => {
    setMessage(suggestion)
    setShowAISuggestion(false)
  }

  const handleDismissSuggestion = () => {
    setShowAISuggestion(false)
  }

  return (
    <div className="border-t border-border/50 bg-background">
      {/* Respostas Rápidas */}
      <QuickReplies 
        onSelectReply={handleQuickReplySelect}
        onShowMoreReplies={onShowQuickReplies}
      />

      {/* Sugestão da IA */}
      {showAISuggestion && (
        <AISuggestion
          suggestion={aiSuggestion}
          onUseSuggestion={handleUseSuggestion}
          onDismiss={handleDismissSuggestion}
        />
      )}

      {/* Indicador da Base de Conhecimento */}
      <div className="px-3 pb-2">
        <KnowledgeBaseIndicator
          isActive={knowledgeBaseActive}
          hasKnowledge={true}
          knowledgeCount={12}
          onClick={() => setKnowledgeBaseActive(!knowledgeBaseActive)}
        />
      </div>

      {/* Campo de Input */}
      <MessageInput
        value={message}
        onChange={setMessage}
        onSendMessage={handleSendMessage}
        onAttachFile={onAttachFile}
        isRecording={isRecording}
        onToggleRecording={onToggleRecording}
        disabled={disabled}
      />
    </div>
  )
}