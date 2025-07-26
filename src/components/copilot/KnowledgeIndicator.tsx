import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Brain, 
  BookOpen, 
  FileText, 
  Globe,
  ExternalLink,
  CheckCircle,
  Sparkles
} from "lucide-react"

interface KnowledgeIndicatorProps {
  usedKnowledge: boolean
  knowledgeSources?: string[]
  confidence: number
  onViewSources?: () => void
}

export function KnowledgeIndicator({ 
  usedKnowledge, 
  knowledgeSources = [], 
  confidence,
  onViewSources 
}: KnowledgeIndicatorProps) {
  if (!usedKnowledge || knowledgeSources.length === 0) {
    return null
  }

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.9) return "text-success"
    if (conf >= 0.7) return "text-warning" 
    return "text-muted-foreground"
  }

  const getConfidenceText = (conf: number) => {
    if (conf >= 0.9) return "Alta Confiança"
    if (conf >= 0.7) return "Média Confiança"
    return "Baixa Confiança"
  }

  return (
    <div className="flex items-center space-x-1 mt-1">
      <Badge variant="outline" className="text-xs h-5 px-2 bg-primary/5 text-primary border-primary/30">
        <Brain className="h-3 w-3 mr-1" />
        Base de Conhecimento
      </Badge>
    </div>
  )
}