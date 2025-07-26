import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Award,
  Coins,
  Calendar,
  Trophy,
  Target,
  TrendingUp,
  Filter
} from "lucide-react";

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Achievement {
  id: string;
  goalTitle: string;
  goalType: 'individual' | 'team';
  indicator: string;
  target: number;
  achieved: number;
  coins: number;
  date: string;
  period: string;
}

export const RewardsModal = ({ isOpen, onClose }: RewardsModalProps) => {
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Mock data - histórico de conquistas
  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      goalTitle: 'Meta de Vendas - Janeiro',
      goalType: 'team',
      indicator: 'Vendas Fechadas',
      target: 50,
      achieved: 52,
      coins: 500,
      date: '2024-01-31',
      period: '2024-01'
    },
    {
      id: '2',
      goalTitle: 'Atendimentos Excelência',
      goalType: 'individual',
      indicator: 'Atendimentos Realizados',
      target: 100,
      achieved: 115,
      coins: 200,
      date: '2024-01-25',
      period: '2024-01'
    },
    {
      id: '3',
      goalTitle: 'Meta de Relacionamento',
      goalType: 'team',
      indicator: 'Chamados Resolvidos',
      target: 80,
      achieved: 85,
      coins: 300,
      date: '2024-01-20',
      period: '2024-01'
    }
  ]);

  const totalCoins = achievements.reduce((sum, achievement) => sum + achievement.coins, 0);
  const totalAchievements = achievements.length;
  const monthlyCoins = achievements
    .filter(a => a.period === '2024-01')
    .reduce((sum, achievement) => sum + achievement.coins, 0);

  const filteredAchievements = achievements.filter(achievement => {
    if (filterPeriod !== 'all' && achievement.period !== filterPeriod) return false;
    if (filterType !== 'all' && achievement.goalType !== filterType) return false;
    return true;
  });

  const getTypeIcon = (type: 'individual' | 'team') => {
    return type === 'team' ? '👥' : '👤';
  };

  const getTypeBadge = (type: 'individual' | 'team') => {
    return type === 'team' 
      ? <Badge className="bg-blue-500 text-white">Equipe</Badge>
      : <Badge className="bg-green-500 text-white">Individual</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-warning" />
            Histórico de Recompensas
          </DialogTitle>
          <DialogDescription>
            Acompanhe todas as suas conquistas e moedas acumuladas
          </DialogDescription>
        </DialogHeader>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Acumulado</p>
                  <p className="text-2xl font-bold flex items-center gap-1">
                    🪙 {totalCoins.toLocaleString()}
                  </p>
                </div>
                <Coins className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Este Mês</p>
                  <p className="text-2xl font-bold flex items-center gap-1">
                    🪙 {monthlyCoins.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Metas Conquistadas</p>
                  <p className="text-2xl font-bold">{totalAchievements}</p>
                </div>
                <Trophy className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>
          
          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os períodos</SelectItem>
              <SelectItem value="2024-01">Janeiro 2024</SelectItem>
              <SelectItem value="2023-12">Dezembro 2023</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de meta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as metas</SelectItem>
              <SelectItem value="individual">Individuais</SelectItem>
              <SelectItem value="team">Em equipe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Achievements List */}
        <Card>
          <CardHeader>
            <CardTitle>Conquistas Recentes</CardTitle>
            <CardDescription>
              Histórico detalhado de metas conquistadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAchievements.map((achievement, index) => (
                <div key={achievement.id}>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                        <Trophy className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-foreground">{achievement.goalTitle}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {getTypeIcon(achievement.goalType)} {achievement.indicator}
                          </span>
                          {getTypeBadge(achievement.goalType)}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            Meta: {achievement.target}
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Atingido: {achievement.achieved}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(achievement.date).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 text-lg font-bold text-warning">
                        🪙 {achievement.coins}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {((achievement.achieved / achievement.target) * 100).toFixed(0)}% da meta
                      </p>
                    </div>
                  </div>
                  
                  {index < filteredAchievements.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
              
              {filteredAchievements.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma conquista encontrada para os filtros selecionados</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};