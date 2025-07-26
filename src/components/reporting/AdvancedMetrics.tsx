import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  MessageSquare, 
  Star,
  Users,
  Calendar,
  DollarSign,
  Activity,
  CheckCircle,
  AlertCircle,
  UserCheck,
  BarChart3
} from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: any
  subtitle?: string
  progress?: number
  comparison?: string
}

function MetricCard({ title, value, change, changeType, icon: Icon, subtitle, progress, comparison }: MetricCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <Badge 
            variant={changeType === "positive" ? "default" : changeType === "negative" ? "destructive" : "secondary"}
            className="text-xs"
          >
            {changeType === "positive" && <TrendingUp className="h-3 w-3 mr-1" />}
            {changeType === "negative" && <TrendingDown className="h-3 w-3 mr-1" />}
            {change}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mb-2">{subtitle}</p>
          )}
          {progress !== undefined && (
            <Progress value={progress} className="h-2 mb-2" />
          )}
          {comparison && (
            <p className="text-xs text-muted-foreground">{comparison}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function AdvancedMetrics() {
  const primaryMetrics = [
    {
      title: "Conversas Hoje",
      value: "47",
      change: "+12%",
      changeType: "positive" as const,
      icon: MessageSquare,
      subtitle: "vs. ontem: 42",
      comparison: "Meta diária: 50 conversas"
    },
    {
      title: "Tempo Médio de Resposta",
      value: "2m 34s",
      change: "-8%",
      changeType: "positive" as const,
      icon: Clock,
      subtitle: "SLA: < 5 minutos",
      progress: 75,
      comparison: "Melhor da semana"
    },
    {
      title: "Taxa de Resolução",
      value: "89%",
      change: "+5%",
      changeType: "positive" as const,
      icon: Target,
      subtitle: "42 de 47 conversas",
      progress: 89,
      comparison: "Meta: 85%"
    },
    {
      title: "Satisfação do Cliente",
      value: "4.7/5",
      change: "+0.2",
      changeType: "positive" as const,
      icon: Star,
      subtitle: "Baseado em 38 avaliações",
      progress: 94,
      comparison: "Acima da média"
    }
  ]

  const secondaryMetrics = [
    {
      title: "Primeiro Contato",
      value: "78%",
      change: "+3%",
      changeType: "positive" as const,
      icon: CheckCircle,
      subtitle: "Resolvidas na primeira interação"
    },
    {
      title: "Tempo de Espera",
      value: "45s",
      change: "-12s",
      changeType: "positive" as const,
      icon: Clock,
      subtitle: "Tempo médio na fila"
    },
    {
      title: "Agentes Online",
      value: "8/12",
      change: "67%",
      changeType: "neutral" as const,
      icon: Users,
      subtitle: "Disponibilidade da equipe"
    },
    {
      title: "Escalações",
      value: "5",
      change: "-2",
      changeType: "positive" as const,
      icon: AlertCircle,
      subtitle: "Para supervisores hoje"
    },
    {
      title: "Reativações",
      value: "12",
      change: "+4",
      changeType: "negative" as const,
      icon: Activity,
      subtitle: "Clientes que retornaram"
    },
    {
      title: "Taxa de Abandono",
      value: "8%",
      change: "-2%",
      changeType: "positive" as const,
      icon: UserCheck,
      subtitle: "Conversas não atendidas"
    }
  ]

  const productivityMetrics = [
    {
      title: "Conversas/Agente/Hora",
      value: "3.2",
      change: "+0.4",
      changeType: "positive" as const,
      icon: BarChart3,
      subtitle: "Produtividade média"
    },
    {
      title: "Tempo de Sessão",
      value: "6h 15m",
      change: "+30m",
      changeType: "positive" as const,
      icon: Calendar,
      subtitle: "Tempo médio ativo"
    },
    {
      title: "Revenue per Conversation",
      value: "R$ 185",
      change: "+R$ 25",
      changeType: "positive" as const,
      icon: DollarSign,
      subtitle: "Receita por conversa"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Métricas Principais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {primaryMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>

      {/* Métricas Operacionais */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Métricas Operacionais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {secondaryMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>

      {/* Métricas de Produtividade */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Produtividade & Receita</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {productivityMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>
    </div>
  )
}