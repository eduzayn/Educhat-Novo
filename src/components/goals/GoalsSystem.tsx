import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useElegantToast } from "@/components/ui/elegant-toast";
import { ConfigureGoalModal } from "./ConfigureGoalModal";
import { RewardsModal } from "./RewardsModal";
import { GoalAchievedModal } from "./GoalAchievedModal";
import { 
  Target,
  Trophy,
  Coins,
  TrendingUp,
  Plus,
  Settings,
  Award,
  Users,
  User,
  Crown,
  Zap,
  Calendar,
  CheckCircle
} from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'team';
  indicator: string;
  target: number;
  period: 'daily' | 'weekly' | 'monthly';
  teamId?: string;
  userId?: string;
  reward: number;
  isActive: boolean;
  progress: number;
  achieved: boolean;
}

interface Team {
  id: string;
  name: string;
  department: string;
  activeGoals: number;
  completedGoals: number;
  totalCoins: number;
  progress: number;
  status: 'completed' | 'in_progress' | 'no_goals';
}

interface User {
  id: string;
  name: string;
  team: string;
  position: number;
  coins: number;
  completedGoals: number;
  avatar?: string;
}

export const GoalsSystem = () => {
  const { showToast } = useElegantToast();
  
  const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [achievedGoal, setAchievedGoal] = useState<Goal | null>(null);
  
  // Mock data
  const [summaryStats] = useState({
    activeGoals: 12,
    completedGoals: 8,
    distributedCoins: 2400,
    engagementRate: 78
  });

  const [teams] = useState<Team[]>([
    {
      id: '1',
      name: 'Vendas',
      department: 'Comercial',
      activeGoals: 1,
      completedGoals: 2,
      totalCoins: 500,
      progress: 85,
      status: 'completed'
    },
    {
      id: '2', 
      name: 'Suporte Técnico',
      department: 'Atendimento',
      activeGoals: 0,
      completedGoals: 0,
      totalCoins: 0,
      progress: 0,
      status: 'no_goals'
    },
    {
      id: '3',
      name: 'Relacionamento',
      department: 'Atendimento',
      activeGoals: 1,
      completedGoals: 0,
      totalCoins: 0,
      progress: 35,
      status: 'in_progress'
    },
    {
      id: '4',
      name: 'Análise Certificação',
      department: 'Qualidade',
      activeGoals: 0,
      completedGoals: 0,
      totalCoins: 0,
      progress: 0,
      status: 'no_goals'
    },
    {
      id: '5',
      name: 'Documentação',
      department: 'Qualidade',
      activeGoals: 0,
      completedGoals: 0,
      totalCoins: 0,
      progress: 0,
      status: 'no_goals'
    },
    {
      id: '6',
      name: 'Secretaria Pós',
      department: 'Administrativo',
      activeGoals: 0,
      completedGoals: 0,
      totalCoins: 0,
      progress: 0,
      status: 'no_goals'
    },
    {
      id: '7',
      name: 'Secretaria Segunda',
      department: 'Administrativo',
      activeGoals: 0,
      completedGoals: 0,
      totalCoins: 0,
      progress: 0,
      status: 'no_goals'
    },
    {
      id: '8',
      name: 'Cobrança',
      department: 'Financeiro',
      activeGoals: 0,
      completedGoals: 0,
      totalCoins: 0,
      progress: 0,
      status: 'no_goals'
    }
  ]);

  const [ranking] = useState<User[]>([
    {
      id: '1',
      name: 'Erick Moreira Pereira',
      team: 'Vendas',
      position: 1,
      coins: 500,
      completedGoals: 2
    },
    {
      id: '2',
      name: 'Maria Silva',
      team: 'Relacionamento',
      position: 2,
      coins: 300,
      completedGoals: 1
    },
    {
      id: '3',
      name: 'João Santos',
      team: 'Suporte',
      position: 3,
      coins: 200,
      completedGoals: 1
    }
  ]);

  const getStatusBadge = (status: Team['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 text-white">Concluída</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500 text-white">Em andamento</Badge>;
      case 'no_goals':
        return <Badge variant="secondary">Sem metas</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getGoalText = (activeGoals: number) => {
    if (activeGoals === 0) return "Nenhuma meta";
    if (activeGoals === 1) return "1 meta ativa";
    return `${activeGoals} metas ativas`;
  };

  const handleCreateGoal = (goalData: any) => {
    showToast({
      variant: 'success',
      title: 'Meta Criada',
      description: 'Nova meta configurada com sucesso!'
    });
    setIsConfigureModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            Metas & Engajamento
          </h1>
          <p className="text-muted-foreground">Sistema de gamificação e acompanhamento de metas</p>
        </div>

        <Button onClick={() => setIsConfigureModalOpen(true)} className="bg-primary hover:bg-primary-hover">
          <Plus className="h-4 w-4 mr-2" />
          Configurar Metas
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Metas Ativas</p>
                <p className="text-2xl font-bold text-foreground">{summaryStats.activeGoals}</p>
                <p className="text-xs text-muted-foreground">4 metas configuradas</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Metas Concluídas</p>
                <p className="text-2xl font-bold text-foreground">{summaryStats.completedGoals}</p>
                <p className="text-xs text-muted-foreground">Este mês</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Moedas Distribuídas</p>
                <p className="text-2xl font-bold text-foreground flex items-center gap-1">
                  🪙 {summaryStats.distributedCoins.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total acumulado</p>
              </div>
              <Coins className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Engajamento</p>
                <p className="text-2xl font-bold text-foreground">{summaryStats.engagementRate}%</p>
                <p className="text-xs text-muted-foreground">Taxa de conclusão</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="teams" className="space-y-4">
        <TabsList>
          <TabsTrigger value="teams">Resumo por Equipes</TabsTrigger>
          <TabsTrigger value="ranking">Ranking do Mês</TabsTrigger>
        </TabsList>

        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle>Resumo por Equipes</CardTitle>
              <CardDescription>Acompanhamento de metas por departamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teams.map((team) => (
                  <div key={team.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{team.name}</h3>
                      <p className="text-sm text-muted-foreground">{team.department}</p>
                    </div>
                    
                    <div className="flex-1 text-center">
                      <p className="text-sm font-medium text-primary">
                        {getGoalText(team.activeGoals)}
                      </p>
                    </div>
                    
                    <div className="flex-1">
                      {team.progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progresso</span>
                            <span>{team.progress}%</span>
                          </div>
                          <Progress value={team.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-lg">🪙</span>
                        <span className="font-medium">{team.totalCoins}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 text-right">
                      {getStatusBadge(team.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ranking">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-warning" />
                  Ranking do Mês
                </CardTitle>
                <CardDescription>Classificação dos colaboradores por moedas conquistadas</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setIsRewardsModalOpen(true)}>
                <Award className="h-4 w-4 mr-2" />
                Ver Recompensas
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ranking.map((user) => (
                  <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      {user.position === 1 && <Crown className="h-4 w-4 text-warning" />}
                      {user.position === 2 && <Award className="h-4 w-4 text-slate-400" />}
                      {user.position === 3 && <Award className="h-4 w-4 text-amber-600" />}
                      {user.position > 3 && <span className="text-sm font-medium">{user.position}</span>}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.team}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Moedas do Mês</p>
                      <div className="flex items-center gap-1">
                        <span className="text-lg">🪙</span>
                        <span className="font-bold">{user.coins}</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Total Acumulado</p>
                      <div className="flex items-center gap-1">
                        <span className="text-lg">🪙</span>
                        <span className="font-bold">{user.coins}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ConfigureGoalModal
        isOpen={isConfigureModalOpen}
        onClose={() => setIsConfigureModalOpen(false)}
        onSave={handleCreateGoal}
      />

      <RewardsModal
        isOpen={isRewardsModalOpen}
        onClose={() => setIsRewardsModalOpen(false)}
      />

      {achievedGoal && (
        <GoalAchievedModal
          goal={achievedGoal}
          onClose={() => setAchievedGoal(null)}
        />
      )}
    </div>
  );
};