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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIAgent } from "@/components/copilot/AIAgent"
import { aiService } from "@/components/copilot/AIService"
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
    }
  ])

  // States for keywords
  const [keywords, setKeywords] = useState<Keyword[]>([
    { id: 1, word: "preço", team: "Vendas", response: "Nossos preços variam conforme o produto. Posso enviar uma cotação personalizada!" }
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

  // AI Agent state
  const [isAIAgentActive, setIsAIAgentActive] = useState(false)

  // Handlers
  const handleToggleAIAgent = (active: boolean) => {
    setIsAIAgentActive(active)
    if (active) {
      aiService.updateConfig(settings.aiIntegrations)
      toast({
        title: "Agente Virtual Ativado",
        description: "O sistema ZAIA está monitorando conversas e respondendo automaticamente."
      })
    } else {
      toast({
        title: "Agente Virtual Pausado",
        description: "Todas as conversas serão direcionadas para atendimento humano."
      })
    }
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
                Copiloto IA - Sistema ZAIA
              </h1>
              <p className="text-muted-foreground mt-1">
                Atendimento automatizado inteligente para SDR, Closer e Suporte
              </p>
            </div>
            
            <Button className="bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Nova Automação
            </Button>
          </div>
        </div>
      </div>

      {/* Content com Tabs */}
      <div className="p-6">
        <Tabs defaultValue="agent" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="agent">Agente Virtual</TabsTrigger>
            <TabsTrigger value="automations">Automações</TabsTrigger>
            <TabsTrigger value="keywords">Palavras-chave</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="agent" className="mt-6">
            <AIAgent 
              isActive={isAIAgentActive}
              onToggle={handleToggleAIAgent}
            />
          </TabsContent>

          <TabsContent value="automations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Automações Configuradas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Configure suas automações aqui.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Palavras-chave</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Configure direcionamento por palavras-chave.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Configurações de IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* OpenAI */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">OpenAI GPT</h4>
                      <Switch 
                        checked={settings.aiIntegrations.openai.enabled}
                        onCheckedChange={(checked) => handleAIIntegrationChange('openai', 'enabled', checked)}
                      />
                    </div>
                    {settings.aiIntegrations.openai.enabled && (
                      <div className="space-y-3">
                        <Input
                          type="password"
                          placeholder="API Key"
                          value={settings.aiIntegrations.openai.apiKey}
                          onChange={(e) => handleAIIntegrationChange('openai', 'apiKey', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}