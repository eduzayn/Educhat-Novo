import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target,
  Users,
  User,
  TrendingUp,
  Phone,
  DollarSign,
  Award,
  Calendar,
  Coins
} from "lucide-react";

interface ConfigureGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goalData: any) => void;
}

export const ConfigureGoalModal = ({ isOpen, onClose, onSave }: ConfigureGoalModalProps) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [goalData, setGoalData] = useState({
    title: '',
    description: '',
    type: 'team',
    indicator: '',
    target: '',
    period: 'monthly',
    teamId: '',
    userId: '',
    reward: ''
  });

  const teams = [
    { id: '1', name: 'Vendas', department: 'Comercial' },
    { id: '2', name: 'Suporte Técnico', department: 'Atendimento' },
    { id: '3', name: 'Relacionamento', department: 'Atendimento' },
    { id: '4', name: 'Análise Certificação', department: 'Qualidade' },
    { id: '5', name: 'Documentação', department: 'Qualidade' },
    { id: '6', name: 'Secretaria Pós', department: 'Administrativo' },
    { id: '7', name: 'Secretaria Segunda', department: 'Administrativo' },
    { id: '8', name: 'Cobrança', department: 'Financeiro' }
  ];

  const users = [
    { id: '1', name: 'Erick Moreira Pereira', team: 'Vendas' },
    { id: '2', name: 'Maria Silva', team: 'Relacionamento' },
    { id: '3', name: 'João Santos', team: 'Suporte Técnico' }
  ];

  const indicators = [
    { id: 'atendimentos', name: 'Atendimentos Realizados', icon: Phone, description: 'Número de atendimentos concluídos' },
    { id: 'vendas', name: 'Vendas Fechadas', icon: DollarSign, description: 'Quantidade de vendas realizadas' },
    { id: 'receita', name: 'Receita Gerada', icon: TrendingUp, description: 'Valor em reais de receita' },
    { id: 'certificacoes', name: 'Certificações', icon: Award, description: 'Número de certificações obtidas' },
    { id: 'chamados', name: 'Chamados Resolvidos', icon: Target, description: 'Tickets de suporte resolvidos' }
  ];

  const handleSave = () => {
    if (!goalData.title || !goalData.indicator || !goalData.target || !goalData.reward) {
      return;
    }

    if (goalData.type === 'team' && !goalData.teamId) return;
    if (goalData.type === 'individual' && !goalData.userId) return;

    onSave(goalData);
  };

  const resetForm = () => {
    setGoalData({
      title: '',
      description: '',
      type: 'team',
      indicator: '',
      target: '',
      period: 'monthly',
      teamId: '',
      userId: '',
      reward: ''
    });
    setActiveTab('basic');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Configurar Nova Meta
          </DialogTitle>
          <DialogDescription>
            Adicione uma nova meta para acompanhamento e gamificação
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="indicators">Indicadores</TabsTrigger>
            <TabsTrigger value="rewards">Recompensas</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Básicas</CardTitle>
                <CardDescription>Defina o tipo e escopo da meta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Tipo de Meta</Label>
                    <Select value={goalData.type} onValueChange={(value) => setGoalData(prev => ({...prev, type: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="team">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Para Equipe
                          </div>
                        </SelectItem>
                        <SelectItem value="individual">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Individual
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="period">Período</Label>
                    <Select value={goalData.period} onValueChange={(value) => setGoalData(prev => ({...prev, period: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Título da Meta</Label>
                  <Input
                    id="title"
                    value={goalData.title}
                    onChange={(e) => setGoalData(prev => ({...prev, title: e.target.value}))}
                    placeholder="Ex: Meta de Vendas - Janeiro 2024"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={goalData.description}
                    onChange={(e) => setGoalData(prev => ({...prev, description: e.target.value}))}
                    placeholder="Descreva os objetivos e detalhes da meta..."
                    rows={3}
                  />
                </div>

                {goalData.type === 'team' && (
                  <div>
                    <Label htmlFor="team">Selecionar Equipe/Setor</Label>
                    <Select value={goalData.teamId} onValueChange={(value) => setGoalData(prev => ({...prev, teamId: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha a equipe" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map(team => (
                          <SelectItem key={team.id} value={team.id}>
                            <div className="flex flex-col">
                              <span>{team.name}</span>
                              <span className="text-xs text-muted-foreground">{team.department}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {goalData.type === 'individual' && (
                  <div>
                    <Label htmlFor="user">Selecionar Usuário</Label>
                    <Select value={goalData.userId} onValueChange={(value) => setGoalData(prev => ({...prev, userId: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha o usuário" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex flex-col">
                              <span>{user.name}</span>
                              <span className="text-xs text-muted-foreground">{user.team}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="indicators" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Indicadores e Metas</CardTitle>
                <CardDescription>Escolha o que será medido e defina o objetivo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Indicador a ser Medido</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {indicators.map(indicator => (
                      <Card 
                        key={indicator.id} 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          goalData.indicator === indicator.id ? 'ring-2 ring-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setGoalData(prev => ({...prev, indicator: indicator.id}))}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <indicator.icon className="h-5 w-5 text-primary" />
                            <div>
                              <h4 className="font-medium">{indicator.name}</h4>
                              <p className="text-xs text-muted-foreground">{indicator.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="target">Valor da Meta</Label>
                  <Input
                    id="target"
                    type="number"
                    value={goalData.target}
                    onChange={(e) => setGoalData(prev => ({...prev, target: e.target.value}))}
                    placeholder="Ex: 50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Defina o número que deve ser atingido no período selecionado
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-warning" />
                  Sistema de Recompensas
                </CardTitle>
                <CardDescription>Configure as moedas virtuais como recompensa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="reward">Recompensa em Moedas 🪙</Label>
                  <Input
                    id="reward"
                    type="number"
                    value={goalData.reward}
                    onChange={(e) => setGoalData(prev => ({...prev, reward: e.target.value}))}
                    placeholder="Ex: 100"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Quantidade de moedas que será creditada ao atingir a meta
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Resumo da Meta</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tipo:</span>
                      <Badge variant={goalData.type === 'team' ? 'default' : 'secondary'}>
                        {goalData.type === 'team' ? 'Equipe' : 'Individual'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Período:</span>
                      <span className="capitalize">{goalData.period === 'monthly' ? 'Mensal' : goalData.period === 'weekly' ? 'Semanal' : 'Diário'}</span>
                    </div>
                    {goalData.indicator && (
                      <div className="flex justify-between">
                        <span>Indicador:</span>
                        <span>{indicators.find(i => i.id === goalData.indicator)?.name}</span>
                      </div>
                    )}
                    {goalData.target && (
                      <div className="flex justify-between">
                        <span>Meta:</span>
                        <span>{goalData.target}</span>
                      </div>
                    )}
                    {goalData.reward && (
                      <div className="flex justify-between">
                        <span>Recompensa:</span>
                        <span className="flex items-center gap-1">
                          🪙 {goalData.reward} moedas
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!goalData.title || !goalData.indicator || !goalData.target || !goalData.reward}>
            Salvar Meta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};