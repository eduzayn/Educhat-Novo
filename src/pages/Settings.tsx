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
  Trash2
} from "lucide-react"

const teams = [
  { id: 1, name: "Vendas", members: 3, color: "bg-primary" },
  { id: 2, name: "Suporte", members: 2, color: "bg-accent" },
  { id: 3, name: "Financeiro", members: 1, color: "bg-warning" }
]

const channels = [
  { name: "WhatsApp", active: true, webhook: "https://api.educhat.com/webhook/whatsapp" },
  { name: "Instagram", active: true, webhook: "https://api.educhat.com/webhook/instagram" },
  { name: "Facebook", active: false, webhook: "" },
  { name: "E-mail", active: true, webhook: "smtp.educhat.com:587" }
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile")

  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "teams", label: "Equipes", icon: Users },
    { id: "channels", label: "Canais", icon: MessageSquare },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "appearance", label: "Aparência", icon: Palette },
    { id: "security", label: "Segurança", icon: Shield }
  ]

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
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Equipe
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {teams.map((team) => (
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
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Canais */}
          {activeTab === "channels" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuração de Canais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {channels.map((channel, index) => (
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
                    Salvar Configurações
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
    </div>
  )
}