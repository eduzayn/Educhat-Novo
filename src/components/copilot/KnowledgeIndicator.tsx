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
    <Card className="mt-2 border-primary/20 bg-primary/5">
      <CardContent className="p-3">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="p-1.5 rounded-full bg-primary/20">
              <Brain className="h-4 w-4 text-primary" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                <Sparkles className="h-3 w-3 mr-1" />
                Resposta com Base de Conhecimento
              </Badge>
              
              <Badge 
                variant="outline" 
                className={`text-xs ${getConfidenceColor(confidence)}`}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                {getConfidenceText(confidence)}
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground mb-2">
              Resposta baseada em {knowledgeSources.length} fonte(s) da base de conhecimento:
            </p>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {knowledgeSources.slice(0, 3).map((source, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  {source.length > 25 ? `${source.substring(0, 25)}...` : source}
                </Badge>
              ))}
              
              {knowledgeSources.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{knowledgeSources.length - 3} mais
                </Badge>
              )}
            </div>
            
            {onViewSources && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onViewSources}
                className="h-6 px-2 text-xs text-primary hover:text-primary-dark"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Ver fontes completas
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}