import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useElegantToast } from "@/components/ui/elegant-toast";
import { 
  Plus,
  Settings,
  Users,
  DollarSign,
  Headphones,
  Calculator,
  Calendar,
  Target,
  Edit,
  Trash2,
  Copy,
  Filter
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  color: string;
  icon: React.ElementType;
  description: string;
}

interface FunnelStage {
  id: string;
  name: string;
  color: string;
  order: number;
}

interface DepartmentFunnel {
  id: string;
  departmentId: string;
  stages: FunnelStage[];
  isDefault: boolean;
}

export const MultipleFunnels = () => {
  const { showToast } = useElegantToast();

  const [departments] = useState<Department[]>([
    {
      id: 'sales',
      name: 'Vendas',
      color: 'bg-blue-500',
      icon: Target,
      description: 'Processo comercial e fechamento de negócios'
    },
    {
      id: 'support',
      name: 'Suporte',
      color: 'bg-green-500',
      icon: Headphones,
      description: 'Atendimento ao cliente e resolução de problemas'
    },
    {
      id: 'administrative',
      name: 'Secretaria',
      color: 'bg-purple-500',
      icon: Calendar,
      description: 'Agendamentos, documentos e serviços administrativos'
    },
    {
      id: 'financial',
      name: 'Financeiro',
      color: 'bg-orange-500',
      icon: Calculator,
      description: 'Cobrança, faturamento e controle financeiro'
    }
  ]);

  const [funnels, setFunnels] = useState<DepartmentFunnel[]>([
    {
      id: 'sales_funnel',
      departmentId: 'sales',
      isDefault: true,
      stages: [
        { id: 'qualification', name: 'Qualificação', color: 'bg-yellow-500', order: 1 },
        { id: 'proposal', name: 'Proposta', color: 'bg-blue-500', order: 2 },
        { id: 'negotiation', name: 'Negociação', color: 'bg-orange-500', order: 3 },
        { id: 'closing', name: 'Fechamento', color: 'bg-green-500', order: 4 }
      ]
    },
    {
      id: 'support_funnel',
      departmentId: 'support',
      isDefault: true,
      stages: [
        { id: 'received', name: 'Recebido', color: 'bg-blue-500', order: 1 },
        { id: 'in_progress', name: 'Em Andamento', color: 'bg-yellow-500', order: 2 },
        { id: 'waiting_client', name: 'Aguardando Cliente', color: 'bg-orange-500', order: 3 },
        { id: 'resolved', name: 'Resolvido', color: 'bg-green-500', order: 4 }
      ]
    },
    {
      id: 'administrative_funnel',
      departmentId: 'administrative',
      isDefault: true,
      stages: [
        { id: 'request', name: 'Solicitação', color: 'bg-purple-400', order: 1 },
        { id: 'scheduling', name: 'Agendamento', color: 'bg-purple-500', order: 2 },
        { id: 'confirmed', name: 'Confirmado', color: 'bg-purple-600', order: 3 },
        { id: 'completed', name: 'Concluído', color: 'bg-green-500', order: 4 }
      ]
    },
    {
      id: 'financial_funnel',
      departmentId: 'financial',
      isDefault: true,
      stages: [
        { id: 'pending', name: 'Pendente', color: 'bg-red-400', order: 1 },
        { id: 'billing', name: 'Em Cobrança', color: 'bg-orange-500', order: 2 },
        { id: 'negotiating', name: 'Negociação', color: 'bg-yellow-500', order: 3 },
        { id: 'paid', name: 'Pago', color: 'bg-green-500', order: 4 }
      ]
    }
  ]);

  const [selectedDepartment, setSelectedDepartment] = useState('sales');
  const [isNewFunnelOpen, setIsNewFunnelOpen] = useState(false);
  const [isEditStagesOpen, setIsEditStagesOpen] = useState(false);
  const [editingFunnel, setEditingFunnel] = useState<DepartmentFunnel | null>(null);

  const getCurrentFunnel = () => {
    return funnels.find(f => f.departmentId === selectedDepartment && f.isDefault);
  };

  const getCurrentDepartment = () => {
    return departments.find(d => d.id === selectedDepartment);
  };

  const handleCreateCustomFunnel = (departmentId: string) => {
    const department = departments.find(d => d.id === departmentId);
    const defaultFunnel = funnels.find(f => f.departmentId === departmentId && f.isDefault);
    
    if (!department || !defaultFunnel) return;

    const newFunnel: DepartmentFunnel = {
      id: `${departmentId}_custom_${Date.now()}`,
      departmentId,
      isDefault: false,
      stages: [...defaultFunnel.stages.map(s => ({...s, id: `${s.id}_${Date.now()}`}))]
    };

    setFunnels(prev => [...prev, newFunnel]);
    setEditingFunnel(newFunnel);
    setIsEditStagesOpen(true);

    showToast({
      variant: 'success',
      action: 'create',
      title: 'Funil Personalizado',
      description: `Funil customizado criado para ${department.name}`
    });
  };

  const handleEditStages = (funnel: DepartmentFunnel) => {
    setEditingFunnel({...funnel});
    setIsEditStagesOpen(true);
  };

  const handleSaveStages = () => {
    if (!editingFunnel) return;

    setFunnels(prev => 
      prev.map(f => 
        f.id === editingFunnel.id ? editingFunnel : f
      )
    );

    showToast({
      variant: 'success',
      action: 'update',
      title: 'Funil Atualizado',
      description: 'Estágios salvos com sucesso'
    });

    setIsEditStagesOpen(false);
    setEditingFunnel(null);
  };

  const handleAddStage = () => {
    if (!editingFunnel) return;

    const newStage: FunnelStage = {
      id: `stage_${Date.now()}`,
      name: 'Novo Estágio',
      color: 'bg-gray-500',
      order: editingFunnel.stages.length + 1
    };

    setEditingFunnel({
      ...editingFunnel,
      stages: [...editingFunnel.stages, newStage]
    });
  };

  const handleDeleteStage = (stageId: string) => {
    if (!editingFunnel) return;

    setEditingFunnel({
      ...editingFunnel,
      stages: editingFunnel.stages.filter(s => s.id !== stageId)
    });
  };

  const handleUpdateStage = (stageId: string, field: string, value: string) => {
    if (!editingFunnel) return;

    setEditingFunnel({
      ...editingFunnel,
      stages: editingFunnel.stages.map(s => 
        s.id === stageId ? {...s, [field]: value} : s
      )
    });
  };

  const currentFunnel = getCurrentFunnel();
  const currentDepartment = getCurrentDepartment();

  return (
    <div className="space-y-6">
      {/* Header com Seletor de Departamento */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Configuração de Funis
          </h2>
          <p className="text-muted-foreground">Gerencie funis específicos por departamento</p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => {
                const IconComponent = dept.icon;
                return (
                  <SelectItem key={dept.id} value={dept.id}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      {dept.name}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Button onClick={() => handleCreateCustomFunnel(selectedDepartment)}>
            <Plus className="h-4 w-4 mr-2" />
            Funil Customizado
          </Button>
        </div>
      </div>

      {/* Overview dos Departamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {departments.map((dept) => {
          const IconComponent = dept.icon;
          const deptFunnels = funnels.filter(f => f.departmentId === dept.id);
          
          return (
            <Card 
              key={dept.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedDepartment === dept.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedDepartment(dept.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 ${dept.color} rounded-lg`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{dept.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {deptFunnels.length} funil(is)
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{dept.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Configuração do Funil Atual */}
      {currentFunnel && currentDepartment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <currentDepartment.icon className="h-5 w-5 text-primary" />
              Funil: {currentDepartment.name}
              {currentFunnel.isDefault && (
                <Badge variant="default" className="text-xs">Padrão</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Configure os estágios do processo para {currentDepartment.description.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Estágios Atuais */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentFunnel.stages.map((stage, index) => (
                  <Card key={stage.id} className="border-l-4 border-l-primary/30">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                        <span className="font-medium text-sm">{stage.name}</span>
                        <Badge variant="outline" className="text-xs ml-auto">
                          {index + 1}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Estágio {stage.order} do processo
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Ações */}
              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => handleEditStages(currentFunnel)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Estágios
                </Button>
                
                {!currentFunnel.isDefault && (
                  <Button variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar Funil
                  </Button>
                )}

                <Button variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  Métricas do Funil
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Todos os Funis do Departamento */}
      <Card>
        <CardHeader>
          <CardTitle>Funis Configurados - {currentDepartment?.name}</CardTitle>
          <CardDescription>
            Todos os funis disponíveis para este departamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {funnels
              .filter(f => f.departmentId === selectedDepartment)
              .map((funnel) => (
              <Card key={funnel.id} className="border-l-4 border-l-primary/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-foreground">
                          Funil {currentDepartment?.name}
                        </h4>
                        {funnel.isDefault && (
                          <Badge variant="default" className="text-xs">Padrão</Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {funnel.stages.length} estágios
                        </Badge>
                      </div>
                      
                      <div className="flex gap-1">
                        {funnel.stages.map((stage) => (
                          <div
                            key={stage.id}
                            className={`w-4 h-2 rounded-sm ${stage.color}`}
                            title={stage.name}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditStages(funnel)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      
                      {!funnel.isDefault && (
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição de Estágios */}
      <Dialog open={isEditStagesOpen} onOpenChange={setIsEditStagesOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Editar Estágios do Funil</DialogTitle>
            <DialogDescription>
              Configure os estágios do processo para {currentDepartment?.name}
            </DialogDescription>
          </DialogHeader>

          {editingFunnel && (
            <div className="space-y-4">
              <div className="grid gap-4">
                {editingFunnel.stages.map((stage, index) => (
                  <div key={stage.id} className="grid grid-cols-12 gap-3 items-center p-3 border rounded-lg">
                    <div className="col-span-1 text-center">
                      <Badge variant="outline">{index + 1}</Badge>
                    </div>
                    
                    <div className="col-span-4">
                      <Input
                        value={stage.name}
                        onChange={(e) => handleUpdateStage(stage.id, 'name', e.target.value)}
                        placeholder="Nome do estágio"
                      />
                    </div>
                    
                    <div className="col-span-3">
                      <Select 
                        value={stage.color} 
                        onValueChange={(value) => handleUpdateStage(stage.id, 'color', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bg-gray-500">Cinza</SelectItem>
                          <SelectItem value="bg-blue-500">Azul</SelectItem>
                          <SelectItem value="bg-green-500">Verde</SelectItem>
                          <SelectItem value="bg-yellow-500">Amarelo</SelectItem>
                          <SelectItem value="bg-orange-500">Laranja</SelectItem>
                          <SelectItem value="bg-red-500">Vermelho</SelectItem>
                          <SelectItem value="bg-purple-500">Roxo</SelectItem>
                          <SelectItem value="bg-pink-500">Rosa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="col-span-2">
                      <div className={`w-8 h-8 rounded ${stage.color} mx-auto`} />
                    </div>
                    
                    <div className="col-span-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteStage(stage.id)}
                        disabled={editingFunnel.stages.length <= 2}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={handleAddStage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Estágio
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditStagesOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveStages}>
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};