import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  Calendar as CalendarIcon, 
  Filter, 
  X, 
  Users, 
  MessageSquare, 
  Building,
  Tag
} from "lucide-react"

interface FilterState {
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  teams: string[]
  users: string[]
  channels: string[]
  statuses: string[]
  tags: string[]
}

interface ReportFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
}

const teams = [
  { id: "vendas", name: "Vendas", count: 45 },
  { id: "suporte", name: "Suporte", count: 32 },
  { id: "pos-vendas", name: "Pós-Vendas", count: 28 },
  { id: "financeiro", name: "Financeiro", count: 15 }
]

const users = [
  { id: "joao", name: "João Silva", team: "Vendas", avatar: "J" },
  { id: "ana", name: "Ana Costa", team: "Suporte", avatar: "A" },
  { id: "pedro", name: "Pedro Santos", team: "Vendas", avatar: "P" },
  { id: "maria", name: "Maria Oliveira", team: "Pós-Vendas", avatar: "M" },
  { id: "carlos", name: "Carlos Lima", team: "Suporte", avatar: "C" },
  { id: "laura", name: "Laura Santos", team: "Financeiro", avatar: "L" }
]

const channels = [
  { id: "whatsapp", name: "WhatsApp", count: 28, color: "bg-green-500" },
  { id: "instagram", name: "Instagram", count: 12, color: "bg-pink-500" },
  { id: "email", name: "E-mail", count: 5, color: "bg-blue-500" },
  { id: "facebook", name: "Facebook", count: 2, color: "bg-blue-600" },
  { id: "chat", name: "Chat Web", count: 8, color: "bg-purple-500" }
]

const statuses = [
  { id: "resolvido", name: "Resolvido", count: 78 },
  { id: "pendente", name: "Pendente", count: 12 },
  { id: "em-andamento", name: "Em Andamento", count: 25 },
  { id: "cancelado", name: "Cancelado", count: 3 }
]

const tags = [
  { id: "urgente", name: "Urgente", count: 8 },
  { id: "vip", name: "VIP", count: 15 },
  { id: "primeira-vez", name: "Primeira Vez", count: 22 },
  { id: "reclamacao", name: "Reclamação", count: 6 },
  { id: "duvida", name: "Dúvida", count: 35 },
  { id: "cotacao", name: "Cotação", count: 18 }
]

export function ReportFilters({ filters, onFiltersChange, onClearFilters }: ReportFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateFilters = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const toggleArrayFilter = (key: 'teams' | 'users' | 'channels' | 'statuses' | 'tags', value: string) => {
    const currentArray = filters[key]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    
    updateFilters(key, newArray)
  }

  const hasActiveFilters = 
    filters.dateRange.from || 
    filters.teams.length > 0 || 
    filters.users.length > 0 || 
    filters.channels.length > 0 || 
    filters.statuses.length > 0 || 
    filters.tags.length > 0

  const activeFiltersCount = 
    (filters.dateRange.from ? 1 : 0) +
    filters.teams.length +
    filters.users.length +
    filters.channels.length +
    filters.statuses.length +
    filters.tags.length

  return (
    <div className="flex items-center space-x-2">
      {/* Seletor de Período Rápido */}
      <Select onValueChange={(value) => {
        const today = new Date()
        const from = new Date()
        
        switch (value) {
          case "hoje":
            updateFilters("dateRange", { from: today, to: today })
            break
          case "ontem":
            from.setDate(today.getDate() - 1)
            updateFilters("dateRange", { from, to: from })
            break
          case "7dias":
            from.setDate(today.getDate() - 7)
            updateFilters("dateRange", { from, to: today })
            break
          case "30dias":
            from.setDate(today.getDate() - 30)
            updateFilters("dateRange", { from, to: today })
            break
          case "mes":
            from.setDate(1)
            updateFilters("dateRange", { from, to: today })
            break
        }
      }}>
        <SelectTrigger className="w-[140px]">
          <CalendarIcon className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hoje">Hoje</SelectItem>
          <SelectItem value="ontem">Ontem</SelectItem>
          <SelectItem value="7dias">Últimos 7 dias</SelectItem>
          <SelectItem value="30dias">Últimos 30 dias</SelectItem>
          <SelectItem value="mes">Este mês</SelectItem>
        </SelectContent>
      </Select>

      {/* Seletor de Data Personalizado */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-start text-left">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filters.dateRange.from ? (
              filters.dateRange.to ? (
                <>
                  {format(filters.dateRange.from, "dd/MM/yy", { locale: ptBR })} -{" "}
                  {format(filters.dateRange.to, "dd/MM/yy", { locale: ptBR })}
                </>
              ) : (
                format(filters.dateRange.from, "dd/MM/yy", { locale: ptBR })
              )
            ) : (
              "Data personalizada"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={filters.dateRange.from}
            selected={{
              from: filters.dateRange.from,
              to: filters.dateRange.to
            }}
            onSelect={(range) => updateFilters("dateRange", range || { from: undefined, to: undefined })}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>

      {/* Filtros Avançados */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[600px] p-0" align="start">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Filtros Avançados</h4>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={onClearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Limpar
                </Button>
              )}
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Equipes */}
            <div>
              <div className="flex items-center mb-3">
                <Users className="h-4 w-4 mr-2" />
                <Label className="font-medium">Equipes</Label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {teams.map((team) => (
                  <div key={team.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`team-${team.id}`}
                      checked={filters.teams.includes(team.id)}
                      onCheckedChange={() => toggleArrayFilter('teams', team.id)}
                    />
                    <Label htmlFor={`team-${team.id}`} className="text-sm flex-1">
                      {team.name}
                    </Label>
                    <Badge variant="secondary" className="text-xs">
                      {team.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Usuários */}
            <div>
              <div className="flex items-center mb-3">
                <Users className="h-4 w-4 mr-2" />
                <Label className="font-medium">Usuários</Label>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={filters.users.includes(user.id)}
                      onCheckedChange={() => toggleArrayFilter('users', user.id)}
                    />
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-xs font-medium">
                        {user.avatar}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={`user-${user.id}`} className="text-sm truncate">
                        {user.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">{user.team}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Canais */}
            <div>
              <div className="flex items-center mb-3">
                <MessageSquare className="h-4 w-4 mr-2" />
                <Label className="font-medium">Canais</Label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {channels.map((channel) => (
                  <div key={channel.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`channel-${channel.id}`}
                      checked={filters.channels.includes(channel.id)}
                      onCheckedChange={() => toggleArrayFilter('channels', channel.id)}
                    />
                    <div className={`w-3 h-3 rounded-full ${channel.color}`} />
                    <Label htmlFor={`channel-${channel.id}`} className="text-sm flex-1">
                      {channel.name}
                    </Label>
                    <Badge variant="secondary" className="text-xs">
                      {channel.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div>
              <div className="flex items-center mb-3">
                <Building className="h-4 w-4 mr-2" />
                <Label className="font-medium">Status</Label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {statuses.map((status) => (
                  <div key={status.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status.id}`}
                      checked={filters.statuses.includes(status.id)}
                      onCheckedChange={() => toggleArrayFilter('statuses', status.id)}
                    />
                    <Label htmlFor={`status-${status.id}`} className="text-sm flex-1">
                      {status.name}
                    </Label>
                    <Badge variant="secondary" className="text-xs">
                      {status.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Tags */}
            <div>
              <div className="flex items-center mb-3">
                <Tag className="h-4 w-4 mr-2" />
                <Label className="font-medium">Tags</Label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag.id}`}
                      checked={filters.tags.includes(tag.id)}
                      onCheckedChange={() => toggleArrayFilter('tags', tag.id)}
                    />
                    <Label htmlFor={`tag-${tag.id}`} className="text-sm flex-1">
                      {tag.name}
                    </Label>
                    <Badge variant="secondary" className="text-xs">
                      {tag.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t">
            <Button onClick={() => setIsOpen(false)} className="w-full">
              Aplicar Filtros
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <X className="h-4 w-4 mr-1" />
          Limpar todos
        </Button>
      )}
    </div>
  )
}