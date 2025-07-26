import { Button } from "@/components/ui/button"
import { Lightbulb, X, Send } from "lucide-react"
import { useState } from "react"

interface AISuggestionProps {
  suggestion: string
  onUseSuggestion: (suggestion: string) => void
  onDismiss: () => void
}

export function AISuggestion({ suggestion, onUseSuggestion, onDismiss }: AISuggestionProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss()
  }

  return (
    <div className="mx-3 mb-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
      <div className="flex items-start gap-2">
        <div className="flex items-center gap-2 flex-1">
          <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-primary mb-1">Sugestão da IA:</p>
            <p className="text-sm text-muted-foreground">{suggestion}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onUseSuggestion(suggestion)}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <Send className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="h-8 w-8 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}