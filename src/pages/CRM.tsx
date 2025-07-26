import React, { useState, useCallback } from "react";
import { format } from "date-fns";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useElegantToast } from "@/components/ui/elegant-toast";
import { CRMIntegration } from "@/components/crm/CRMIntegration";
import { AutomationEngine } from "@/components/crm/AutomationEngine";
import { MultipleFunnels } from "@/components/crm/MultipleFunnels";
import { AdvancedAnalytics } from "@/components/crm/AdvancedAnalytics";
import { 
  Users, 
  Plus, 
  DollarSign, 
  Target, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  Phone, 
  Mail, 
  MessageSquare,
  MoreHorizontal,
  Filter,
  Eye,
  Edit,
  Trash2,
  Copy,
  Clock,
  Building,
  User,
  Star,
  Zap,
  BarChart3,
  Bot,
  Workflow,
  CalendarDays
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

interface Opportunity {
  id: string;
  title: string;
  company: string;
  contact: string;
  value: number;
  probability: number;
  stage: string;
  dueDate: string;
  description: string;
  lastActivity: string;
  source: string;
  tags: string[];
  assignedTo: string; // Responsável pela oportunidade
  assignedToName: string; // Nome do responsável
}

interface Stage {
  id: string;
  name: string;
  color: string;
  count: number;
}

const CRM = () => {
  const { showToast } = useElegantToast();
  
  const [stages, setStages] = useState<Stage[]>([
    { id: 'qualification', name: 'Qualificação', color: 'bg-yellow-500', count: 3 },
    { id: 'proposal', name: 'Proposta', color: 'bg-blue-500', count: 2 },
    { id: 'negotiation', name: 'Negociação', color: 'bg-orange-500', count: 1 },
    { id: 'closing', name: 'Fechamento', color: 'bg-green-500', count: 1 }
  ]);

  const [activeDepartment, setActiveDepartment] = useState('sales');
  const [availableFunnels, setAvailableFunnels] = useState([
    { id: 'sales_funnel', name: 'Vendas - Padrão', departmentId: 'sales' },
    { id: 'support_funnel', name: 'Suporte - Padrão', departmentId: 'support' },
    { id: 'administrative_funnel', name: 'Secretaria - Padrão', departmentId: 'administrative' },
    { id: 'financial_funnel', name: 'Financeiro - Padrão', departmentId: 'financial' }
  ]);
  const [selectedFunnelId, setSelectedFunnelId] = useState('sales_funnel');
  const [currentUser] = useState({ id: 'user1', name: 'João Silva' }); // Usuário logado
  const [showOnlyMyOpportunities, setShowOnlyMyOpportunities] = useState(false);
  const [dateFilter, setDateFilter] = useState<{from: Date | undefined; to: Date | undefined}>({
    from: undefined,
    to: undefined
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: '1',
      title: 'Automação Residencial - Silva',
      company: 'Silva & Associados',
      contact: 'Maria Silva',
      value: 15000,
      probability: 70,
      stage: 'qualification',
      dueDate: '2024-02-14',
      description: 'Sistema completo de automação residencial para casa de alto padrão',
      lastActivity: '2 horas atrás',
      source: 'WhatsApp',
      tags: ['Urgente', 'VIP'],
      assignedTo: 'user1',
      assignedToName: 'João Silva'
    },
    {
      id: '2',
      title: 'Sistema Completo - XYZ Corp',
      company: 'XYZ Corporation',
      contact: 'João Santos',
      value: 25000,
      probability: 50,
      stage: 'proposal',
      dueDate: '2024-02-27',
      description: 'Implementação de sistema empresarial completo',
      lastActivity: '1 dia atrás',
      source: 'E-mail',
      tags: ['Corporativo'],
      assignedTo: 'user2',
      assignedToName: 'Maria Costa'
    },
    {
      id: '3',
      title: 'Upgrade Sistema - ABC Ltd',
      company: 'ABC Limited',
      contact: 'Ana Costa',
      value: 8000,
      probability: 90,
      stage: 'negotiation',
      dueDate: '2024-02-10',
      description: 'Atualização e melhorias no sistema existente',
      lastActivity: '3 horas atrás',
      source: 'Telefone',
      tags: ['Cliente Existente'],
      assignedTo: 'user1',
      assignedToName: 'João Silva'
    }
  ]);

  const [isNewOpportunityOpen, setIsNewOpportunityOpen] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    title: '',
    company: '',
    contact: '',
    value: '',
    probability: '',
    stage: 'qualification',
    dueDate: '',
    description: '',
    source: '',
    tags: '',
    assignedTo: '',
    assignedToName: '',
    funnelId: 'sales_funnel' // Funil padrão
  });

  const [filter, setFilter] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');

  const handleFunnelChange = (departmentId: string, funnelId: string, funnelStages: any[]) => {
    setActiveDepartment(departmentId);
    setSelectedFunnelId(funnelId);
    setStages(funnelStages.map(stage => ({
      id: stage.id,
      name: stage.name,
      color: stage.color,
      count: getOpportunitiesByStage(stage.id).length
    })));
    
    // Atualizar lista de funis disponíveis
    setAvailableFunnels(prev => {
      const exists = prev.some(f => f.id === funnelId);
      if (!exists) {
        const department = getDepartmentName(departmentId);
        return [...prev, { id: funnelId, name: `${department} - Customizado`, departmentId }];
      }
      return prev;
    });
  };

  const getDepartmentName = (departmentId: string) => {
    const names: {[key: string]: string} = {
      'sales': 'Vendas',
      'support': 'Suporte', 
      'administrative': 'Secretaria',
      'financial': 'Financeiro'
    };
    return names[departmentId] || departmentId;
  };

  const handleFunnelSelect = (funnelId: string) => {
    setSelectedFunnelId(funnelId);
    const funnel = availableFunnels.find(f => f.id === funnelId);
    if (funnel) {
      setActiveDepartment(funnel.departmentId);
      // Aqui você pode carregar os estágios do funil selecionado
      // Por enquanto, vamos manter os estágios padrão
    }
  };

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    setOpportunities(prev => 
      prev.map(opp => 
        opp.id === draggableId 
          ? { ...opp, stage: destination.droppableId }
          : opp
      )
    );

    showToast({
      variant: 'success',
      title: 'Oportunidade Movida',
      description: 'Estágio atualizado com sucesso!'
    });
  }, [showToast]);

  const handleCreateOpportunity = () => {
    if (!newOpportunity.title || !newOpportunity.company) {
      showToast({
        variant: 'error',
        title: 'Campos Obrigatórios',
        description: 'Preencha pelo menos o título e empresa'
      });
      return;
    }

    const opportunity: Opportunity = {
      id: Date.now().toString(),
      title: newOpportunity.title,
      company: newOpportunity.company,
      contact: newOpportunity.contact,
      value: Number(newOpportunity.value) || 0,
      probability: Number(newOpportunity.probability) || 0,
      stage: newOpportunity.stage,
      dueDate: newOpportunity.dueDate,
      description: newOpportunity.description,
      lastActivity: 'Agora',
      source: newOpportunity.source,
      tags: newOpportunity.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      assignedTo: newOpportunity.assignedTo || currentUser.id,
      assignedToName: newOpportunity.assignedToName || currentUser.name
    };

    setOpportunities(prev => [...prev, opportunity]);
    setNewOpportunity({
      title: '', company: '', contact: '', value: '', probability: '',
      stage: 'qualification', dueDate: '', description: '', source: '', tags: '',
      assignedTo: '', assignedToName: '', funnelId: 'sales_funnel'
    });
    setIsNewOpportunityOpen(false);

    showToast({
      variant: 'success',
      action: 'create',
      title: 'Oportunidade Criada',
      description: `${opportunity.title} foi adicionada ao pipeline`
    });
  };

  const handleDuplicateOpportunity = (opportunity: Opportunity) => {
    const duplicated = {
      ...opportunity,
      id: Date.now().toString(),
      title: `${opportunity.title} (Cópia)`,
      lastActivity: 'Agora'
    };
    setOpportunities(prev => [...prev, duplicated]);
    
    showToast({
      variant: 'success',
      action: 'duplicate',
      title: 'Oportunidade Duplicada',
      description: `${duplicated.title} foi criada`
    });
  };

  const handleDeleteOpportunity = (id: string) => {
    const opportunity = opportunities.find(opp => opp.id === id);
    setOpportunities(prev => prev.filter(opp => opp.id !== id));
    
    showToast({
      variant: 'success',
      action: 'delete',
      title: 'Oportunidade Removida',
      description: `${opportunity?.title} foi excluída`
    });
  };

  const getOpportunitiesByStage = (stageId: string) => {
    return opportunities.filter(opp => opp.stage === stageId);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPipelineTotal = () => {
    return opportunities.reduce((total, opp) => total + opp.value, 0);
  };

  const getAverageTicket = () => {
    return opportunities.length > 0 ? getPipelineTotal() / opportunities.length : 0;
  };

  const getConversionRate = () => {
    const total = opportunities.length;
    const won = opportunities.filter(opp => opp.stage === 'closing').length;
    return total > 0 ? Math.round((won / total) * 100) : 0;
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesFilter = filter === '' || 
      opp.title.toLowerCase().includes(filter.toLowerCase()) ||
      opp.company.toLowerCase().includes(filter.toLowerCase());
    
    const matchesStage = selectedStage === 'all' || opp.stage === selectedStage;
    const matchesUser = !showOnlyMyOpportunities || opp.assignedTo === currentUser.id;
    
    // Filtro por período
    const matchesDateFilter = (() => {
      if (!dateFilter.from && !dateFilter.to) return true;
      
      const oppDate = new Date(opp.dueDate);
      
      if (dateFilter.from && dateFilter.to) {
        return oppDate >= dateFilter.from && oppDate <= dateFilter.to;
      } else if (dateFilter.from) {
        return oppDate >= dateFilter.from;
      } else if (dateFilter.to) {
        return oppDate <= dateFilter.to;
      }
      
      return true;
    })();
    
    return matchesFilter && matchesStage && matchesUser && matchesDateFilter;
  });

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex-none border-b bg-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Target className="h-8 w-8 text-primary" />
                CRM Avançado
              </h1>
              <p className="text-muted-foreground">Gerencie oportunidades, automações e integrações</p>
            </div>

            <Dialog open={isNewOpportunityOpen} onOpenChange={setIsNewOpportunityOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Oportunidade
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nova Oportunidade</DialogTitle>
                  <DialogDescription>
                    Adicione uma nova oportunidade ao seu pipeline
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  {/* Seletor de Funil */}
                  <div>
                    <Label htmlFor="funnel">Funil *</Label>
                    <Select value={newOpportunity.funnelId} onValueChange={(value) => setNewOpportunity(prev => ({...prev, funnelId: value}))}>
                      <SelectTrigger>
                        <Target className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Selecione o funil" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFunnels.map(funnel => (
                          <SelectItem key={funnel.id} value={funnel.id}>
                            {funnel.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Título *</Label>
                      <Input
                        id="title"
                        value={newOpportunity.title}
                        onChange={(e) => setNewOpportunity(prev => ({...prev, title: e.target.value}))}
                        placeholder="Nome da oportunidade"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Empresa *</Label>
                      <Input
                        id="company"
                        value={newOpportunity.company}
                        onChange={(e) => setNewOpportunity(prev => ({...prev, company: e.target.value}))}
                        placeholder="Nome da empresa"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact">Contato</Label>
                      <Input
                        id="contact"
                        value={newOpportunity.contact}
                        onChange={(e) => setNewOpportunity(prev => ({...prev, contact: e.target.value}))}
                        placeholder="Nome do contato"
                      />
                    </div>
                    <div>
                      <Label htmlFor="value">Valor (R$)</Label>
                      <Input
                        id="value"
                        type="number"
                        value={newOpportunity.value}
                        onChange={(e) => setNewOpportunity(prev => ({...prev, value: e.target.value}))}
                        placeholder="0,00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="probability">Probabilidade (%)</Label>
                      <Input
                        id="probability"
                        type="number"
                        min="0"
                        max="100"
                        value={newOpportunity.probability}
                        onChange={(e) => setNewOpportunity(prev => ({...prev, probability: e.target.value}))}
                        placeholder="70"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stage">Estágio</Label>
                      <Select value={newOpportunity.stage} onValueChange={(value) => setNewOpportunity(prev => ({...prev, stage: value}))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {stages.map(stage => (
                            <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Data Prevista</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newOpportunity.dueDate}
                        onChange={(e) => setNewOpportunity(prev => ({...prev, dueDate: e.target.value}))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="source">Origem</Label>
                      <Select value={newOpportunity.source} onValueChange={(value) => setNewOpportunity(prev => ({...prev, source: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a origem" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                          <SelectItem value="E-mail">E-mail</SelectItem>
                          <SelectItem value="Telefone">Telefone</SelectItem>
                          <SelectItem value="Site">Site</SelectItem>
                          <SelectItem value="Indicação">Indicação</SelectItem>
                          <SelectItem value="Redes Sociais">Redes Sociais</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                      <Input
                        id="tags"
                        value={newOpportunity.tags}
                        onChange={(e) => setNewOpportunity(prev => ({...prev, tags: e.target.value}))}
                        placeholder="VIP, Urgente, Corporativo"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={newOpportunity.description}
                      onChange={(e) => setNewOpportunity(prev => ({...prev, description: e.target.value}))}
                      placeholder="Descreva os detalhes da oportunidade..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsNewOpportunityOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateOpportunity}>
                    Criar Oportunidade
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pipeline Total</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(getPipelineTotal())}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Oportunidades</p>
                    <p className="text-2xl font-bold text-foreground">{opportunities.length}</p>
                  </div>
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ticket Médio</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(getAverageTicket())}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                    <p className="text-2xl font-bold text-foreground">{getConversionRate()}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal com Tabs */}
      <div className="flex-1 p-6">
        <Tabs defaultValue="kanban" className="h-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Pipeline Kanban
            </TabsTrigger>
            <TabsTrigger value="funnels" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Configurar Funis
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              Integração Inbox
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Automações
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="h-full">{" "}
            <div className="h-full">
              {/* Filtros */}
              <div className="flex gap-4 mb-6 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Buscar oportunidades..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                
                {/* Filtro de Período */}
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[200px] justify-start text-left font-normal"
                      >
                        <CalendarDays className="h-4 w-4 mr-2" />
                        {dateFilter.from ? (
                          dateFilter.to ? (
                            <>
                              {format(dateFilter.from, "dd/MM/yy")} -{" "}
                              {format(dateFilter.to, "dd/MM/yy")}
                            </>
                          ) : (
                            format(dateFilter.from, "dd/MM/yyyy")
                          )
                        ) : (
                          <span>Período</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateFilter.from}
                        selected={dateFilter}
                        onSelect={(range) => setDateFilter({
                          from: range?.from,
                          to: range?.to
                        })}
                        numberOfMonths={2}
                        className="pointer-events-auto"
                      />
                      <div className="p-3 border-t">
                        <Button
                          variant="outline"
                          onClick={() => setDateFilter({ from: undefined, to: undefined })}
                          className="w-full"
                        >
                          Limpar filtro
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Filtro "Minhas Oportunidades" */}
                <div className="flex items-center gap-2 px-3 py-2 border rounded-md">
                  <Switch
                    id="my-opportunities"
                    checked={showOnlyMyOpportunities}
                    onCheckedChange={setShowOnlyMyOpportunities}
                  />
                  <Label htmlFor="my-opportunities" className="text-sm font-medium">
                    Minhas Oportunidades
                  </Label>
                </div>
                
                {/* Seletor de Funil */}
                <Select value={selectedFunnelId} onValueChange={handleFunnelSelect}>
                  <SelectTrigger className="w-64">
                    <Target className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Selecione o funil" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFunnels.map(funnel => (
                      <SelectItem key={funnel.id} value={funnel.id}>
                        {funnel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedStage} onValueChange={setSelectedStage}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Estágios</SelectItem>
                    {stages.map(stage => (
                      <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Kanban Board */}
              <div className="overflow-x-auto">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <div className="grid grid-cols-4 gap-6 min-w-max">
                    {stages.map((stage) => (
                      <div key={stage.id} className="min-w-80">
                        <div className="flex items-center gap-2 mb-4">
                          <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                          <h3 className="font-semibold text-foreground">{stage.name}</h3>
                          <Badge variant="secondary" className="ml-auto">
                            {filteredOpportunities.filter(opp => opp.stage === stage.id).length}
                          </Badge>
                        </div>

                        <Droppable droppableId={stage.id}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`space-y-3 min-h-96 p-2 rounded-lg transition-colors ${
                                snapshot.isDraggingOver ? 'bg-muted/50' : 'bg-muted/20'
                              }`}
                            >
                              {filteredOpportunities.filter(opp => opp.stage === stage.id).map((opportunity, index) => (
                                <Draggable key={opportunity.id} draggableId={opportunity.id} index={index}>
                                  {(provided, snapshot) => (
                                    <Card
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`cursor-move transition-all hover:shadow-md ${
                                        snapshot.isDragging ? 'shadow-lg rotate-2 scale-105' : ''
                                      }`}
                                    >
                                      <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <CardTitle className="text-sm font-medium line-clamp-2">
                                              {opportunity.title}
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-1 mt-1">
                                              <Building className="h-3 w-3" />
                                              {opportunity.company}
                                            </CardDescription>
                                          </div>
                                          
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                              <DropdownMenuItem>
                                                <Eye className="h-4 w-4 mr-2" />
                                                Visualizar
                                              </DropdownMenuItem>
                                              <DropdownMenuItem>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Editar
                                              </DropdownMenuItem>
                                              <DropdownMenuItem onClick={() => handleDuplicateOpportunity(opportunity)}>
                                                <Copy className="h-4 w-4 mr-2" />
                                                Duplicar
                                              </DropdownMenuItem>
                                              <DropdownMenuItem 
                                                onClick={() => handleDeleteOpportunity(opportunity.id)}
                                                className="text-destructive"
                                              >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Excluir
                                              </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </div>
                                      </CardHeader>

                                      <CardContent className="pt-0 space-y-3">
                                        <div className="flex items-center justify-between">
                                          <span className="text-lg font-bold text-success">
                                            {formatCurrency(opportunity.value)}
                                          </span>
                                          <Badge variant="outline" className="text-xs">
                                            {opportunity.probability}%
                                          </Badge>
                                        </div>

                                        {opportunity.contact && (
                                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <User className="h-3 w-3" />
                                            {opportunity.contact}
                                          </div>
                                        )}

                                         {opportunity.dueDate && (
                                           <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                             <CalendarIcon className="h-3 w-3" />
                                             {new Date(opportunity.dueDate).toLocaleDateString('pt-BR')}
                                           </div>
                                         )}

                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                          <Clock className="h-3 w-3" />
                                          {opportunity.lastActivity}
                                        </div>

                                        {opportunity.source && (
                                          <div className="flex items-center gap-1">
                                            {opportunity.source === 'WhatsApp' && <MessageSquare className="h-3 w-3 text-green-600" />}
                                            {opportunity.source === 'E-mail' && <Mail className="h-3 w-3 text-blue-600" />}
                                            {opportunity.source === 'Telefone' && <Phone className="h-3 w-3 text-orange-600" />}
                                            <span className="text-xs text-muted-foreground">{opportunity.source}</span>
                                          </div>
                                        )}

                                        {opportunity.tags.length > 0 && (
                                          <div className="flex flex-wrap gap-1">
                                            {opportunity.tags.slice(0, 2).map((tag, idx) => (
                                              <Badge key={idx} variant="secondary" className="text-xs px-1 py-0">
                                                {tag}
                                              </Badge>
                                            ))}
                                            {opportunity.tags.length > 2 && (
                                              <Badge variant="secondary" className="text-xs px-1 py-0">
                                                +{opportunity.tags.length - 2}
                                              </Badge>
                                            )}
                                          </div>
                                        )}

                                        <div className="flex gap-1 pt-2">
                                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                                            <MessageSquare className="h-3 w-3 mr-1" />
                                            Chat
                                          </Button>
                                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                                            <Phone className="h-3 w-3 mr-1" />
                                            Ligar
                                          </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    ))}
                  </div>
                </DragDropContext>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="funnels" className="h-full">
            <MultipleFunnels onFunnelChange={handleFunnelChange} />
          </TabsContent>

          <TabsContent value="integration" className="h-full">
            <CRMIntegration />
          </TabsContent>

          <TabsContent value="automation" className="h-full">
            <AutomationEngine />
          </TabsContent>

          <TabsContent value="analytics" className="h-full">{" "}
            <AdvancedAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CRM;