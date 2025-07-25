import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Clock,
  Target,
  Download,
  Calendar,
  Filter
} from "lucide-react"

const metrics = [
  {
    title: "Conversas Hoje",
    value: "47",
    change: "+12%",
    changeType: "positive",
    icon: MessageSquare
  },
  {
    title: "Tempo Médio de Resposta",
    value: "2m 34s",
    change: "-8%",
    changeType: "positive",
    icon: Clock
  },
  {
    title: "Taxa de Resolução",
    value: "89%",
    change: "+5%",
    changeType: "positive",
    icon: Target
  },
  {
    title: "Satisfação do Cliente",
    value: "4.7/5",
    change: "+0.2",
    changeType: "positive",
    icon: TrendingUp
  }
]

const channelData = [
  { name: "WhatsApp", conversations: 28, percentage: 59 },
  { name: "Instagram", conversations: 12, percentage: 25 },
  { name: "E-mail", conversations: 5, percentage: 11 },
  { name: "Facebook", conversations: 2, percentage: 5 }
]

const teamPerformance = [
  {
    name: "João Silva",
    conversations: 15,
    avgResponse: "1m 45s",
    satisfaction: 4.8,
    status: "online"
  },
  {
    name: "Ana Costa",
    conversations: 12,
    avgResponse: "2m 12s",
    satisfaction: 4.6,
    status: "online"
  },
  {
    name: "Pedro Santos",
    conversations: 10,
    avgResponse: "3m 01s",
    satisfaction: 4.5,
    status: "busy"
  },
  {
    name: "Maria Oliveira",
    conversations: 8,
    avgResponse: "2m 45s",
    satisfaction: 4.7,
    status: "offline"
  }
]

export default function Reports() {
  return (
    <div className="h-screen bg-background overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                <BarChart3 className="h-6 w-6 mr-3" />
                Relatórios e BI
              </h1>
              <p className="text-muted-foreground mt-1">
                Acompanhe métricas e performance do atendimento
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Período
              </Button>
              
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              
              <Button className="bg-primary hover:bg-primary-hover">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="h-5 w-5 text-muted-foreground" />
                <Badge 
                  variant={metric.changeType === "positive" ? "default" : "destructive"}
                  className="text-xs"
                >
                  {metric.change}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversas por Canal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conversas por Canal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {channelData.map((channel, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{channel.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {channel.conversations} conversas
                  </span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${channel.percentage}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{channel.percentage}% do total</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance da Equipe */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Performance da Equipe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamPerformance.map((member, index) => (
              <Card key={index} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-sm font-medium">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{member.name}</h4>
                        <Badge 
                          variant={
                            member.status === "online" ? "default" :
                            member.status === "busy" ? "secondary" : "outline"
                          }
                          className="text-xs"
                        >
                          {member.status === "online" ? "Online" :
                           member.status === "busy" ? "Ocupado" : "Offline"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Conversas</p>
                      <p className="text-sm font-bold text-foreground">{member.conversations}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground">Resp. Média</p>
                      <p className="text-sm font-bold text-foreground">{member.avgResponse}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground">Satisfação</p>
                      <p className="text-sm font-bold text-accent">{member.satisfaction}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Gráfico de Conversas por Hora */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Volume de Conversas por Hora</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {Array.from({ length: 12 }, (_, i) => {
                const hour = 8 + i
                const height = Math.random() * 80 + 20
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-primary rounded-t-md transition-all hover:bg-primary-hover"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-muted-foreground mt-2">
                      {hour}h
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Semanal */}
      <div className="px-6 pb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo da Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, index) => (
                <div key={index} className="text-center p-4 bg-muted/10 rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-2">{day}</p>
                  <p className="text-2xl font-bold text-primary">
                    {Math.floor(Math.random() * 50) + 10}
                  </p>
                  <p className="text-xs text-muted-foreground">conversas</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}