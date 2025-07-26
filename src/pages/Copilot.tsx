import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import { 
  Bot, 
  Plus, 
  Settings, 
  MessageSquare,
  Zap,
  Users,
  Target,
  Trash2,
  Edit,
  Clock,
  Brain,
  Key,
  Shield,
  ExternalLink
} from "lucide-react"

type Automation = {
  id: number
  name: string
  trigger: string
  action: string
  active: boolean
  team: string
  description?: string
  message?: string
}

type Keyword = {
  id: number
  word: string
  team: string
  response: string
}

export default function Copilot() {
  // States for automations
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: 1,
      name: "Saudação Automática",
      trigger: "Nova conversa",
      action: "Enviar mensagem de boas-vindas",
      active: true,
      team: "Vendas",
      description: "Envia uma mensagem de boas-vindas para novos contatos",
      message: "Olá! Bem-vindo à nossa empresa. Como posso ajudá-lo hoje?"
    },
    {
      id: 2,
      name: "Horário Comercial",
      trigger: "Fora do horário",
      action: "Informar horário de atendimento",
      active: true,
      team: "Suporte",
      description: "Informa horário de funcionamento fora do expediente",
      message: "Nosso horário de atendimento é das 8h às 18h. Retornaremos em breve!"
    },
    {
      id: 3,
      name: "FAQ Automático",
      trigger: "Palavras-chave específicas",
      action: "Responder com FAQ",
      active: false,
      team: "Geral",
      description: "Responde automaticamente perguntas frequentes",
      message: "Aqui estão as respostas para as perguntas mais comuns..."
    }
  ])

  // States for keywords
  const [keywords, setKeywords] = useState<Keyword[]>([
    { id: 1, word: "preço", team: "Vendas", response: "Nossos preços variam conforme o produto. Posso enviar uma cotação personalizada!" },
    { id: 2, word: "suporte", team: "Suporte", response: "Você foi direcionado para nossa equipe de suporte. Aguarde que alguém irá atendê-lo." },
    { id: 3, word: "cancelar", team: "Financeiro", response: "Para cancelamentos, nossa equipe financeira irá auxiliá-lo. Aguarde um momento." }
  ])

  // Form states
  const [newKeyword, setNewKeyword] = useState("")
  const [newResponse, setNewResponse] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("Vendas")
  
  // Modal states
  const [isNewAutomationOpen, setIsNewAutomationOpen] = useState(false)
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null)
  const [editingKeyword, setEditingKeyword] = useState<Keyword | null>(null)
  
  // Automation form states
  const [automationForm, setAutomationForm] = useState({
    name: "",
    trigger: "",
    action: "",
    team: "Vendas",
    description: "",
    message: ""
  })

  // Configuration states
  const [settings, setSettings] = useState({
    sentimentAnalysis: true,
    intelligentSuggestions: true,
    autoCategories: true,
    workingHours: {
      start: "08:00",
      end: "18:00",
      message: "Nosso horário de atendimento é das 8h às 18h. Retornaremos em breve!"
    },
    aiIntegrations: {
      openai: {
        enabled: false,
        apiKey: localStorage.getItem('openai_api_key') || '',
        model: 'gpt-4.1-2025-04-14'
      },
      perplexity: {
        enabled: false,
        apiKey: localStorage.getItem('perplexity_api_key') || '',
        model: 'llama-3.1-sonar-small-128k-online'
      },
      anthropic: {
        enabled: false,
        apiKey: localStorage.getItem('anthropic_api_key') || '',
        model: 'claude-sonnet-4-20250514'
      }
    }
  })

  // Functions
  const handleToggleAutomation = (id: number) => {
    setAutomations(prev => prev.map(auto => 
      auto.id === id ? { ...auto, active: !auto.active } : auto
    ))
    toast({
      title: "Automação atualizada",
      description: "Status da automação foi alterado com sucesso."
    })
  }

  const handleDeleteAutomation = (id: number) => {
    setAutomations(prev => prev.filter(auto => auto.id !== id))
    toast({
      title: "Automação excluída",
      description: "A automação foi removida com sucesso."
    })
  }

  const handleEditAutomation = (automation: Automation) => {
    setEditingAutomation(automation)
    setAutomationForm({
      name: automation.name,
      trigger: automation.trigger,
      action: automation.action,
      team: automation.team,
      description: automation.description || "",
      message: automation.message || ""
    })
    setIsNewAutomationOpen(true)
  }

  const handleSaveAutomation = () => {
    if (!automationForm.name || !automationForm.trigger || !automationForm.action) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      })
      return
    }

    if (editingAutomation) {
      setAutomations(prev => prev.map(auto => 
        auto.id === editingAutomation.id 
          ? { ...auto, ...automationForm }
          : auto
      ))
      toast({
        title: "Automação atualizada",
        description: "A automação foi editada com sucesso."
      })
    } else {
      const newAutomation: Automation = {
        id: Date.now(),
        ...automationForm,
        active: true
      }
      setAutomations(prev => [...prev, newAutomation])
      toast({
        title: "Automação criada",
        description: "Nova automação foi adicionada com sucesso."
      })
    }

    setIsNewAutomationOpen(false)
    setEditingAutomation(null)
    setAutomationForm({
      name: "",
      trigger: "",
      action: "",
      team: "Vendas",
      description: "",
      message: ""
    })
  }

  const handleAddKeyword = () => {
    if (!newKeyword || !newResponse) {
      toast({
        title: "Erro",
        description: "Preencha a palavra-chave e a resposta.",
        variant: "destructive"
      })
      return
    }

    if (editingKeyword) {
      setKeywords(prev => prev.map(kw => 
        kw.id === editingKeyword.id 
          ? { ...kw, word: newKeyword, team: selectedTeam, response: newResponse }
          : kw
      ))
      toast({
        title: "Palavra-chave atualizada",
        description: "A palavra-chave foi editada com sucesso."
      })
      setEditingKeyword(null)
    } else {
      const newKw: Keyword = {
        id: Date.now(),
        word: newKeyword,
        team: selectedTeam,
        response: newResponse
      }
      setKeywords(prev => [...prev, newKw])
      toast({
        title: "Palavra-chave adicionada",
        description: "Nova palavra-chave foi configurada."
      })
    }

    setNewKeyword("")
    setNewResponse("")
    setSelectedTeam("Vendas")
  }

  const handleEditKeyword = (keyword: Keyword) => {
    setEditingKeyword(keyword)
    setNewKeyword(keyword.word)
    setNewResponse(keyword.response)
    setSelectedTeam(keyword.team)
  }

  const handleDeleteKeyword = (id: number) => {
    setKeywords(prev => prev.filter(kw => kw.id !== id))
    toast({
      title: "Palavra-chave excluída",
      description: "A palavra-chave foi removida com sucesso."
    })
  }

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }))
    toast({
      title: "Configuração atualizada",
      description: "As configurações foram salvas."
    })
  }

  const handleAIIntegrationChange = (provider: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      aiIntegrations: {
        ...prev.aiIntegrations,
        [provider]: {
          ...prev.aiIntegrations[provider as keyof typeof prev.aiIntegrations],
          [field]: value
        }
      }
    }))
    
    // Save API key to localStorage
    if (field === 'apiKey' && value) {
      localStorage.setItem(`${provider}_api_key`, value)
    }
    
    toast({
      title: "Integração atualizada",
      description: `Configurações do ${provider} foram salvas.`
    })
  }

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
            
            <Dialog open={isNewAutomationOpen} onOpenChange={setIsNewAutomationOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary-hover">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Automação
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingAutomation ? "Editar Automação" : "Nova Automação"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Nome da Automação</Label>
                    <Input
                      value={automationForm.name}
                      onChange={(e) => setAutomationForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Saudação automática"
                    />
                  </div>
                  
                  <div>
                    <Label>Gatilho</Label>
                    <Select 
                      value={automationForm.trigger} 
                      onValueChange={(value) => setAutomationForm(prev => ({ ...prev, trigger: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o gatilho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nova conversa">Nova conversa</SelectItem>
                        <SelectItem value="Fora do horário">Fora do horário</SelectItem>
                        <SelectItem value="Palavras-chave específicas">Palavras-chave específicas</SelectItem>
                        <SelectItem value="Tempo de inatividade">Tempo de inatividade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Ação</Label>
                    <Input
                      value={automationForm.action}
                      onChange={(e) => setAutomationForm(prev => ({ ...prev, action: e.target.value }))}
                      placeholder="Ex: Enviar mensagem de boas-vindas"
                    />
                  </div>
                  
                  <div>
                    <Label>Equipe</Label>
                    <Select 
                      value={automationForm.team} 
                      onValueChange={(value) => setAutomationForm(prev => ({ ...prev, team: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vendas">Vendas</SelectItem>
                        <SelectItem value="Suporte">Suporte</SelectItem>
                        <SelectItem value="Financeiro">Financeiro</SelectItem>
                        <SelectItem value="Geral">Geral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Descrição</Label>
                    <Textarea
                      value={automationForm.description}
                      onChange={(e) => setAutomationForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva o que esta automação faz"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label>Mensagem (opcional)</Label>
                    <Textarea
                      value={automationForm.message}
                      onChange={(e) => setAutomationForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Mensagem que será enviada automaticamente"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsNewAutomationOpen(false)
                        setEditingAutomation(null)
                        setAutomationForm({
                          name: "",
                          trigger: "",
                          action: "",
                          team: "Vendas",
                          description: "",
                          message: ""
                        })
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveAutomation}>
                      {editingAutomation ? "Atualizar" : "Criar"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
                      <Switch 
                        checked={automation.active} 
                        onCheckedChange={() => handleToggleAutomation(automation.id)}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditAutomation(automation)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Automação</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a automação "{automation.name}"? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteAutomation(automation.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
                    <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vendas">Vendas</SelectItem>
                        <SelectItem value="Suporte">Suporte</SelectItem>
                        <SelectItem value="Financeiro">Financeiro</SelectItem>
                        <SelectItem value="Geral">Geral</SelectItem>
                      </SelectContent>
                    </Select>
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
                  
                  <Button className="w-full" onClick={handleAddKeyword}>
                    <Plus className="h-4 w-4 mr-2" />
                    {editingKeyword ? "Atualizar" : "Adicionar"}
                  </Button>
                  {editingKeyword && (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => {
                        setEditingKeyword(null)
                        setNewKeyword("")
                        setNewResponse("")
                        setSelectedTeam("Vendas")
                      }}
                    >
                      Cancelar Edição
                    </Button>
                  )}
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
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditKeyword(keyword)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Palavra-chave</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a palavra-chave "{keyword.word}"?
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteKeyword(keyword.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
      <div className="px-6 pb-6 space-y-6">
        {/* Configurações de IA */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Integrações de IA
            </CardTitle>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800">Segurança das API Keys</p>
                  <p className="text-amber-700 mt-1">
                    Para maior segurança, recomendamos conectar ao Supabase onde as chaves ficam protegidas no servidor.
                    <a href="https://docs.lovable.dev/integrations/supabase" target="_blank" rel="noopener noreferrer" className="inline-flex items-center ml-1 text-blue-600 hover:text-blue-800">
                      Integrar Supabase
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* OpenAI GPT */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-foreground flex items-center">
                    <div className="w-6 h-6 bg-green-100 rounded mr-2 flex items-center justify-center">
                      <span className="text-xs font-bold text-green-700">AI</span>
                    </div>
                    OpenAI GPT
                  </h4>
                  <p className="text-xs text-muted-foreground">Configure a integração com GPT-4</p>
                </div>
                <Switch 
                  checked={settings.aiIntegrations.openai.enabled}
                  onCheckedChange={(checked) => handleAIIntegrationChange('openai', 'enabled', checked)}
                />
              </div>
              
              {settings.aiIntegrations.openai.enabled && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm">API Key</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        value={settings.aiIntegrations.openai.apiKey}
                        onChange={(e) => handleAIIntegrationChange('openai', 'apiKey', e.target.value)}
                        placeholder="sk-..."
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Modelo</Label>
                    <Select 
                      value={settings.aiIntegrations.openai.model}
                      onValueChange={(value) => handleAIIntegrationChange('openai', 'model', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4.1-2025-04-14">GPT-4.1 (2025) - Recomendado</SelectItem>
                        <SelectItem value="o3-2025-04-16">O3 (2025) - Raciocínio Avançado</SelectItem>
                        <SelectItem value="o4-mini-2025-04-16">O4 Mini - Rápido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {/* Perplexity AI */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-foreground flex items-center">
                    <div className="w-6 h-6 bg-blue-100 rounded mr-2 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-700">P</span>
                    </div>
                    Perplexity AI
                  </h4>
                  <p className="text-xs text-muted-foreground">IA com acesso à internet em tempo real</p>
                </div>
                <Switch 
                  checked={settings.aiIntegrations.perplexity.enabled}
                  onCheckedChange={(checked) => handleAIIntegrationChange('perplexity', 'enabled', checked)}
                />
              </div>
              
              {settings.aiIntegrations.perplexity.enabled && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm">API Key</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        value={settings.aiIntegrations.perplexity.apiKey}
                        onChange={(e) => handleAIIntegrationChange('perplexity', 'apiKey', e.target.value)}
                        placeholder="pplx-..."
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Modelo</Label>
                    <Select 
                      value={settings.aiIntegrations.perplexity.model}
                      onValueChange={(value) => handleAIIntegrationChange('perplexity', 'model', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="llama-3.1-sonar-small-128k-online">Llama 3.1 Small (8B) - Rápido</SelectItem>
                        <SelectItem value="llama-3.1-sonar-large-128k-online">Llama 3.1 Large (70B) - Balanceado</SelectItem>
                        <SelectItem value="llama-3.1-sonar-huge-128k-online">Llama 3.1 Huge (405B) - Máximo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {/* Anthropic Claude */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-foreground flex items-center">
                    <div className="w-6 h-6 bg-purple-100 rounded mr-2 flex items-center justify-center">
                      <span className="text-xs font-bold text-purple-700">C</span>
                    </div>
                    Anthropic Claude
                  </h4>
                  <p className="text-xs text-muted-foreground">IA com foco em segurança e precisão</p>
                </div>
                <Switch 
                  checked={settings.aiIntegrations.anthropic.enabled}
                  onCheckedChange={(checked) => handleAIIntegrationChange('anthropic', 'enabled', checked)}
                />
              </div>
              
              {settings.aiIntegrations.anthropic.enabled && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm">API Key</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        value={settings.aiIntegrations.anthropic.apiKey}
                        onChange={(e) => handleAIIntegrationChange('anthropic', 'apiKey', e.target.value)}
                        placeholder="sk-ant-..."
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Modelo</Label>
                    <Select 
                      value={settings.aiIntegrations.anthropic.model}
                      onValueChange={(value) => handleAIIntegrationChange('anthropic', 'model', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="claude-sonnet-4-20250514">Claude Sonnet 4 - Recomendado</SelectItem>
                        <SelectItem value="claude-opus-4-20250514">Claude Opus 4 - Máximo</SelectItem>
                        <SelectItem value="claude-3-5-haiku-20241022">Claude Haiku - Rápido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Configurações Gerais */}
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
                <Switch 
                  checked={settings.sentimentAnalysis}
                  onCheckedChange={(checked) => handleSettingChange('sentimentAnalysis', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Sugestões Inteligentes</p>
                  <p className="text-xs text-muted-foreground">IA sugere respostas personalizadas</p>
                </div>
                <Switch 
                  checked={settings.intelligentSuggestions}
                  onCheckedChange={(checked) => handleSettingChange('intelligentSuggestions', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Auto-categorização</p>
                  <p className="text-xs text-muted-foreground">Categorizar conversas automaticamente</p>
                </div>
                <Switch 
                  checked={settings.autoCategories}
                  onCheckedChange={(checked) => handleSettingChange('autoCategories', checked)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Horários de Funcionamento</h4>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Horário de Atendimento</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input 
                      type="time"
                      value={settings.workingHours.start}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        workingHours: { ...prev.workingHours, start: e.target.value }
                      }))}
                      className="flex-1" 
                    />
                    <span className="self-center text-muted-foreground">às</span>
                    <Input 
                      type="time"
                      value={settings.workingHours.end}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        workingHours: { ...prev.workingHours, end: e.target.value }
                      }))}
                      className="flex-1" 
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-muted-foreground">Mensagem Fora do Horário</Label>
                  <Textarea 
                    value={settings.workingHours.message}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      workingHours: { ...prev.workingHours, message: e.target.value }
                    }))}
                    rows={3}
                    className="mt-1"
                  />
                </div>
                
                <Button className="w-full mt-4">
                  <Clock className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}