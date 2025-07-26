import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useElegantToast } from "@/components/ui/elegant-toast";
import { 
  MessageSquare, 
  ArrowRight, 
  Zap, 
  Clock, 
  User, 
  Building, 
  DollarSign, 
  Phone, 
  Mail,
  Target,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Workflow,
  Bot,
  Play,
  Pause
} from "lucide-react";

interface Conversation {
  id: string;
  contactName: string;
  contactPhone: string;
  lastMessage: string;
  timestamp: string;
  source: 'WhatsApp' | 'Email' | 'SMS';
  priority: 'high' | 'medium' | 'low';
  hasOpportunity: boolean;
  opportunityValue?: number;
  stage?: string;
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  isActive: boolean;
  executionCount: number;
}

export const CRMIntegration = () => {
  const { showToast } = useElegantToast();
  
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      contactName: 'Carlos Silva',
      contactPhone: '+55 11 99999-1234',
      lastMessage: 'Gostaria de saber mais sobre automação residencial',
      timestamp: '2 min atrás',
      source: 'WhatsApp',
      priority: 'high',
      hasOpportunity: false
    },
    {
      id: '2',
      contactName: 'Ana Santos',
      contactPhone: '+55 11 88888-5678',
      lastMessage: 'Preciso de um orçamento para sistema empresarial',
      timestamp: '15 min atrás',
      source: 'WhatsApp',
      priority: 'medium',
      hasOpportunity: true,
      opportunityValue: 25000,
      stage: 'Proposta'
    },
    {
      id: '3',
      contactName: 'João Costa',
      contactPhone: '+55 11 77777-9012',
      lastMessage: 'Quando podemos agendar uma reunião?',
      timestamp: '1 hora atrás',
      source: 'Email',
      priority: 'medium',
      hasOpportunity: false
    }
  ]);

  const [automationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Oportunidade Auto - Palavras-chave',
      trigger: 'Nova mensagem recebida',
      condition: 'Contém: "orçamento", "preço", "valor", "cotação"',
      action: 'Criar oportunidade automaticamente',
      isActive: true,
      executionCount: 12
    },
    {
      id: '2',
      name: 'Follow-up Automático',
      trigger: 'Oportunidade sem resposta',
      condition: 'Sem interação há 2 dias',
      action: 'Enviar mensagem de follow-up',
      isActive: true,
      executionCount: 8
    },
    {
      id: '3',
      name: 'Qualificação de Lead',
      trigger: 'Primeira interação',
      condition: 'Novo contato',
      action: 'Enviar questionário de qualificação',
      isActive: false,
      executionCount: 5
    },
    {
      id: '4',
      name: 'Lembrete de Proposta',
      trigger: 'Oportunidade em Proposta',
      condition: 'Há mais de 5 dias no estágio',
      action: 'Notificar vendedor + Agendar ligação',
      isActive: true,
      executionCount: 3
    }
  ]);

  const [isCreateOpportunityOpen, setIsCreateOpportunityOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [opportunityData, setOpportunityData] = useState({
    title: '',
    value: '',
    probability: '50',
    stage: 'qualification',
    description: ''
  });

  const handleCreateOpportunityFromChat = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setOpportunityData({
      title: `Oportunidade - ${conversation.contactName}`,
      value: '',
      probability: '50',
      stage: 'qualification',
      description: `Criada automaticamente a partir da conversa: "${conversation.lastMessage}"`
    });
    setIsCreateOpportunityOpen(true);
  };

  const handleConfirmCreateOpportunity = () => {
    if (!selectedConversation) return;

    // Simulação de criação da oportunidade
    showToast({
      variant: 'success',
      action: 'create',
      title: 'Oportunidade Criada',
      description: `${opportunityData.title} vinculada à conversa`
    });

    setIsCreateOpportunityOpen(false);
    setSelectedConversation(null);
  };

  const handleToggleAutomation = (ruleId: string) => {
    showToast({
      variant: 'success',
      title: 'Automação Atualizada',
      description: 'Status da regra foi alterado'
    });
  };

  const handleOpenInbox = (conversationId: string) => {
    // Navegação para inbox com conversa específica
    showToast({
      variant: 'info',
      title: 'Abrindo Conversa',
      description: 'Redirecionando para a caixa de entrada...'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'WhatsApp': return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'Email': return <Mail className="h-4 w-4 text-blue-600" />;
      case 'SMS': return <Phone className="h-4 w-4 text-orange-600" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header de Integração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-primary" />
            Integração CRM + Inbox
          </CardTitle>
          <CardDescription>
            Gerencie conversas e oportunidades de forma integrada com automações inteligentes
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Conversas Recentes com Potencial de Oportunidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Conversas com Potencial de Venda
            <Badge variant="secondary" className="ml-auto">
              {conversations.filter(c => !c.hasOpportunity).length} novas
            </Badge>
          </CardTitle>
          <CardDescription>
            Conversas recentes que podem ser convertidas em oportunidades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {conversations.map((conversation) => (
            <Card key={conversation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getSourceIcon(conversation.source)}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{conversation.contactName}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(conversation.priority)}`}
                        >
                          {conversation.priority}
                        </Badge>
                        {conversation.hasOpportunity && (
                          <Badge variant="default" className="text-xs">
                            <Target className="h-3 w-3 mr-1" />
                            {conversation.stage}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{conversation.contactPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleOpenInbox(conversation.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Abrir Chat
                    </Button>
                    {!conversation.hasOpportunity && (
                      <Button 
                        size="sm"
                        onClick={() => handleCreateOpportunityFromChat(conversation)}
                      >
                        <Target className="h-4 w-4 mr-1" />
                        Criar Oportunidade
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-foreground bg-muted/50 p-2 rounded">
                    "{conversation.lastMessage}"
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {conversation.timestamp}
                    </div>
                    {conversation.hasOpportunity && conversation.opportunityValue && (
                      <div className="flex items-center gap-1 text-success font-medium">
                        <DollarSign className="h-3 w-3" />
                        R$ {conversation.opportunityValue.toLocaleString('pt-BR')}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Automações Ativas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Automações Inteligentes
            <Badge variant="secondary" className="ml-auto">
              {automationRules.filter(rule => rule.isActive).length} ativas
            </Badge>
          </CardTitle>
          <CardDescription>
            Configure regras automáticas para otimizar seu processo de vendas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {automationRules.map((rule) => (
            <Card key={rule.id} className="border-l-4 border-l-primary/30">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-foreground">{rule.name}</h4>
                      <Badge variant={rule.isActive ? "default" : "secondary"}>
                        {rule.isActive ? (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Ativa
                          </>
                        ) : (
                          <>
                            <Pause className="h-3 w-3 mr-1" />
                            Pausada
                          </>
                        )}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><span className="font-medium">Gatilho:</span> {rule.trigger}</p>
                      <p><span className="font-medium">Condição:</span> {rule.condition}</p>
                      <p><span className="font-medium">Ação:</span> {rule.action}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        {rule.executionCount} execuções
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Últimos 30 dias
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant={rule.isActive ? "destructive" : "default"}
                      onClick={() => handleToggleAutomation(rule.id)}
                    >
                      {rule.isActive ? (
                        <>
                          <Pause className="h-4 w-4 mr-1" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Ativar
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {rule.isActive && (
                  <div className="mt-3 p-2 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Zap className="h-4 w-4" />
                      <span className="font-medium">Automação em execução</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Modal de Criação de Oportunidade */}
      <Dialog open={isCreateOpportunityOpen} onOpenChange={setIsCreateOpportunityOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Criar Oportunidade da Conversa</DialogTitle>
            <DialogDescription>
              Transforme esta conversa em uma oportunidade de venda
            </DialogDescription>
          </DialogHeader>

          {selectedConversation && (
            <div className="space-y-4">
              {/* Dados da Conversa */}
              <Card className="bg-muted/30">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    {getSourceIcon(selectedConversation.source)}
                    <span className="font-medium text-sm">{selectedConversation.contactName}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    "{selectedConversation.lastMessage}"
                  </p>
                </CardContent>
              </Card>

              {/* Formulário da Oportunidade */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="title">Título da Oportunidade</Label>
                  <Input
                    id="title"
                    value={opportunityData.title}
                    onChange={(e) => setOpportunityData(prev => ({...prev, title: e.target.value}))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="value">Valor Estimado (R$)</Label>
                    <Input
                      id="value"
                      type="number"
                      value={opportunityData.value}
                      onChange={(e) => setOpportunityData(prev => ({...prev, value: e.target.value}))}
                      placeholder="0,00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="probability">Probabilidade (%)</Label>
                    <Input
                      id="probability"
                      type="number"
                      min="0"
                      max="100"
                      value={opportunityData.probability}
                      onChange={(e) => setOpportunityData(prev => ({...prev, probability: e.target.value}))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="stage">Estágio Inicial</Label>
                  <Select value={opportunityData.stage} onValueChange={(value) => setOpportunityData(prev => ({...prev, stage: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qualification">Qualificação</SelectItem>
                      <SelectItem value="proposal">Proposta</SelectItem>
                      <SelectItem value="negotiation">Negociação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Observações</Label>
                  <Textarea
                    id="description"
                    value={opportunityData.description}
                    onChange={(e) => setOpportunityData(prev => ({...prev, description: e.target.value}))}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateOpportunityOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleConfirmCreateOpportunity}>
                  <Target className="h-4 w-4 mr-2" />
                  Criar Oportunidade
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};