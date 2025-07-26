import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts"
import { 
  TrendingUp, 
  BarChart3, 
  Clock, 
  Users,
  Calendar,
  Download
} from "lucide-react"

// Dados para os gráficos
const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}h`,
  conversas: Math.floor(Math.random() * 30) + 5,
  satisfacao: (Math.random() * 2 + 3).toFixed(1),
  tempoResposta: Math.floor(Math.random() * 300) + 60
}))

const weeklyData = [
  { dia: "Segunda", conversas: 45, resolvidas: 38, abandono: 7, receita: 8500 },
  { dia: "Terça", conversas: 52, resolvidas: 44, abandono: 8, receita: 9200 },
  { dia: "Quarta", conversas: 48, resolvidas: 42, abandono: 6, receita: 8800 },
  { dia: "Quinta", conversas: 58, resolvidas: 51, abandono: 7, receita: 10200 },
  { dia: "Sexta", conversas: 62, resolvidas: 54, abandono: 8, receita: 11500 },
  { dia: "Sábado", conversas: 35, resolvidas: 29, abandono: 6, receita: 6800 },
  { dia: "Domingo", conversas: 28, resolvidas: 24, abandono: 4, receita: 5200 }
]

const monthlyData = [
  { mes: "Jan", conversas: 1240, satisfacao: 4.2, receita: 185000 },
  { mes: "Fev", conversas: 1380, satisfacao: 4.3, receita: 205000 },
  { mes: "Mar", conversas: 1520, satisfacao: 4.5, receita: 228000 },
  { mes: "Abr", conversas: 1680, satisfacao: 4.4, receita: 252000 },
  { mes: "Mai", conversas: 1720, satisfacao: 4.6, receita: 265000 },
  { mes: "Jun", conversas: 1850, satisfacao: 4.7, receita: 285000 }
]

const channelDistribution = [
  { name: "WhatsApp", value: 45, color: "#25D366" },
  { name: "Instagram", value: 25, color: "#E4405F" },
  { name: "E-mail", value: 15, color: "#1877F2" },
  { name: "Chat Web", value: 10, color: "#7C3AED" },
  { name: "Facebook", value: 5, color: "#4267B2" }
]

const responseTimeData = [
  { periodo: "00-02h", media: 185, meta: 120 },
  { periodo: "02-04h", media: 95, meta: 120 },
  { periodo: "04-06h", media: 78, meta: 120 },
  { periodo: "06-08h", media: 145, meta: 120 },
  { periodo: "08-10h", media: 165, meta: 120 },
  { periodo: "10-12h", media: 180, meta: 120 },
  { periodo: "12-14h", media: 175, meta: 120 },
  { periodo: "14-16h", media: 190, meta: 120 },
  { periodo: "16-18h", media: 185, meta: 120 },
  { periodo: "18-20h", media: 160, meta: 120 },
  { periodo: "20-22h", media: 140, meta: 120 },
  { periodo: "22-00h", media: 125, meta: 120 }
]

export function PerformanceCharts() {
  return (
    <div className="space-y-6">
      {/* Gráficos de Linha - Tendências */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume de Conversas por Hora */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Volume por Hora
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                CSV
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="conversas" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center mt-4 space-x-4">
              <Badge className="flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Pico: 14h-16h
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tempo de Resposta vs Meta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Tempo de Resposta
              </div>
              <Badge variant="outline">Meta: 2min</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="periodo" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))'
                  }}
                  formatter={(value: any, name: string) => [
                    `${value}s`,
                    name === 'media' ? 'Tempo Médio' : 'Meta'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="media" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="meta" 
                  stroke="hsl(var(--destructive))" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Semanal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Performance Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))'
                }}
              />
              <Legend />
              <Bar dataKey="conversas" fill="hsl(var(--primary))" name="Total" />
              <Bar dataKey="resolvidas" fill="hsl(var(--chart-2))" name="Resolvidas" />
              <Bar dataKey="abandono" fill="hsl(var(--destructive))" name="Abandono" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Canal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Distribuição por Canal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {channelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {channelDistribution.map((channel, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: channel.color }}
                    />
                    <span className="text-sm">{channel.name}</span>
                  </div>
                  <Badge variant="secondary">{channel.value}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tendência Mensal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Tendência Mensal
              </div>
              <Badge className="bg-green-500">+18.5%</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="mes" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))'
                  }}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="conversas" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Conversas"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="satisfacao" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  name="Satisfação"
                />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Crescimento</p>
                <p className="text-lg font-bold text-green-600">+18.5%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Média Satisfação</p>
                <p className="text-lg font-bold text-yellow-600">4.5/5</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Receita Mensal</p>
                <p className="text-lg font-bold text-green-600">R$ 285k</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}