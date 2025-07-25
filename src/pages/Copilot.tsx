import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Bot, 
  Plus, 
  Settings, 
  MessageSquare,
  Zap,
  Users,
  Target,
  Trash2,
  Edit
} from "lucide-react"

const automations = [
  {
    id: 1,
    name: "Saudação Automática",
    trigger: "Nova conversa",
    action: "Enviar mensagem de boas-vindas",
    active: true,
    team: "Vendas"
  },
  {
    id: 2,
    name: "Horário Comercial",
    trigger: "Fora do horário",
    action: "Informar horário de atendimento",
    active: true,
    team: "Suporte"
  },
  {
    id: 3,
    name: "FAQ Automático",
    trigger: "Palavras-chave específicas",
    action: "Responder com FAQ",
    active: false,
    team: "Geral"
  }
]

const keywords = [
  { word: "preço", team: "Vendas", response: "Nossos preços variam conforme o produto..." },
  { word: "suporte", team: "Suporte", response: "Você foi direcionado para nossa equipe de suporte..." },
  { word: "cancelar", team: "Financeiro", response: "Para cancelamentos, nossa equipe financeira..." }
]

export default function Copilot() {
  const [newKeyword, setNewKeyword] = useState("")
  const [newResponse, setNewResponse] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("Vendas")

  return (
    <div className="h-screen bg-background overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                <Bot className="h-6 w-6 mr-3" />
                Copiloto IA
              </h1>
              <p className="text-muted-foreground mt-1">
                Configure automações e inteligência artificial para otimizar o atendimento
              </p>
            </div>
            
            <Button className="bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Nova Automação
            </Button>
          </div>
        </div>
      </div>

      {/* Status e Métricas */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Automações Ativas</p>
                <p className="text-2xl font-bold text-foreground">
                  {automations.filter(a => a.active).length}
                </p>
              </div>
              <Zap className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mensagens Automáticas</p>
                <p className="text-2xl font-bold text-foreground">147</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-foreground">89%</p>
              </div>
              <Target className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tempo Economizado</p>
                <p className="text-2xl font-bold text-foreground">4.2h</p>
              </div>
              <Users className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automações Ativas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Automações Configuradas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {automations.map((automation) => (
              <Card key={automation.id} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{automation.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Switch checked={automation.active} />
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Gatilho:</span>
                      <span className="text-foreground">{automation.trigger}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Ação:</span>
                      <span className="text-foreground">{automation.action}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Equipe:</span>
                      <Badge variant="outline">{automation.team}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Palavras-chave e Direcionamento */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Direcionamento por Palavras-chave
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Adicionar nova palavra-chave */}
            <Card className="border-dashed border-2 border-primary/20">
              <CardContent className="p-4">
                <h4 className="font-medium text-foreground mb-3">Adicionar Nova Palavra-chave</h4>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">Palavra-chave</Label>
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Ex: orçamento, preço, suporte..."
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Equipe de Destino</Label>
                    <select 
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      className="w-full mt-1 p-2 border border-border rounded-md bg-background"
                    >
                      <option>Vendas</option>
                      <option>Suporte</option>
                      <option>Financeiro</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Resposta Automática</Label>
                    <Textarea
                      value={newResponse}
                      onChange={(e) => setNewResponse(e.target.value)}
                      placeholder="Digite a resposta automática..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de palavras-chave existentes */}
            <div className="space-y-3">
              {keywords.map((keyword, index) => (
                <Card key={index} className="border border-border">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {keyword.word}
                        </Badge>
                        <span className="text-sm text-muted-foreground">→</span>
                        <Badge variant="outline" className="text-xs">
                          {keyword.team}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {keyword.response}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configurações Avançadas */}
      <div className="px-6 pb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Configurações Avançadas
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Configurações Gerais</h4>
              
              <div className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Análise de Sentimento</p>
                  <p className="text-xs text-muted-foreground">Detectar humor do cliente automaticamente</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Sugestões Inteligentes</p>
                  <p className="text-xs text-muted-foreground">IA sugere respostas personalizadas</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Auto-categorização</p>
                  <p className="text-xs text-muted-foreground">Categorizar conversas automaticamente</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Horários de Funcionamento</h4>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Horário de Atendimento</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input placeholder="08:00" className="flex-1" />
                    <span className="self-center text-muted-foreground">às</span>
                    <Input placeholder="18:00" className="flex-1" />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-muted-foreground">Mensagem Fora do Horário</Label>
                  <Textarea 
                    placeholder="Nosso horário de atendimento é das 8h às 18h..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}