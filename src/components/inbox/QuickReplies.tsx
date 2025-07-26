import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface QuickRepliesProps {
  onSelectReply: (reply: string) => void
  onShowMoreReplies: () => void
}

const defaultQuickReplies = [
  "Obrigado pelo contato!",
  "Vou verificar isso para você",
  "Posso ajudar com mais alguma coisa?",
  "Aguarde um momento, por favor"
]

export function QuickReplies({ onSelectReply, onShowMoreReplies }: QuickRepliesProps) {
  return (
    <div className="flex flex-wrap gap-2 p-3 border-b border-border/50">
      {defaultQuickReplies.map((reply, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSelectReply(reply)}
          className="text-xs h-8 px-3 bg-background hover:bg-primary/5 border-border/60"
        >
          {reply}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={onShowMoreReplies}
        className="text-xs h-8 px-3 bg-background hover:bg-primary/5 border-border/60"
      >
        <Plus className="h-3 w-3 mr-1" />
        Mais
      </Button>
    </div>
  )
}