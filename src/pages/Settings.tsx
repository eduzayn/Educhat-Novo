import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useElegantToast } from "@/components/ui/elegant-toast"
import { 
  Settings as SettingsIcon, 
  User, 
  Users, 
  MessageSquare, 
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  Plus,
  Edit,
  Trash2,
  X,
  QrCode,
  Wifi,
  WifiOff,
  Loader2,
  UserPlus,
  Eye,
  Search,
  Filter,
  Mail,
  Phone,
  Building,
  Crown,
  Ban
} from "lucide-react"

const teams = [
  { id: 1, name: "Vendas", members: 3, color: "bg-primary" },
  { id: 2, name: "Suporte", members: 2, color: "bg-accent" },
  { id: 3, name: "Financeiro", members: 1, color: "bg-warning" }
]

const whatsappChannels = [
  { id: 1, name: "WhatsApp Vendas", active: true, instanceId: "", instanceToken: "", clientToken: "" },
  { id: 2, name: "WhatsApp Suporte", active: true, instanceId: "", instanceToken: "", clientToken: "" },
  { id: 3, name: "WhatsApp Financeiro", active: false, instanceId: "", instanceToken: "", clientToken: "" },
  { id: 4, name: "WhatsApp Marketing", active: false, instanceId: "", instanceToken: "", clientToken: "" },
  { id: 5, name: "WhatsApp Geral", active: false, instanceId: "", instanceToken: "", clientToken: "" }
]

const otherChannels = [
  { id: 1, name: "Instagram", active: true, webhook: "https://api.educhat.com/webhook/instagram", token: "" },
  { id: 2, name: "Facebook", active: false, webhook: "", token: "" },
  { id: 3, name: "E-mail", active: true, webhook: "smtp.educhat.com:587", token: "" }
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile")
  const [teamsList, setTeamsList] = useState(teams)
  const [whatsappChannelsList, setWhatsappChannelsList] = useState(whatsappChannels)
  const [otherChannelsList, setOtherChannelsList] = useState(otherChannels)
  const [isNewTeamModalOpen, setIsNewTeamModalOpen] = useState(false)
  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false)
  const [isDeleteTeamDialogOpen, setIsDeleteTeamDialogOpen] = useState(false)
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false)
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null)
  const [isLoadingQrCode, setIsLoadingQrCode] = useState(false)
  const [selectedChannelForQr, setSelectedChannelForQr] = useState<any>(null)
  const [editingTeam, setEditingTeam] = useState<any>(null)
  const [deletingTeam, setDeletingTeam] = useState<any>(null)
  const [newTeamData, setNewTeamData] = useState({
    name: "",
    color: "bg-primary",
    members: 0
  })
  
  // Estados para gerenciamento de usuários
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users')
    return savedUsers ? JSON.parse(savedUsers) : [
      { id: 1, name: "João Silva", email: "admin@educhat.com", role: "admin", team: "administracao", active: true, phone: "(11) 99999-9999", department: "Administração" },
      { id: 2, name: "Ana Costa", email: "vendas@educhat.com", role: "vendas", team: "vendas", active: true, phone: "(11) 98888-8888", department: "Vendas" },
      { id: 3, name: "Pedro Santos", email: "suporte@educhat.com", role: "suporte", team: "suporte", active: true, phone: "(11) 97777-7777", department: "Suporte" }
    ]
  })
  const [searchUsers, setSearchUsers] = useState("")
  const [filterTeam, setFilterTeam] = useState("all")
  const [filterRole, setFilterRole] = useState("all")
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false)
  const [deletingUser, setDeletingUser] = useState<any>(null)
  
  const elegantToast = useElegantToast()

  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "users", label: "Usuários", icon: Users },
    { id: "teams", label: "Equipes", icon: Users },
    { id: "channels", label: "Canais", icon: MessageSquare },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "appearance", label: "Aparência", icon: Palette },
    { id: "security", label: "Segurança", icon: Shield }
  ]

  // Cores disponíveis para as equipes
  const teamColors = [
    { value: "bg-primary", label: "Azul", class: "bg-primary" },
    { value: "bg-accent", label: "Verde", class: "bg-accent" },
    { value: "bg-warning", label: "Amarelo", class: "bg-warning" },
    { value: "bg-destructive", label: "Vermelho", class: "bg-destructive" },
    { value: "bg-purple-500", label: "Roxo", class: "bg-purple-500" },
    { value: "bg-pink-500", label: "Rosa", class: "bg-pink-500" },
    { value: "bg-orange-500", label: "Laranja", class: "bg-orange-500" },
    { value: "bg-teal-500", label: "Turquesa", class: "bg-teal-500" }
  ]

  // Função para criar nova equipe
  const handleCreateTeam = () => {
    if (!newTeamData.name.trim()) {
      elegantToast.validationError("Nome da equipe é obrigatório")
      return
    }

    const newTeam = {
      id: Math.max(...teamsList.map(t => t.id)) + 1,
      name: newTeamData.name,
      color: newTeamData.color,
      members: 0
    }

    setTeamsList(prev => [...prev, newTeam])
    elegantToast.created(newTeamData.name, "Equipe")
    setIsNewTeamModalOpen(false)
    setNewTeamData({ name: "", color: "bg-primary", members: 0 })
  }

  // Função para editar equipe
  const handleEditTeam = (team: any) => {
    setEditingTeam({ ...team })
    setIsEditTeamModalOpen(true)
  }

  // Função para salvar edição da equipe
  const handleSaveEditTeam = () => {
    if (!editingTeam.name.trim()) {
      elegantToast.validationError("Nome da equipe é obrigatório")
      return
    }

    setTeamsList(prev => prev.map(team => 
      team.id === editingTeam.id ? editingTeam : team
    ))
    
    elegantToast.updated(editingTeam.name, "Equipe")
    setIsEditTeamModalOpen(false)
    setEditingTeam(null)
  }

  // Função para confirmar exclusão
  const handleDeleteTeam = (team: any) => {
    setDeletingTeam(team)
    setIsDeleteTeamDialogOpen(true)
  }

  // Função para excluir equipe
  const confirmDeleteTeam = () => {
    setTeamsList(prev => prev.filter(team => team.id !== deletingTeam.id))
    elegantToast.deleted(deletingTeam.name, "Equipe")
    setIsDeleteTeamDialogOpen(false)
    setDeletingTeam(null)
  }

  // Função para gerar QR Code Z-API
  const handleGenerateQrCode = async (channel: any) => {
    if (!channel.instanceId || !channel.instanceToken || !channel.clientToken) {
      elegantToast.validationError("Preencha todas as configurações da instância antes de gerar o QR Code")
      return
    }

    setSelectedChannelForQr(channel)
    setIsLoadingQrCode(true)
    setQrCodeImage(null)
    setIsQrCodeModalOpen(true)

    try {
      // Simular requisição para Z-API para pegar QR Code
      // URL real seria: https://api.z-api.io/instances/{instanceId}/token/{instanceToken}/qr-code/image
      const response = await fetch(`https://api.z-api.io/instances/${channel.instanceId}/token/${channel.instanceToken}/qr-code/image`, {
        method: 'GET',
        headers: {
          'Client-Token': channel.clientToken,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        // Converter bytes para blob e depois para URL
        const blob = await response.blob()
        const imageUrl = URL.createObjectURL(blob)
        setQrCodeImage(imageUrl)
        elegantToast.success("QR Code gerado com sucesso!")
      } else {
        throw new Error("Falha ao gerar QR Code")
      }
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error)
      
      // Mock do QR Code para demonstração
      // Em produção, remover esta parte e usar apenas a API real
      const mockQrCodeSvg = `data:image/svg+xml;base64,${btoa(`
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="white"/>
          <rect x="10" y="10" width="20" height="20" fill="black"/>
          <rect x="40" y="10" width="20" height="20" fill="black"/>
          <rect x="70" y="10" width="20" height="20" fill="black"/>
          <rect x="10" y="40" width="20" height="20" fill="black"/>
          <rect x="70" y="40" width="20" height="20" fill="black"/>
          <rect x="10" y="70" width="20" height="20" fill="black"/>
          <rect x="40" y="70" width="20" height="20" fill="black"/>
          <rect x="70" y="70" width="20" height="20" fill="black"/>
          <text x="100" y="100" font-family="Arial" font-size="12" fill="black">QR Code Mock</text>
          <text x="100" y="120" font-family="Arial" font-size="10" fill="gray">${channel.name}</text>
        </svg>
      `)}`
      
      setQrCodeImage(mockQrCodeSvg)
      elegantToast.info("QR Code simulado", "Em produção, conecte com a Z-API real")
    } finally {
      setIsLoadingQrCode(false)
    }
  }

  // Função para testar conexão da instância
  const handleTestConnection = async (channel: any) => {
    if (!channel.instanceId || !channel.instanceToken || !channel.clientToken) {
      elegantToast.validationError("Preencha todas as configurações antes de testar")
      return
    }

    try {
      // Simular teste de conexão com Z-API
      elegantToast.info("Testando conexão...", "Aguarde...")
      
      // Em produção, fazer requisição real para Z-API status endpoint
      setTimeout(() => {
        const isConnected = Math.random() > 0.3 // 70% chance de sucesso para demo
        if (isConnected) {
          elegantToast.connected("WhatsApp")
        } else {
          elegantToast.error("Falha na conexão", "Verifique as credenciais e tente novamente")
        }
      }, 2000)
    } catch (error) {
      elegantToast.networkError("testar a conexão")
    }
  }

  // Funções para gerenciamento de usuários
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchUsers.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchUsers.toLowerCase())
    const matchesTeam = filterTeam === "all" || user.team === filterTeam
    const matchesRole = filterRole === "all" || user.role === filterRole
    return matchesSearch && matchesTeam && matchesRole
  })

  const handleToggleUserStatus = (userId: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ))
    const user = users.find(u => u.id === userId)
    elegantToast.info(`${user?.name} foi ${user?.active ? 'desativado' : 'ativado'}`)
  }

  const handleDeleteUser = (user: any) => {
    setDeletingUser(user)
    setIsDeleteUserDialogOpen(true)
  }

  const confirmDeleteUser = () => {
    setUsers(prev => prev.filter(user => user.id !== deletingUser.id))
    elegantToast.deleted(deletingUser.name, "Usuário")
    setIsDeleteUserDialogOpen(false)
    setDeletingUser(null)
  }

  const getRoleLabel = (role: string) => {
    const roles = {
      admin: "Administrador",
      supervisor: "Supervisor", 
      atendente: "Atendente",
      analista: "Analista",
      consultor: "Consultor",
      vendas: "Vendas",
      suporte: "Suporte"
    }
    return roles[role as keyof typeof roles] || role
  }

  const getTeamLabel = (team: string) => {
    const teams = {
      administracao: "Administração",
      vendas: "Vendas",
      suporte: "Suporte",
      "pos-vendas": "Pós-Vendas",
      financeiro: "Financeiro",
      marketing: "Marketing"
    }
    return teams[team as keyof typeof teams] || team
  }

  return (
    <div className="h-screen bg-background overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                <SettingsIcon className="h-6 w-6 mr-3" />
                Configurações
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerencie suas preferências e configurações do sistema
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Sidebar de navegação */}
        <div className="w-64 bg-card border-r border-border p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="h-4 w-4 mr-3" />
                {tab.label}
              </Button>
            ))}
          </nav>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 p-6 space-y-6">
          {/* Perfil */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      JS
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Alterar Foto
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG até 2MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome Completo</Label>
                    <Input defaultValue="João Silva" className="mt-1" />
                  </div>
                  <div>
                    <Label>E-mail</Label>
                    <Input defaultValue="joao.silva@educhat.com" className="mt-1" />
                  </div>
                  <div>
                    <Label>Telefone</Label>
                    <Input defaultValue="+55 11 99999-9999" className="mt-1" />
                  </div>
                  <div>
                    <Label>Cargo</Label>
                    <Input defaultValue="Atendente" className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label>Assinatura</Label>
                  <Textarea 
                    defaultValue="João Silva - Atendimento EduChat"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Usuários */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Gerenciar Usuários
                    </div>
                    <Button asChild>
                      <a href="/cadastro">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Novo Usuário
                      </a>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Filtros e busca */}
                  <div className="mb-6 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Buscar usuários por nome ou email..."
                            value={searchUsers}
                            onChange={(e) => setSearchUsers(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Select value={filterTeam} onValueChange={setFilterTeam}>
                          <SelectTrigger className="w-[150px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Equipe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas as equipes</SelectItem>
                            <SelectItem value="vendas">Vendas</SelectItem>
                            <SelectItem value="suporte">Suporte</SelectItem>
                            <SelectItem value="administracao">Administração</SelectItem>
                            <SelectItem value="financeiro">Financeiro</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select value={filterRole} onValueChange={setFilterRole}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Cargo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos os cargos</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="supervisor">Supervisor</SelectItem>
                            <SelectItem value="atendente">Atendente</SelectItem>
                            <SelectItem value="vendas">Vendas</SelectItem>
                            <SelectItem value="suporte">Suporte</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Lista de usuários */}
                  <div className="space-y-3">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <Card key={user.id} className="border border-border">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarFallback className="bg-primary text-primary-foreground">
                                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-1">
                                    <h3 className="font-medium text-foreground">{user.name}</h3>
                                    {user.role === 'admin' && (
                                      <Badge variant="default" className="bg-orange-500">
                                        <Crown className="h-3 w-3 mr-1" />
                                        Admin
                                      </Badge>
                                    )}
                                    <Badge variant={user.active ? "default" : "secondary"}>
                                      {user.active ? "Ativo" : "Inativo"}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                      <Mail className="h-4 w-4 mr-1" />
                                      {user.email}
                                    </div>
                                    {user.phone && (
                                      <div className="flex items-center">
                                        <Phone className="h-4 w-4 mr-1" />
                                        {user.phone}
                                      </div>
                                    )}
                                    {user.department && (
                                      <div className="flex items-center">
                                        <Building className="h-4 w-4 mr-1" />
                                        {user.department}
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center space-x-4 mt-2 text-sm">
                                    <span className="font-medium">Cargo:</span>
                                    <span>{getRoleLabel(user.role)}</span>
                                    <span className="font-medium">Equipe:</span>
                                    <span>{getTeamLabel(user.team)}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleUserStatus(user.id)}
                                  title={user.active ? "Desativar usuário" : "Ativar usuário"}
                                >
                                  {user.active ? (
                                    <Ban className="h-4 w-4 text-orange-500" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-green-500" />
                                  )}
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="Editar usuário"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                
                                {user.role !== 'admin' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive"
                                    onClick={() => handleDeleteUser(user)}
                                    title="Excluir usuário"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">
                          Nenhum usuário encontrado
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {searchUsers || filterTeam !== "all" || filterRole !== "all" 
                            ? "Tente alterar os filtros de busca" 
                            : "Cadastre o primeiro usuário do sistema"
                          }
                        </p>
                        {(!searchUsers && filterTeam === "all" && filterRole === "all") && (
                          <Button asChild>
                            <a href="/cadastro">
                              <UserPlus className="h-4 w-4 mr-2" />
                              Cadastrar Primeiro Usuário
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Estatísticas */}
                  {filteredUsers.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-foreground">{users.length}</p>
                          <p className="text-sm text-muted-foreground">Total de usuários</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">
                            {users.filter(u => u.active).length}
                          </p>
                          <p className="text-sm text-muted-foreground">Usuários ativos</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-orange-500">
                            {users.filter(u => u.role === 'admin').length}
                          </p>
                          <p className="text-sm text-muted-foreground">Administradores</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-600">
                            {new Set(users.map(u => u.team)).size}
                          </p>
                          <p className="text-sm text-muted-foreground">Equipes diferentes</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

          {/* Equipes */}
          {activeTab === "teams" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Equipes
                    <Button onClick={() => setIsNewTeamModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Equipe
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {teamsList.map((team) => (
                    <Card key={team.id} className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${team.color}`} />
                            <div>
                              <h3 className="font-medium text-foreground">{team.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {team.members} membros
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditTeam(team)}
                              title="Editar equipe"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive" 
                              onClick={() => handleDeleteTeam(team)}
                              title="Excluir equipe"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {teamsList.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Nenhuma equipe criada
                      </h3>
                      <p className="text-muted-foreground">
                        Crie sua primeira equipe para organizar melhor seus atendentes
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Canais */}
          {activeTab === "channels" && (
            <div className="space-y-6">
              {/* WhatsApp Channels */}
              <Card>
                <CardHeader>
                  <CardTitle>Canais WhatsApp (Z-API)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {whatsappChannelsList.map((channel) => (
                    <div key={channel.id}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-foreground">{channel.name}</h3>
                          <Badge variant={channel.active ? "default" : "secondary"}>
                            {channel.active ? "Conectado" : "Desconectado"}
                          </Badge>
                        </div>
                        <Switch 
                          checked={channel.active} 
                          onCheckedChange={(checked) => {
                            setWhatsappChannelsList(prev => prev.map(ch => 
                              ch.id === channel.id ? { ...ch, active: checked } : ch
                            ))
                          }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label>Nome do Canal</Label>
                          <Input 
                            defaultValue={channel.name}
                            placeholder="Ex: WhatsApp Vendas"
                            className="mt-1"
                            onChange={(e) => {
                              setWhatsappChannelsList(prev => prev.map(ch => 
                                ch.id === channel.id ? { ...ch, name: e.target.value } : ch
                              ))
                            }}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>ID da Instância</Label>
                            <Input 
                              value={channel.instanceId}
                              placeholder="Ex: 3E381D17B9F2D0172542C6B7A3ED70A7"
                              className="mt-1"
                              onChange={(e) => {
                                setWhatsappChannelsList(prev => prev.map(ch => 
                                  ch.id === channel.id ? { ...ch, instanceId: e.target.value } : ch
                                ))
                              }}
                            />
                          </div>
                          <div>
                            <Label>Token da Instância</Label>
                            <Input 
                              type="password"
                              value={channel.instanceToken}
                              placeholder="Token da instância Z-API"
                              className="mt-1"
                              onChange={(e) => {
                                setWhatsappChannelsList(prev => prev.map(ch => 
                                  ch.id === channel.id ? { ...ch, instanceToken: e.target.value } : ch
                                ))
                              }}
                            />
                          </div>
                          <div>
                            <Label>Client Token</Label>
                            <Input 
                              type="password"
                              value={channel.clientToken}
                              placeholder="Client token Z-API"
                              className="mt-1"
                              onChange={(e) => {
                                setWhatsappChannelsList(prev => prev.map(ch => 
                                  ch.id === channel.id ? { ...ch, clientToken: e.target.value } : ch
                                ))
                              }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label>URL da API</Label>
                          <Input 
                            value={`https://api.z-api.io/instances/${channel.instanceId || '{INSTANCE_ID}'}/token/${channel.instanceToken || '{INSTANCE_TOKEN}'}/send-text`}
                            placeholder="URL será gerada automaticamente"
                            className="mt-1"
                            disabled
                          />
                        </div>

                        {/* Botões de ação */}
                        <div className="flex items-center space-x-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleTestConnection(channel)}
                            className="flex items-center"
                          >
                            {channel.active ? (
                              <Wifi className="h-4 w-4 mr-2 text-success" />
                            ) : (
                              <WifiOff className="h-4 w-4 mr-2 text-muted-foreground" />
                            )}
                            Testar Conexão
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleGenerateQrCode(channel)}
                            className="flex items-center"
                          >
                            <QrCode className="h-4 w-4 mr-2" />
                            Gerar QR Code
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                      
                      <Separator className="mt-4" />
                    </div>
                  ))}
                  
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Configurações WhatsApp
                  </Button>
                </CardContent>
              </Card>

              {/* Other Channels */}
              <Card>
                <CardHeader>
                  <CardTitle>Outros Canais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {otherChannelsList.map((channel, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-foreground">{channel.name}</h3>
                          <Badge variant={channel.active ? "default" : "secondary"}>
                            {channel.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        <Switch checked={channel.active} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Webhook/Configuração</Label>
                          <Input 
                            value={channel.webhook} 
                            onChange={(e) => {
                              setOtherChannelsList(prev => prev.map(ch => 
                                ch.id === channel.id ? {...ch, webhook: e.target.value} : ch
                              ))
                            }}
                            placeholder="URL do webhook ou configuração"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Token/Chave API</Label>
                          <Input 
                            type="password"
                            value={channel.token}
                            onChange={(e) => {
                              setOtherChannelsList(prev => prev.map(ch => 
                                ch.id === channel.id ? {...ch, token: e.target.value} : ch
                              ))
                            }}
                            placeholder="Token de acesso"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <Separator className="mt-4" />
                    </div>
                  ))}
                  
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Outros Canais
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notificações */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">Novas mensagens</h3>
                      <p className="text-sm text-muted-foreground">
                        Receber notificação para cada nova mensagem
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">Mensagens urgentes</h3>
                      <p className="text-sm text-muted-foreground">
                        Notificações especiais para mensagens marcadas como urgentes
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">Relatórios semanais</h3>
                      <p className="text-sm text-muted-foreground">
                        Receber resumo semanal por e-mail
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">Sons</h3>
                      <p className="text-sm text-muted-foreground">
                        Reproduzir som quando receber novas mensagens
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Aparência */}
          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Aparência e Interface</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Tema</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <Card className="border-2 border-primary cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <div className="w-8 h-8 bg-background border rounded-md mx-auto mb-2" />
                        <p className="text-sm font-medium">Claro</p>
                      </CardContent>
                    </Card>
                    <Card className="border cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <div className="w-8 h-8 bg-gray-800 rounded-md mx-auto mb-2" />
                        <p className="text-sm font-medium">Escuro</p>
                      </CardContent>
                    </Card>
                    <Card className="border cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-background to-gray-800 rounded-md mx-auto mb-2" />
                        <p className="text-sm font-medium">Auto</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <Label>Idioma</Label>
                  <select className="w-full mt-1 p-2 border border-border rounded-md bg-background">
                    <option>Português (Brasil)</option>
                    <option>English</option>
                    <option>Español</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Modo compacto</h3>
                    <p className="text-sm text-muted-foreground">
                      Interface mais densa com menos espaçamento
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Segurança */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alteração de Senha</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Senha Atual</Label>
                    <Input type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label>Nova Senha</Label>
                    <Input type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label>Confirmar Nova Senha</Label>
                    <Input type="password" className="mt-1" />
                  </div>
                  <Button>Alterar Senha</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Autenticação de Dois Fatores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">2FA via SMS</h3>
                      <p className="text-sm text-muted-foreground">
                        Receber código por SMS para login
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">App Autenticador</h3>
                      <p className="text-sm text-muted-foreground">
                        Usar Google Authenticator ou similar
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Nova Equipe */}
      <Dialog open={isNewTeamModalOpen} onOpenChange={setIsNewTeamModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Nova Equipe
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Nome da Equipe *</Label>
              <Input
                id="team-name"
                placeholder="Ex: Vendas, Suporte, Marketing..."
                value={newTeamData.name}
                onChange={(e) => setNewTeamData({...newTeamData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="team-color">Cor da Equipe</Label>
              <Select value={newTeamData.color} onValueChange={(value) => setNewTeamData({...newTeamData, color: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teamColors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full ${color.class} mr-2`} />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => {
              setIsNewTeamModalOpen(false)
              setNewTeamData({ name: "", color: "bg-primary", members: 0 })
            }}>
              Cancelar
            </Button>
            <Button onClick={handleCreateTeam} disabled={!newTeamData.name.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Criar Equipe
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição de Equipe */}
      <Dialog open={isEditTeamModalOpen} onOpenChange={setIsEditTeamModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="h-5 w-5 mr-2" />
              Editar Equipe
            </DialogTitle>
          </DialogHeader>
          
          {editingTeam && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-team-name">Nome da Equipe *</Label>
                <Input
                  id="edit-team-name"
                  value={editingTeam.name}
                  onChange={(e) => setEditingTeam({...editingTeam, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-team-color">Cor da Equipe</Label>
                <Select value={editingTeam.color} onValueChange={(value) => setEditingTeam({...editingTeam, color: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {teamColors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full ${color.class} mr-2`} />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-team-members">Membros</Label>
                <Input
                  id="edit-team-members"
                  type="number"
                  min="0"
                  value={editingTeam.members}
                  onChange={(e) => setEditingTeam({...editingTeam, members: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => {
              setIsEditTeamModalOpen(false)
              setEditingTeam(null)
            }}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEditTeam} disabled={!editingTeam?.name?.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={isDeleteTeamDialogOpen} onOpenChange={setIsDeleteTeamDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a equipe <strong>{deletingTeam?.name}</strong>?
              Esta ação não pode ser desfeita e todos os membros serão removidos da equipe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteTeam}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir Equipe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal do QR Code WhatsApp */}
      <Dialog open={isQrCodeModalOpen} onOpenChange={setIsQrCodeModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <QrCode className="h-5 w-5 mr-2" />
              QR Code WhatsApp
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <p className="text-sm text-muted-foreground text-center">
              Escaneie este QR Code com seu WhatsApp para conectar o canal
            </p>
            
            {/* Área do QR Code */}
            <div className="flex justify-center">
              {isLoadingQrCode ? (
                <div className="flex flex-col items-center space-y-3">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
                </div>
              ) : qrCodeImage ? (
                <div className="bg-white p-4 rounded-lg border">
                  <img 
                    src={qrCodeImage} 
                    alt="QR Code WhatsApp" 
                    className="w-48 h-48 object-contain"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
            
            {/* Instruções */}
            {qrCodeImage && (
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Instruções:</p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>Abra o WhatsApp no seu celular</li>
                  <li>Toque em Menu → Dispositivos conectados</li>
                  <li>Toque em "Conectar um dispositivo"</li>
                  <li>Aponte a câmera para este QR Code</li>
                </ol>
              </div>
            )}
            
            {/* Informações do canal */}
            {selectedChannelForQr && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">
                  Canal: {selectedChannelForQr.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Instância: {selectedChannelForQr.instanceId}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsQrCodeModalOpen(false)
                setQrCodeImage(null)
                setSelectedChannelForQr(null)
              }}
            >
              Fechar
            </Button>
            <Button 
              onClick={() => handleGenerateQrCode(selectedChannelForQr)}
              disabled={isLoadingQrCode}
            >
              {isLoadingQrCode ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <QrCode className="h-4 w-4 mr-2" />
              )}
              Gerar Novo QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}