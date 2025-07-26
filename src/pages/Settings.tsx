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
  X
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
  { name: "Instagram", active: true, webhook: "https://api.educhat.com/webhook/instagram", token: "" },
  { name: "Facebook", active: false, webhook: "", token: "" },
  { name: "E-mail", active: true, webhook: "smtp.educhat.com:587", token: "" }
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile")
  const [teamsList, setTeamsList] = useState(teams)
  const [isNewTeamModalOpen, setIsNewTeamModalOpen] = useState(false)
  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false)
  const [isDeleteTeamDialogOpen, setIsDeleteTeamDialogOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<any>(null)
  const [deletingTeam, setDeletingTeam] = useState<any>(null)
  const [newTeamData, setNewTeamData] = useState({
    name: "",
    color: "bg-primary",
    members: 0
  })
  const { toast } = useToast()

  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
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
      toast({ title: "Nome da equipe é obrigatório", variant: "destructive" })
      return
    }

    const newTeam = {
      id: Math.max(...teamsList.map(t => t.id)) + 1,
      name: newTeamData.name,
      color: newTeamData.color,
      members: 0
    }

    setTeamsList(prev => [...prev, newTeam])
    toast({ title: "Equipe criada com sucesso!" })
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
      toast({ title: "Nome da equipe é obrigatório", variant: "destructive" })
      return
    }

    setTeamsList(prev => prev.map(team => 
      team.id === editingTeam.id ? editingTeam : team
    ))
    
    toast({ title: "Equipe atualizada com sucesso!" })
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
    toast({ 
      title: "Equipe excluída", 
      description: `A equipe "${deletingTeam.name}" foi removida` 
    })
    setIsDeleteTeamDialogOpen(false)
    setDeletingTeam(null)
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
                  {whatsappChannels.map((channel) => (
                    <div key={channel.id}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-foreground">{channel.name}</h3>
                          <Badge variant={channel.active ? "default" : "secondary"}>
                            {channel.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        <Switch checked={channel.active} />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label>Nome do Canal</Label>
                          <Input 
                            defaultValue={channel.name}
                            placeholder="Ex: WhatsApp Vendas"
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>ID da Instância</Label>
                            <Input 
                              value={channel.instanceId}
                              placeholder="Ex: 3E381D17B9F2D0172542C6B7A3ED70A7"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Token da Instância</Label>
                            <Input 
                              type="password"
                              value={channel.instanceToken}
                              placeholder="Token da instância Z-API"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Client Token</Label>
                            <Input 
                              type="password"
                              value={channel.clientToken}
                              placeholder="Client token Z-API"
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label>URL da API</Label>
                          <Input 
                            defaultValue={`https://api.z-api.io/instances/${channel.instanceId || '{INSTANCE_ID}'}/token/${channel.instanceToken || '{INSTANCE_TOKEN}'}/send-text`}
                            placeholder="URL será gerada automaticamente"
                            className="mt-1"
                            disabled
                          />
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
                  {otherChannels.map((channel, index) => (
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
                            placeholder="URL do webhook ou configuração"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Token/Chave API</Label>
                          <Input 
                            type="password"
                            value={channel.token}
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
    </div>
  )
}