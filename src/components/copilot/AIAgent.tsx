import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import { 
  Bot, 
  Brain, 
  Users, 
  MessageCircle, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Activity,
  Target,
  Zap
} from "lucide-react"

interface AIAgentProps {
  isActive: boolean
  onToggle: (active: boolean) => void
}

interface AgentConfig {
  sdr: {
    active: boolean
    confidence: number
    responses: number
    conversions: number
  }
  closer: {
    active: boolean
    confidence: number
    responses: number
    conversions: number
  }
  support: {
    active: boolean
    confidence: number
    responses: number
    resolutions: number
  }
}

interface AIMetrics {
  totalMessages: number
  aiResponses: number
  humanTransfers: number
  avgResponseTime: string
  satisfactionRate: number
  activeChats: number
}

export function AIAgent({ isActive, onToggle }: AIAgentProps) {
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    sdr: {
      active: true,
      confidence: 87,
      responses: 24,
      conversions: 8
    },
    closer: {
      active: true,
      confidence: 92,
      responses: 12,
      conversions: 9
    },
    support: {
      active: true,
      confidence: 89,
      responses: 31,
      resolutions: 28
    }
  })

  const [metrics, setMetrics] = useState<AIMetrics>({
    totalMessages: 156,
    aiResponses: 142,
    humanTransfers: 14,
    avgResponseTime: "1.2s",
    satisfactionRate: 94,
    activeChats: 8
  })

  const [currentActivity, setCurrentActivity] = useState([
    { id: 1, type: "sdr", message: "Qualificando lead sobre automação residencial", contact: "Maria Silva", time: "agora" },
    { id: 2, type: "support", message: "Resolvendo dúvida sobre instalação", contact: "João Santos", time: "há 2min" },
    { id: 3, type: "closer", message: "Negociando proposta de R$ 15.000", contact: "Ana Costa", time: "há 5min" }
  ])

  const handleToggleAgent = (type: keyof AgentConfig) => {
    setAgentConfig(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        active: !prev[type].active
      }
    }))
    
    toast({
      title: `Agente ${type.toUpperCase()} ${agentConfig[type].active ? 'desativado' : 'ativado'}`,
      description: `O agente de ${type} foi ${agentConfig[type].active ? 'pausado' : 'reativado'}.`
    })
  }

  // Simulate real-time updates
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        aiResponses: prev.aiResponses + Math.floor(Math.random() * 3),
        activeChats: Math.max(0, prev.activeChats + (Math.random() > 0.5 ? 1 : -1))
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [isActive])

  const aiEfficiencyRate = Math.round((metrics.aiResponses / metrics.totalMessages) * 100)

  return (
    <div className="space-y-6">
      {/* Header de Controle Principal */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${isActive ? 'bg-success/20' : 'bg-muted'}`}>
                <Bot className={`h-6 w-6 ${isActive ? 'text-success' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <CardTitle className="text-xl">Agente Virtual ZAIA</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Sistema de atendimento automatizado integrado
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">
                  {isActive ? 'ATIVO' : 'PAUSADO'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {metrics.activeChats} chats ativos
                </div>
              </div>
              <Switch 
                checked={isActive}
                onCheckedChange={onToggle}
                className="data-[state=checked]:bg-success"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Métricas em Tempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de IA</p>
                <p className="text-2xl font-bold text-foreground">{aiEfficiencyRate}%</p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <Progress value={aiEfficiencyRate} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tempo Médio</p>
                <p className="text-2xl font-bold text-foreground">{metrics.avgResponseTime}</p>
              </div>
              <Clock className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Satisfação</p>
                <p className="text-2xl font-bold text-foreground">{metrics.satisfactionRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transferências</p>
                <p className="text-2xl font-bold text-foreground">{metrics.humanTransfers}</p>
              </div>
              <Users className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuração dos Agentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SDR Agent */}
        <Card className={`${agentConfig.sdr.active ? 'ring-2 ring-primary/20' : ''}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Agente SDR</CardTitle>
              </div>
              <Switch 
                checked={agentConfig.sdr.active}
                onCheckedChange={() => handleToggleAgent('sdr')}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Qualificação e geração de leads
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Confiança:</span>
              <Badge variant="outline" className="text-primary">
                {agentConfig.sdr.confidence}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Respostas:</span>
              <span className="text-sm font-medium">{agentConfig.sdr.responses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Conversões:</span>
              <span className="text-sm font-medium text-success">{agentConfig.sdr.conversions}</span>
            </div>
          </CardContent>
        </Card>

        {/* Closer Agent */}
        <Card className={`${agentConfig.closer.active ? 'ring-2 ring-primary/20' : ''}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <CardTitle className="text-lg">Agente Closer</CardTitle>
              </div>
              <Switch 
                checked={agentConfig.closer.active}
                onCheckedChange={() => handleToggleAgent('closer')}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Fechamento de vendas
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Confiança:</span>
              <Badge variant="outline" className="text-success">
                {agentConfig.closer.confidence}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Respostas:</span>
              <span className="text-sm font-medium">{agentConfig.closer.responses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Conversões:</span>
              <span className="text-sm font-medium text-success">{agentConfig.closer.conversions}</span>
            </div>
          </CardContent>
        </Card>

        {/* Support Agent */}
        <Card className={`${agentConfig.support.active ? 'ring-2 ring-primary/20' : ''}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">Agente Suporte</CardTitle>
              </div>
              <Switch 
                checked={agentConfig.support.active}
                onCheckedChange={() => handleToggleAgent('support')}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Suporte a alunos e clientes
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Confiança:</span>
              <Badge variant="outline" className="text-accent">
                {agentConfig.support.confidence}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Respostas:</span>
              <span className="text-sm font-medium">{agentConfig.support.responses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Resoluções:</span>
              <span className="text-sm font-medium text-success">{agentConfig.support.resolutions}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atividade em Tempo Real */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Atividade em Tempo Real</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-muted/10 rounded-lg">
                <div className={`p-2 rounded-full ${
                  activity.type === 'sdr' ? 'bg-primary/20 text-primary' :
                  activity.type === 'closer' ? 'bg-success/20 text-success' :
                  'bg-accent/20 text-accent'
                }`}>
                  {activity.type === 'sdr' && <Target className="h-4 w-4" />}
                  {activity.type === 'closer' && <TrendingUp className="h-4 w-4" />}
                  {activity.type === 'support' && <MessageCircle className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.contact} • {activity.time}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.type.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}