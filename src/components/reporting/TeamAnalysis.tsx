import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Users, 
  Clock, 
  Star, 
  MessageSquare, 
  Target,
  TrendingUp,
  TrendingDown,
  Trophy,
  Award,
  Activity
} from "lucide-react"

interface TeamMember {
  id: string
  name: string
  avatar: string
  team: string
  status: "online" | "busy" | "offline"
  conversations: number
  avgResponse: string
  satisfaction: number
  resolutionRate: number
  productivity: number
  workHours: string
  revenue: number
  ranking: number
}

const teamMembers: TeamMember[] = [
  {
    id: "joao",
    name: "João Silva",
    avatar: "J",
    team: "Vendas",
    status: "online",
    conversations: 15,
    avgResponse: "1m 45s",
    satisfaction: 4.8,
    resolutionRate: 92,
    productivity: 95,
    workHours: "8h 20m",
    revenue: 2850,
    ranking: 1
  },
  {
    id: "ana",
    name: "Ana Costa",
    avatar: "A",
    team: "Suporte",
    status: "online",
    conversations: 12,
    avgResponse: "2m 12s",
    satisfaction: 4.6,
    resolutionRate: 88,
    productivity: 87,
    workHours: "7h 45m",
    revenue: 1920,
    ranking: 2
  },
  {
    id: "pedro",
    name: "Pedro Santos",
    avatar: "P",
    team: "Vendas",
    status: "busy",
    conversations: 10,
    avgResponse: "3m 01s",
    satisfaction: 4.5,
    resolutionRate: 85,
    productivity: 82,
    workHours: "6h 30m",
    revenue: 1650,
    ranking: 3
  },
  {
    id: "maria",
    name: "Maria Oliveira",
    avatar: "M",
    team: "Pós-Vendas",
    status: "offline",
    conversations: 8,
    avgResponse: "2m 45s",
    satisfaction: 4.7,
    resolutionRate: 90,
    productivity: 78,
    workHours: "5h 15m",
    revenue: 1280,
    ranking: 4
  },
  {
    id: "carlos",
    name: "Carlos Lima",
    avatar: "C",
    team: "Suporte",
    status: "online",
    conversations: 14,
    avgResponse: "2m 30s",
    satisfaction: 4.4,
    resolutionRate: 86,
    productivity: 89,
    workHours: "8h 00m",
    revenue: 2100,
    ranking: 5
  },
  {
    id: "laura",
    name: "Laura Santos",
    avatar: "L",
    team: "Financeiro",
    status: "online",
    conversations: 6,
    avgResponse: "4m 15s",
    satisfaction: 4.3,
    resolutionRate: 83,
    productivity: 72,
    workHours: "6h 45m",
    revenue: 950,
    ranking: 6
  }
]

const teamStats = [
  {
    team: "Vendas",
    members: 3,
    avgSatisfaction: 4.6,
    totalConversations: 25,
    totalRevenue: 4500,
    avgResolutionRate: 88,
    color: "bg-green-500"
  },
  {
    team: "Suporte",
    members: 2,
    avgSatisfaction: 4.5,
    totalConversations: 26,
    totalRevenue: 4020,
    avgResolutionRate: 87,
    color: "bg-blue-500"
  },
  {
    team: "Pós-Vendas",
    members: 1,
    avgSatisfaction: 4.7,
    totalConversations: 8,
    totalRevenue: 1280,
    avgResolutionRate: 90,
    color: "bg-purple-500"
  },
  {
    team: "Financeiro",
    members: 1,
    avgSatisfaction: 4.3,
    totalConversations: 6,
    totalRevenue: 950,
    avgResolutionRate: 83,
    color: "bg-orange-500"
  }
]

function getStatusBadge(status: string) {
  switch (status) {
    case "online":
      return <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>
    case "busy":
      return <Badge variant="secondary">Ocupado</Badge>
    case "offline":
      return <Badge variant="outline">Offline</Badge>
    default:
      return <Badge variant="outline">Offline</Badge>
  }
}

function getRankingIcon(ranking: number) {
  switch (ranking) {
    case 1:
      return <Trophy className="h-4 w-4 text-yellow-500" />
    case 2:
      return <Award className="h-4 w-4 text-gray-400" />
    case 3:
      return <Award className="h-4 w-4 text-amber-600" />
    default:
      return <span className="text-sm font-bold text-muted-foreground">#{ranking}</span>
  }
}

export function TeamAnalysis() {
  return (
    <div className="space-y-6">
      {/* Visão Geral das Equipes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Desempenho por Equipe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamStats.map((team, index) => (
              <Card key={index} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${team.color}`} />
                      <h4 className="font-medium">{team.team}</h4>
                    </div>
                    <Badge variant="secondary">{team.members} pessoas</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Conversas</span>
                      <span className="font-medium">{team.totalConversations}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Receita</span>
                      <span className="font-medium text-green-600">
                        R$ {team.totalRevenue.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Satisfação</span>
                      <span className="font-medium">{team.avgSatisfaction}/5</span>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Taxa de Resolução</span>
                        <span>{team.avgResolutionRate}%</span>
                      </div>
                      <Progress value={team.avgResolutionRate} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ranking Individual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Ranking Individual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <Card key={member.id} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getRankingIcon(member.ranking)}
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.team}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(member.status)}
                      <Badge variant="outline" className="flex items-center">
                        <Activity className="h-3 w-3 mr-1" />
                        {member.productivity}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-bold">{member.conversations}</p>
                      <p className="text-xs text-muted-foreground">Conversas</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-bold">{member.avgResponse}</p>
                      <p className="text-xs text-muted-foreground">Resp. Média</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-bold text-yellow-600">{member.satisfaction}</p>
                      <p className="text-xs text-muted-foreground">Satisfação</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-bold">{member.resolutionRate}%</p>
                      <p className="text-xs text-muted-foreground">Resolução</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-bold">{member.workHours}</p>
                      <p className="text-xs text-muted-foreground">Tempo Ativo</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        {member.revenue > 2000 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm font-bold text-green-600">
                        R$ {member.revenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Receita</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}