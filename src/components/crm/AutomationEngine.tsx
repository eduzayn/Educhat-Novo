import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useElegantToast } from "@/components/ui/elegant-toast";
import { 
  Plus,
  Bot,
  Zap,
  Calendar,
  MessageSquare,
  Mail,
  Phone,
  Target,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Settings,
  Play,
  Pause,
  Edit,
  Trash2,
  Copy
} from "lucide-react";

interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: 'lead_qualification' | 'follow_up' | 'nurturing' | 'notification';
  trigger: string;
  condition: string;
  action: string;
  icon: React.ElementType;
  isPopular: boolean;
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: {
    type: string;
    conditions: string[];
  };
  actions: {
    type: string;
    message?: string;
    delay?: number;
    assignTo?: string;
  }[];
  performance: {
    triggered: number;
    completed: number;
    conversionRate: number;
  };
  createdAt: string;
}

export const AutomationEngine = () => {
  const { showToast } = useElegantToast();

  const [templates] = useState<AutomationTemplate[]>([
    {
      id: '1',
      name: 'Qualificação Automática de Leads',
      description: 'Identifica leads qualificados através de palavras-chave e os move automaticamente para o CRM',
      category: 'lead_qualification',
      trigger: 'Nova mensagem recebida',
      condition: 'Contém palavras-chave de interesse',
      action: 'Criar oportunidade + Enviar questionário',
      icon: Target,
      isPopular: true
    },
    {
      id: '2', 
      name: 'Follow-up Inteligente',
      description: 'Envia lembretes automáticos para oportunidades sem resposta',
      category: 'follow_up',
      trigger: 'Oportunidade sem interação',
      condition: 'Há mais de X dias',
      action: 'Enviar mensagem personalizada',
      icon: Clock,
      isPopular: true
    },
    {
      id: '3',
      name: 'Nutrição de Leads',
      description: 'Sequência automatizada de conteúdo educativo para leads frios',
      category: 'nurturing',
      trigger: 'Lead sem proposta',
      condition: 'Há mais de 7 dias',
      action: 'Enviar conteúdo educativo',
      icon: TrendingUp,
      isPopular: false
    },
    {
      id: '4',
      name: 'Alerta de Oportunidade Quente',
      description: 'Notifica vendedores sobre oportunidades com alta probabilidade',
      category: 'notification',
      trigger: 'Oportunidade atualizada',
      condition: 'Probabilidade > 80%',
      action: 'Notificar vendedor + Agendar ligação',
      icon: AlertTriangle,
      isPopular: false
    }
  ]);

  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([
    {
      id: '1',
      name: 'Qualificação WhatsApp',
      description: 'Detecta interesse em mensagens do WhatsApp e cria oportunidades',
      isActive: true,
      trigger: {
        type: 'message_received',
        conditions: ['source:whatsapp', 'keywords:orçamento,preço,valor']
      },
      actions: [
        { type: 'create_opportunity', delay: 0 },
        { type: 'send_message', message: 'Olá! Vi que você tem interesse em nossos serviços. Vou te enviar mais informações!', delay: 2 },
        { type: 'assign_to_sales', assignTo: 'vendedor_1', delay: 5 }
      ],
      performance: {
        triggered: 45,
        completed: 38,
        conversionRate: 84
      },
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Follow-up Proposta',
      description: 'Acompanha propostas enviadas e faz follow-up automático',
      isActive: true,
      trigger: {
        type: 'stage_changed',
        conditions: ['stage:proposal', 'days_without_activity:3']
      },
      actions: [
        { type: 'send_message', message: 'Oi! Como está a análise da nossa proposta? Tem alguma dúvida que posso esclarecer?', delay: 0 },
        { type: 'create_task', delay: 1440 } // 24 horas depois
      ],
      performance: {
        triggered: 23,
        completed: 19,
        conversionRate: 65
      },
      createdAt: '2024-01-10'
    }
  ]);

  const [isNewWorkflowOpen, setIsNewWorkflowOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<AutomationTemplate | null>(null);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    triggerType: '',
    keywords: '',
    responseMessage: '',
    followUpDelay: '60'
  });

  const handleCreateFromTemplate = (template: AutomationTemplate) => {
    setSelectedTemplate(template);
    setNewWorkflow({
      name: template.name,
      description: template.description,
      triggerType: template.trigger,
      keywords: '',
      responseMessage: '',
      followUpDelay: '60'
    });
    setIsNewWorkflowOpen(true);
  };

  const handleCreateWorkflow = () => {
    if (!newWorkflow.name) {
      showToast({
        variant: 'error',
        title: 'Campo Obrigatório',
        description: 'Digite um nome para a automação'
      });
      return;
    }

    const workflow: AutomationWorkflow = {
      id: Date.now().toString(),
      name: newWorkflow.name,
      description: newWorkflow.description,
      isActive: true,
      trigger: {
        type: newWorkflow.triggerType,
        conditions: newWorkflow.keywords.split(',').map(k => k.trim())
      },
      actions: [
        { type: 'send_message', message: newWorkflow.responseMessage, delay: 0 },
        { type: 'create_opportunity', delay: parseInt(newWorkflow.followUpDelay) }
      ],
      performance: {
        triggered: 0,
        completed: 0,
        conversionRate: 0
      },
      createdAt: new Date().toISOString().split('T')[0]
    };

    setWorkflows(prev => [...prev, workflow]);
    setIsNewWorkflowOpen(false);
    setNewWorkflow({
      name: '', description: '', triggerType: '', keywords: '', responseMessage: '', followUpDelay: '60'
    });

    showToast({
      variant: 'success',
      action: 'create',
      title: 'Automação Criada',
      description: `${workflow.name} foi configurada e está ativa`
    });
  };

  const handleToggleWorkflow = (workflowId: string) => {
    setWorkflows(prev => 
      prev.map(w => 
        w.id === workflowId 
          ? { ...w, isActive: !w.isActive }
          : w
      )
    );

    showToast({
      variant: 'success',
      title: 'Automação Atualizada',
      description: 'Status alterado com sucesso'
    });
  };

  const handleDuplicateWorkflow = (workflow: AutomationWorkflow) => {
    const duplicated = {
      ...workflow,
      id: Date.now().toString(),
      name: `${workflow.name} (Cópia)`,
      performance: { triggered: 0, completed: 0, conversionRate: 0 }
    };

    setWorkflows(prev => [...prev, duplicated]);

    showToast({
      variant: 'success',
      action: 'duplicate',
      title: 'Automação Duplicada',
      description: `${duplicated.name} foi criada`
    });
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    setWorkflows(prev => prev.filter(w => w.id !== workflowId));

    showToast({
      variant: 'success',
      action: 'delete',
      title: 'Automação Removida',
      description: `${workflow?.name} foi excluída`
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'lead_qualification': return Target;
      case 'follow_up': return Clock;
      case 'nurturing': return TrendingUp;
      case 'notification': return AlertTriangle;
      default: return Bot;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'lead_qualification': return 'Qualificação';
      case 'follow_up': return 'Follow-up';
      case 'nurturing': return 'Nutrição';
      case 'notification': return 'Notificação';
      default: return 'Geral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            Motor de Automações
          </h2>
          <p className="text-muted-foreground">Configure automações inteligentes para seu processo de vendas</p>
        </div>

        <Dialog open={isNewWorkflowOpen} onOpenChange={setIsNewWorkflowOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Automação
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Templates de Automação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Templates Prontos
          </CardTitle>
          <CardDescription>
            Escolha um template para começar rapidamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => {
              const IconComponent = template.icon;
              return (
                <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{template.name}</h4>
                            {template.isPopular && (
                              <Badge variant="secondary" className="text-xs">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {getCategoryLabel(template.category)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {template.description}
                    </p>

                    <div className="space-y-2 text-xs text-muted-foreground mb-4">
                      <p><span className="font-medium">Gatilho:</span> {template.trigger}</p>
                      <p><span className="font-medium">Condição:</span> {template.condition}</p>
                      <p><span className="font-medium">Ação:</span> {template.action}</p>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleCreateFromTemplate(template)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Usar Template
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Automações Ativas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Automações Configuradas
            <Badge variant="secondary" className="ml-auto">
              {workflows.filter(w => w.isActive).length} ativas
            </Badge>
          </CardTitle>
          <CardDescription>
            Gerencie suas automações e acompanhe a performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="border-l-4 border-l-primary/30">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-foreground">{workflow.name}</h4>
                      <Switch 
                        checked={workflow.isActive}
                        onCheckedChange={() => handleToggleWorkflow(workflow.id)}
                      />
                      <Badge variant={workflow.isActive ? "default" : "secondary"}>
                        {workflow.isActive ? "Ativa" : "Pausada"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {workflow.description}
                    </p>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <div className="text-lg font-bold text-foreground">
                          {workflow.performance.triggered}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Executadas
                        </div>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <div className="text-lg font-bold text-foreground">
                          {workflow.performance.completed}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Completadas
                        </div>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded">
                        <div className="text-lg font-bold text-success">
                          {workflow.performance.conversionRate}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Taxa de Sucesso
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDuplicateWorkflow(workflow)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Duplicar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteWorkflow(workflow.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>

                {/* Workflow Details */}
                <div className="border-t pt-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-foreground">Gatilho:</span>
                      <p className="text-muted-foreground">{workflow.trigger.type}</p>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Ações:</span>
                      <p className="text-muted-foreground">
                        {workflow.actions.length} ação(ões) configurada(s)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Modal de Nova Automação */}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {selectedTemplate ? `Configurar: ${selectedTemplate.name}` : 'Nova Automação'}
          </DialogTitle>
          <DialogDescription>
            Configure os parâmetros da sua automação
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome da Automação</Label>
              <Input
                id="name"
                value={newWorkflow.name}
                onChange={(e) => setNewWorkflow(prev => ({...prev, name: e.target.value}))}
                placeholder="Ex: Qualificação WhatsApp"
              />
            </div>
            <div>
              <Label htmlFor="triggerType">Tipo de Gatilho</Label>
              <Select value={newWorkflow.triggerType} onValueChange={(value) => setNewWorkflow(prev => ({...prev, triggerType: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o gatilho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="message_received">Nova mensagem recebida</SelectItem>
                  <SelectItem value="stage_changed">Mudança de estágio</SelectItem>
                  <SelectItem value="time_based">Baseado em tempo</SelectItem>
                  <SelectItem value="opportunity_created">Oportunidade criada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={newWorkflow.description}
              onChange={(e) => setNewWorkflow(prev => ({...prev, description: e.target.value}))}
              placeholder="Descreva o que esta automação faz..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="keywords">Palavras-chave (separadas por vírgula)</Label>
            <Input
              id="keywords"
              value={newWorkflow.keywords}
              onChange={(e) => setNewWorkflow(prev => ({...prev, keywords: e.target.value}))}
              placeholder="orçamento, preço, valor, cotação"
            />
          </div>

          <div>
            <Label htmlFor="responseMessage">Mensagem de Resposta Automática</Label>
            <Textarea
              id="responseMessage"
              value={newWorkflow.responseMessage}
              onChange={(e) => setNewWorkflow(prev => ({...prev, responseMessage: e.target.value}))}
              placeholder="Olá! Vi que você tem interesse em nossos serviços..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="followUpDelay">Delay para Próxima Ação (minutos)</Label>
            <Input
              id="followUpDelay"
              type="number"
              value={newWorkflow.followUpDelay}
              onChange={(e) => setNewWorkflow(prev => ({...prev, followUpDelay: e.target.value}))}
              placeholder="60"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsNewWorkflowOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreateWorkflow}>
            <Bot className="h-4 w-4 mr-2" />
            Criar Automação
          </Button>
        </div>
      </DialogContent>
    </div>
  );
};