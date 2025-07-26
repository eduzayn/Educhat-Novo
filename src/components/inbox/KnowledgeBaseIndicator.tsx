import { Button } from "@/components/ui/button"
import { Database, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface KnowledgeBaseIndicatorProps {
  isActive: boolean
  hasKnowledge: boolean
  knowledgeCount?: number
  onClick?: () => void
  className?: string
}

export function KnowledgeBaseIndicator({ 
  isActive, 
  hasKnowledge, 
  knowledgeCount = 0,
  onClick,
  className 
}: KnowledgeBaseIndicatorProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(
        "h-8 px-3 text-xs border transition-all duration-200",
        isActive && hasKnowledge && "bg-primary/10 border-primary/30 text-primary",
        isActive && !hasKnowledge && "bg-orange-500/10 border-orange-500/30 text-orange-600",
        !isActive && "bg-background border-border/60 text-muted-foreground hover:bg-accent",
        className
      )}
    >
      <Database className="h-3 w-3 mr-1.5" />
      Base de Conhecimento
      {isActive && (
        hasKnowledge ? (
          <CheckCircle className="h-3 w-3 ml-1.5 text-green-500" />
        ) : (
          <AlertCircle className="h-3 w-3 ml-1.5 text-orange-500" />
        )
      )}
      {knowledgeCount > 0 && (
        <span className="ml-1 px-1.5 py-0.5 bg-primary/20 text-primary rounded-full text-xs font-medium">
          {knowledgeCount}
        </span>
      )}
    </Button>
  )
}