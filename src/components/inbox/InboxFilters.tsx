import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  MessageSquare, 
  Instagram, 
  Facebook, 
  Mail,
  Users,
  Circle
} from "lucide-react"

const channels = [
  { name: "WhatsApp", icon: MessageSquare, count: 8, color: "bg-success" },
  { name: "Instagram", icon: Instagram, count: 3, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
  { name: "Facebook", icon: Facebook, count: 1, color: "bg-blue-500" },
  { name: "E-mail", icon: Mail, count: 0, color: "bg-gray-500" },
]

const teams = [
  { name: "Vendas", count: 5, color: "bg-primary" },
  { name: "Suporte", count: 4, color: "bg-accent" },
  { name: "Financeiro", count: 3, color: "bg-warning" },
]

const statuses = [
  { name: "Online", count: 12, color: "bg-success" },
  { name: "Ocupado", count: 3, color: "bg-warning" },
  { name: "Offline", count: 2, color: "bg-muted" },
]

export function InboxFilters() {
  return (
    <div className="w-80 bg-card border-r border-border p-4 space-y-4 h-full overflow-y-auto">
      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar conversas..." 
          className="pl-10"
        />
      </div>

      {/* Filtros por Canal */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Canais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {channels.map((channel) => (
            <Button
              key={channel.name}
              variant="ghost"
              className="w-full justify-between p-2 h-auto"
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${channel.color} mr-3`} />
                <channel.icon className="h-4 w-4 mr-2" />
                <span className="text-sm">{channel.name}</span>
              </div>
              {channel.count > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {channel.count}
                </Badge>
              )}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Separator />

      {/* Equipes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Equipes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {teams.map((team) => (
            <Button
              key={team.name}
              variant="ghost"
              className="w-full justify-between p-2 h-auto"
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${team.color} mr-3`} />
                <span className="text-sm">{team.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {team.count}
              </Badge>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Separator />

      {/* Status dos Atendentes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Circle className="h-4 w-4 mr-2" />
            Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {statuses.map((status) => (
            <Button
              key={status.name}
              variant="ghost"
              className="w-full justify-between p-2 h-auto"
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${status.color} mr-3`} />
                <span className="text-sm">{status.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {status.count}
              </Badge>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}