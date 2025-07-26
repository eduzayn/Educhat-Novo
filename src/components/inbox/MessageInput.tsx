import { useState, useRef, KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Mic, Send, Paperclip, MicOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSendMessage: () => void
  onAttachFile: () => void
  isRecording: boolean
  onToggleRecording: () => void
  placeholder?: string
  disabled?: boolean
}

export function MessageInput({
  value,
  onChange,
  onSendMessage,
  onAttachFile,
  isRecording,
  onToggleRecording,
  placeholder = "Digite sua mensagem... (use / para respostas rápidas)",
  disabled = false
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !disabled) {
        onSendMessage()
      }
    }
  }

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    adjustTextareaHeight()
  }

  return (
    <div className="flex items-end gap-2 p-4 border-t border-border/50 bg-background">
      {/* Botão de anexo */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onAttachFile}
        className="flex-shrink-0 h-10 w-10 hover:bg-accent"
        disabled={disabled}
      >
        <Paperclip className="h-4 w-4" />
      </Button>

      {/* Campo de texto */}
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "min-h-[40px] max-h-[120px] resize-none rounded-lg border-border/60 bg-background focus:border-primary/60 transition-all",
            "pr-12" // Espaço para o botão de envio
          )}
          rows={1}
        />
        
        {/* Botão de envio dentro do textarea */}
        {value.trim() && (
          <Button
            onClick={onSendMessage}
            disabled={disabled}
            size="sm"
            className="absolute right-2 bottom-2 h-8 w-8 p-0"
          >
            <Send className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Botão de gravação */}
      <Button
        variant={isRecording ? "destructive" : "ghost"}
        size="icon"
        onClick={onToggleRecording}
        className={cn(
          "flex-shrink-0 h-10 w-10",
          isRecording 
            ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground animate-pulse" 
            : "hover:bg-accent"
        )}
        disabled={disabled}
      >
        {isRecording ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}