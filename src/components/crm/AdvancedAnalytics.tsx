import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Target, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Award,
  Clock,
  Activity,
  ArrowUp,
  ArrowDown,
  Eye
} from "lucide-react";

interface SalesMetric {
  title: string;
  value: string | number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  color: string;
}

interface ConversionFunnel {
  stage: string;
  count: number;
  percentage: number;
  value: number;
  color: string;
}

interface SalesRepPerformance {
  id: string;
  name: string;
  avatar: string;
  deals: number;
  revenue: number;
  conversionRate: number;
  avgDealSize: number;
  performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
}

export const AdvancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const salesMetrics: SalesMetric[] = [
    {
      title: 'Receita Total',
      value: 'R$ 487.500',
      change: 12.5,
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-success'
    },
    {
      title: 'Oportunidades Ativas',
      value: 47,
      change: -3.2,
      changeType: 'negative',
      icon: Target,
      color: 'text-primary'
    },
    {
      title: 'Taxa de Conversão',
      value: '24.8%',
      change: 5.1,
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-accent'
    },
    {
      title: 'Ticket Médio',
      value: 'R$ 18.750',
      change: 8.3,
      changeType: 'positive',
      icon: BarChart3,
      color: 'text-warning'
    },
    {
      title: 'Tempo Médio do Ciclo',
      value: '18 dias',
      change: -12.0,
      changeType: 'positive',
      icon: Clock,
      color: 'text-muted-foreground'
    },
    {
      title: 'Novos Leads',
      value: 156,
      change: 23.7,
      changeType: 'positive',
      icon: Users,
      color: 'text-primary'
    }
  ];

  const conversionFunnel: ConversionFunnel[] = [
    { stage: 'Leads Gerados', count: 320, percentage: 100, value: 0, color: 'bg-blue-500' },
    { stage: 'Leads Qualificados', count: 168, percentage: 52.5, value: 0, color: 'bg-indigo-500' },
    { stage: 'Oportunidades', count: 89, percentage: 27.8, value: 487500, color: 'bg-purple-500' },
    { stage: 'Propostas Enviadas', count: 54, percentage: 16.9, value: 324000, color: 'bg-pink-500' },
    { stage: 'Negociações', count: 31, percentage: 9.7, value: 198750, color: 'bg-orange-500' },
    { stage: 'Fechados', count: 22, percentage: 6.9, value: 142500, color: 'bg-green-500' }
  ];

  const salesReps: SalesRepPerformance[] = [
    {
      id: '1',
      name: 'Carlos Silva',
      avatar: 'CS',
      deals: 15,
      revenue: 187500,
      conversionRate: 28.5,
      avgDealSize: 12500,
      performance: 'excellent'
    },
    {
      id: '2',
      name: 'Ana Santos',
      avatar: 'AS',
      deals: 12,
      revenue: 156000,
      conversionRate: 24.1,
      avgDealSize: 13000,
      performance: 'good'
    },
    {
      id: '3',
      name: 'João Costa',
      avatar: 'JC',
      deals: 8,
      revenue: 98000,
      conversionRate: 19.8,
      avgDealSize: 12250,
      performance: 'average'
    },
    {
      id: '4',
      name: 'Maria Oliveira',
      avatar: 'MO',
      deals: 6,
      revenue: 72000,
      conversionRate: 15.2,
      avgDealSize: 12000,
      performance: 'needs_improvement'
    }
  ];

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return <Badge className="bg-success text-success-foreground">Excelente</Badge>;
      case 'good':
        return <Badge className="bg-primary text-primary-foreground">Bom</Badge>;
      case 'average':
        return <Badge variant="secondary">Médio</Badge>;
      case 'needs_improvement':
        return <Badge variant="destructive">Precisa Melhorar</Badge>;
      default:
        return <Badge variant="outline">N/A</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getChangeIcon = (changeType: string) => {
    if (changeType === 'positive') return <ArrowUp className="h-4 w-4 text-success" />;
    if (changeType === 'negative') return <ArrowDown className="h-4 w-4 text-destructive" />;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header com Controles */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Analytics Avançados
          </h2>
          <p className="text-muted-foreground">Análise detalhada da performance de vendas</p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {salesMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {getChangeIcon(metric.changeType)}
                      <span className={`text-sm font-medium ${
                        metric.changeType === 'positive' ? 'text-success' : 
                        metric.changeType === 'negative' ? 'text-destructive' : 
                        'text-muted-foreground'
                      }`}>
                        {Math.abs(metric.change)}%
                      </span>
                      <span className="text-xs text-muted-foreground">vs período anterior</span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg bg-muted/30`}>
                    <IconComponent className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="funnel" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="funnel">Funil de Conversão</TabsTrigger>
          <TabsTrigger value="performance">Performance por Vendedor</TabsTrigger>
          <TabsTrigger value="trends">Tendências e Previsões</TabsTrigger>
        </TabsList>

        {/* Funil de Conversão */}
        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Funil de Conversão Detalhado
              </CardTitle>
              <CardDescription>
                Acompanhe o fluxo de leads até o fechamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {conversionFunnel.map((stage, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${stage.color}`} />
                      <span className="font-medium text-foreground">{stage.stage}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-foreground font-medium">{stage.count}</span>
                      <span className="text-muted-foreground">{stage.percentage.toFixed(1)}%</span>
                      {stage.value > 0 && (
                        <span className="text-success font-medium">
                          {formatCurrency(stage.value)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${stage.color}`}
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>

                  {index < conversionFunnel.length - 1 && (
                    <div className="flex items-center justify-center py-1">
                      <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {(((conversionFunnel[index + 1].count / stage.count) * 100).toFixed(1))}% conversão
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-foreground">22</div>
                    <div className="text-sm text-muted-foreground">Vendas Fechadas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">6.9%</div>
                    <div className="text-sm text-muted-foreground">Taxa Final</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">18 dias</div>
                    <div className="text-sm text-muted-foreground">Ciclo Médio</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">R$ 6.477</div>
                    <div className="text-sm text-muted-foreground">Valor/Lead</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance por Vendedor */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Ranking de Performance
              </CardTitle>
              <CardDescription>
                Análise detalhada por vendedor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesReps.map((rep, index) => (
                  <Card key={rep.id} className="border-l-4 border-l-primary/30">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">{rep.avatar}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{rep.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              {index === 0 && <Award className="h-4 w-4 text-yellow-500" />}
                              {getPerformanceBadge(rep.performance)}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted/30 rounded">
                          <div className="text-lg font-bold text-foreground">{rep.deals}</div>
                          <div className="text-xs text-muted-foreground">Deals Fechados</div>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded">
                          <div className="text-lg font-bold text-success">
                            {formatCurrency(rep.revenue)}
                          </div>
                          <div className="text-xs text-muted-foreground">Receita Total</div>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded">
                          <div className="text-lg font-bold text-primary">{rep.conversionRate}%</div>
                          <div className="text-xs text-muted-foreground">Taxa Conversão</div>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded">
                          <div className="text-lg font-bold text-accent">
                            {formatCurrency(rep.avgDealSize)}
                          </div>
                          <div className="text-xs text-muted-foreground">Ticket Médio</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tendências e Previsões */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Previsão de Receita
                </CardTitle>
                <CardDescription>
                  Baseada no pipeline atual e histórico
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                  <div className="text-3xl font-bold text-foreground mb-2">R$ 875.000</div>
                  <div className="text-sm text-muted-foreground">Previsão próximos 90 dias</div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm text-success font-medium">+15.8% vs período anterior</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cenário Conservador</span>
                    <span className="font-medium text-foreground">R$ 650.000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cenário Realista</span>
                    <span className="font-medium text-foreground">R$ 875.000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cenário Otimista</span>
                    <span className="font-medium text-foreground">R$ 1.200.000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Insights de IA
                </CardTitle>
                <CardDescription>
                  Recomendações baseadas em dados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-success mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Oportunidade de Crescimento</p>
                        <p className="text-xs text-muted-foreground">
                          Leads do WhatsApp têm 35% mais chance de conversão. Foque mais neste canal.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-warning mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Atenção ao Tempo</p>
                        <p className="text-xs text-muted-foreground">
                          Propostas não respondidas há mais de 5 dias têm 60% menos chance de fechar.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Target className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Meta Mensal</p>
                        <p className="text-xs text-muted-foreground">
                          Você está 78% do caminho para bater a meta de R$ 500.000 este mês.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};