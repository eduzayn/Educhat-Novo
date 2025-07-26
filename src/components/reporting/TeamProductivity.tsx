import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import {
  Clock,
  MessageSquare,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Calendar,
  Filter,
  Download,
  ChevronDown,
  Info,
  X,
  Eye,
  Shield
} from "lucide-react"

interface ProductivityData {
  id: string
  name: string
  avatar: string
  date: string
  activeTime: string
  activeTimeMinutes: number
  totalTimeMinutes: number
  conversations: number
  messages: number
  efficiency: number
  channel: string
  status: 'ideal' | 'low' | 'inactive'
}

const mockProductivityData: ProductivityData[] = [
  {
    id: '1',
    name: 'João Silva',
    avatar: '/avatars/joao.jpg',
    date: '25/07/2024',
    activeTime: '3h42min',
    activeTimeMinutes: 222,
    totalTimeMinutes: 480,
    conversations: 22,
    messages: 176,
    efficiency: 85,
    channel: 'WhatsApp',
    status: 'ideal'
  },
  {
    id: '2',
    name: 'Ana Rocha',
    avatar: '/avatars/ana.jpg',
    date: '25/07/2024',
    activeTime: '1h12min',
    activeTimeMinutes: 72,
    totalTimeMinutes: 480,
    conversations: 8,
    messages: 71,
    efficiency: 42,
    channel: 'Instagram',
    status: 'low'
  },
  {
    id: '3',
    name: 'Carlos Mendes',
    avatar: '/avatars/carlos.jpg',
    date: '25/07/2024',
    activeTime: '6h15min',
    activeTimeMinutes: 375,
    totalTimeMinutes: 480,
    conversations: 34,
    messages: 298,
    efficiency: 92,
    channel: 'WhatsApp',
    status: 'ideal'
  },
  {
    id: '4',
    name: 'Maria Santos',
    avatar: '/avatars/maria.jpg',
    date: '25/07/2024',
    activeTime: '45min',
    activeTimeMinutes: 45,
    totalTimeMinutes: 480,
    conversations: 3,
    messages: 28,
    efficiency: 18,
    channel: 'Email',
    status: 'inactive'
  },
  {
    id: '5',
    name: 'Pedro Costa',
    avatar: '/avatars/pedro.jpg',
    date: '25/07/2024',
    activeTime: '4h28min',
    activeTimeMinutes: 268,
    totalTimeMinutes: 480,
    conversations: 28,
    messages: 215,
    efficiency: 88,
    channel: 'Facebook',
    status: 'ideal'
  }
]

export function TeamProductivity() {
  const [period, setPeriod] = useState('today')
  const [selectedUser, setSelectedUser] = useState('all')
  const [selectedChannel, setSelectedChannel] = useState('all')
  const [showInfo, setShowInfo] = useState(true)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ideal':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'low':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'inactive':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ideal':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Ideal</Badge>
      case 'low':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Baixa</Badge>
      case 'inactive':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">Inativo</Badge>
      default:
        return <Badge variant="outline">-</Badge>
    }
  }

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'WhatsApp':
        return 'bg-green-500'
      case 'Instagram':
        return 'bg-pink-500'
      case 'Facebook':
        return 'bg-blue-500'
      case 'Email':
        return 'bg-gray-500'
      default:
        return 'bg-muted'
    }
  }

  const filteredData = mockProductivityData.filter(item => {
    if (selectedUser !== 'all' && item.id !== selectedUser) return false
    if (selectedChannel !== 'all' && item.channel !== selectedChannel) return false
    return true
  })

  const totalActiveTime = filteredData.reduce((acc, item) => acc + item.activeTimeMinutes, 0)
  const totalConversations = filteredData.reduce((acc, item) => acc + item.conversations, 0)
  const totalMessages = filteredData.reduce((acc, item) => acc + item.messages, 0)
  const averageEfficiency = filteredData.reduce((acc, item) => acc + item.efficiency, 0) / filteredData.length

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h${mins.toString().padStart(2, '0')}min`
  }

  return (
    <div className="space-y-6">
      {/* Informações sobre o Sistema de Monitoramento */}
      {showInfo && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center text-blue-800">
                <Info className="h-4 w-4 mr-2" />
                Como funciona o monitoramento de produtividade
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                onClick={() => setShowInfo(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Activity className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Detecção de Atividade</p>
                    <p className="text-xs text-blue-600">
                      O sistema registra atividade através de cliques, digitação, envio de mensagens e navegação no sistema.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Tempo Ativo</p>
                    <p className="text-xs text-blue-600">
                      Contabiliza apenas períodos com interação real. Inatividade superior a 10 minutos pausa a contagem.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Cálculo de Eficiência</p>
                    <p className="text-xs text-blue-600">
                      Eficiência = (Tempo Ativo ÷ Tempo Total Online) × 100. Considera atendimentos e mensagens enviadas.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Privacidade</p>
                    <p className="text-xs text-blue-600">
                      Monitoramos apenas atividade no sistema EduChat. Dados são usados exclusivamente para gestão de produtividade.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center pt-2 border-t border-blue-200">
              <div className="flex items-center space-x-4 text-xs text-blue-600">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Ideal: 80%+ de eficiência</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span>Baixa: 40-79% de eficiência</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span>Inativo: &lt;40% de eficiência</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!showInfo && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInfo(true)}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Info className="h-4 w-4 mr-2" />
            Mostrar informações do sistema
          </Button>
        </div>
      )}
      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Tempo Total Ativo</p>
                <p className="text-2xl font-bold">{formatTime(totalActiveTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Total Atendimentos</p>
                <p className="text-2xl font-bold">{totalConversations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Total Mensagens</p>
                <p className="text-2xl font-bold">{totalMessages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Eficiência Média</p>
                <p className="text-2xl font-bold">{averageEfficiency.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Atendente</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os atendentes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os atendentes</SelectItem>
                  {mockProductivityData.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Canal</label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os canais" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os canais</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Produtividade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Produtividade da Equipe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Tempo Ativo</TableHead>
                  <TableHead>Atendimentos</TableHead>
                  <TableHead>Mensagens</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Eficiência</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            {getStatusIcon(user.status)}
                            <span className="ml-1">
                              {user.status === 'ideal' ? 'Ativo' : 
                               user.status === 'low' ? 'Baixa atividade' : 'Inativo'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.date}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{user.activeTime}</p>
                        <Progress 
                          value={(user.activeTimeMinutes / user.totalTimeMinutes) * 100} 
                          className="h-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                        {user.conversations}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                        {user.messages}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${getChannelColor(user.channel)}`}></div>
                        {user.channel}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{user.efficiency}%</span>
                        <Progress value={user.efficiency} className="h-2 w-16" />
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}