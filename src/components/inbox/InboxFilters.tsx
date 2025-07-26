import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { DateRange } from "react-day-picker"
import { 
  Search, 
  MessageSquare, 
  Instagram, 
  Facebook, 
  Mail,
  Users,
  Circle,
  User,
  Star,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  CalendarIcon,
  X
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

const users = [
  { name: "João Silva", count: 3, team: "Vendas", status: "online", avatar: "J" },
  { name: "Ana Costa", count: 2, team: "Suporte", status: "online", avatar: "A" },
  { name: "Pedro Santos", count: 4, team: "Vendas", status: "busy", avatar: "P" },
  { name: "Maria Oliveira", count: 1, team: "Financeiro", status: "online", avatar: "M" },
  { name: "Carlos Lima", count: 2, team: "Suporte", status: "offline", avatar: "C" },
]

const readStatus = [
  { name: "Não lidas", icon: EyeOff, count: 4, color: "bg-warning" },
  { name: "Lidas", icon: Eye, count: 8, color: "bg-success" },
]

const favorites = [
  { name: "Favoritos", icon: Star, count: 2, color: "bg-yellow-500" },
]

const resolutionStatus = [
  { name: "Ativas", icon: AlertCircle, count: 2, color: "bg-primary" },
  { name: "Resolvidas", icon: CheckCircle, count: 2, color: "bg-success" },
]

const statuses = [
  { name: "Online", count: 12, color: "bg-success" },
  { name: "Ocupado", count: 3, color: "bg-warning" },
  { name: "Offline", count: 2, color: "bg-muted" },
]

export function InboxFilters() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const clearDateRange = () => {
    setDateRange(undefined)
  }

  const formatDateRange = () => {
    if (!dateRange?.from) return "Selecionar período"
    if (!dateRange?.to) return format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
    return `${format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}`
  }

  return (
    <div className="w-80 bg-card border-r border-border p-4 space-y-4 h-full overflow-y-auto">
      {/* Filtro de Período - Hub Central */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Período de Filtro
            </div>
            {(dateRange?.from || dateRange?.to) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={clearDateRange}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange?.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDateRange()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                locale={ptBR}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          {(dateRange?.from || dateRange?.to) && (
            <p className="text-xs text-muted-foreground mt-2">
              Este período será aplicado a todos os filtros abaixo
            </p>
          )}
        </CardContent>
      </Card>

      <Separator />

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

      {/* Filtro por Usuário */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <User className="h-4 w-4 mr-2" />
            Usuários
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {users.map((user) => {
            const getStatusColor = (status: string) => {
              switch (status) {
                case "online": return "bg-success"
                case "busy": return "bg-warning"
                case "offline": return "bg-muted"
                default: return "bg-muted"
              }
            }

            return (
              <Button
                key={user.name}
                variant="ghost"
                className="w-full justify-between p-2 h-auto"
              >
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-xs font-medium">
                        {user.avatar}
                      </span>
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${getStatusColor(user.status)} border border-card`} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.team}</span>
                  </div>
                </div>
                {user.count > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {user.count}
                  </Badge>
                )}
              </Button>
            )
          })}
        </CardContent>
      </Card>

      <Separator />

      {/* Status de Leitura */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            Status de Leitura
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {readStatus.map((status) => (
            <Button
              key={status.name}
              variant="ghost"
              className="w-full justify-between p-2 h-auto"
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${status.color} mr-3`} />
                <status.icon className="h-4 w-4 mr-2" />
                <span className="text-sm">{status.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {status.count}
              </Badge>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Separator />

      {/* Favoritos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Star className="h-4 w-4 mr-2" />
            Favoritos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {favorites.map((fav) => (
            <Button
              key={fav.name}
              variant="ghost"
              className="w-full justify-between p-2 h-auto"
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${fav.color} mr-3`} />
                <fav.icon className="h-4 w-4 mr-2" />
                <span className="text-sm">{fav.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {fav.count}
              </Badge>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Separator />

      {/* Status de Resolução */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Status de Resolução
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {resolutionStatus.map((status) => (
            <Button
              key={status.name}
              variant="ghost"
              className="w-full justify-between p-2 h-auto"
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${status.color} mr-3`} />
                <status.icon className="h-4 w-4 mr-2" />
                <span className="text-sm">{status.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {status.count}
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