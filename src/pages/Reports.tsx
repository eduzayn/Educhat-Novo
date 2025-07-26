import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportFilters } from "@/components/reporting/ReportFilters"
import { AdvancedMetrics } from "@/components/reporting/AdvancedMetrics"
import { TeamAnalysis } from "@/components/reporting/TeamAnalysis"
import { PerformanceCharts } from "@/components/reporting/PerformanceCharts"
import { useState } from "react"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Clock,
  Target,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Share2,
  FileSpreadsheet
} from "lucide-react"

export default function Reports() {
  const [filters, setFilters] = useState({
    dateRange: {
      from: undefined,
      to: undefined
    },
    teams: [],
    users: [],
    channels: [],
    statuses: [],
    tags: []
  })

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      dateRange: { from: undefined, to: undefined },
      teams: [],
      users: [],
      channels: [],
      statuses: [],
      tags: []
    })
  }

  const handleExport = (format: string) => {
    // Implementar lógica de exportação
    console.log(`Exportando relatório em formato: ${format}`)
  }

  return (
    <div className="h-screen bg-background overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                <BarChart3 className="h-6 w-6 mr-3" />
                Relatórios e BI
              </h1>
              <p className="text-muted-foreground mt-1">
                Análise completa de performance e tomada de decisões baseada em dados
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              
              <Button 
                className="bg-primary hover:bg-primary-hover"
                onClick={() => handleExport('pdf')}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>

          {/* Filtros Avançados */}
          <div className="mb-4">
            <ReportFilters 
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="p-6">
        <Tabs defaultValue="metricas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="metricas" className="flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Métricas
            </TabsTrigger>
            <TabsTrigger value="equipe" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Equipe
            </TabsTrigger>
            <TabsTrigger value="graficos" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Gráficos
            </TabsTrigger>
            <TabsTrigger value="exportar" className="flex items-center">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Exportar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metricas" className="space-y-6">
            <AdvancedMetrics />
          </TabsContent>

          <TabsContent value="equipe" className="space-y-6">
            <TeamAnalysis />
          </TabsContent>

          <TabsContent value="graficos" className="space-y-6">
            <PerformanceCharts />
          </TabsContent>

          <TabsContent value="exportar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Opções de Exportação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleExport('pdf')}>
                    <CardContent className="p-4 text-center">
                      <Download className="h-8 w-8 mx-auto mb-2 text-red-500" />
                      <h3 className="font-medium">PDF Completo</h3>
                      <p className="text-sm text-muted-foreground">Relatório detalhado em PDF</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleExport('excel')}>
                    <CardContent className="p-4 text-center">
                      <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <h3 className="font-medium">Excel/CSV</h3>
                      <p className="text-sm text-muted-foreground">Dados para análise</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleExport('dashboard')}>
                    <CardContent className="p-4 text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <h3 className="font-medium">Dashboard</h3>
                      <p className="text-sm text-muted-foreground">Link interativo</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Agendamento de Relatórios</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Relatório Diário (8h)
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Relatório Semanal (Segunda)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}