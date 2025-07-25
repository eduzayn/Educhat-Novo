import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Building2, 
  TrendingUp, 
  Users, 
  Target,
  Plus,
  MoreVertical,
  Calendar,
  DollarSign
} from "lucide-react"

const deals = [
  {
    id: 1,
    title: "Automação Residencial - Silva",
    company: "Silva & Associados",
    value: 15000,
    stage: "Proposta",
    probability: 70,
    closeDate: "2024-02-15",
    contact: "Maria Silva"
  },
  {
    id: 2,
    title: "Sistema Completo - XYZ Corp",
    company: "XYZ Corporation",
    value: 25000,
    stage: "Negociação",
    probability: 50,
    closeDate: "2024-02-28",
    contact: "João Santos"
  },
  {
    id: 3,
    title: "Upgrade Sistema - ABC Ltd",
    company: "ABC Limited",
    value: 8000,
    stage: "Qualificação",
    probability: 30,
    closeDate: "2024-03-10",
    contact: "Ana Costa"
  }
]

const stages = [
  { name: "Qualificação", count: 3, color: "bg-yellow-500" },
  { name: "Proposta", count: 2, color: "bg-blue-500" },
  { name: "Negociação", count: 1, color: "bg-orange-500" },
  { name: "Fechamento", count: 1, color: "bg-green-500" }
]

export default function CRM() {
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0)
  const avgDealValue = totalValue / deals.length

  return (
    <div className="h-screen bg-background overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                <Building2 className="h-6 w-6 mr-3" />
                CRM
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerencie suas oportunidades e pipeline de vendas
              </p>
            </div>
            
            <Button className="bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Nova Oportunidade
            </Button>
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pipeline Total</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {totalValue.toLocaleString('pt-BR')}
                </p>
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
                <p className="text-2xl font-bold text-foreground">{deals.length}</p>
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
                <p className="text-2xl font-bold text-foreground">
                  R$ {avgDealValue.toLocaleString('pt-BR')}
                </p>
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
                <p className="text-2xl font-bold text-foreground">68%</p>
              </div>
              <Users className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline por Estágio */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Pipeline por Estágio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stages.map((stage, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <span className="font-medium text-foreground">{stage.name}</span>
                </div>
                <Badge variant="secondary">{stage.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Lista de Oportunidades */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Oportunidades Ativas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {deals.map((deal) => (
              <Card key={deal.id} className="border border-border hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{deal.title}</h3>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Empresa:</span>
                      <span className="text-sm font-medium text-foreground">{deal.company}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Valor:</span>
                      <span className="text-sm font-bold text-success">
                        R$ {deal.value.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Contato:</span>
                      <span className="text-sm text-foreground">{deal.contact}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Fechamento:</span>
                      <div className="flex items-center text-sm text-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(deal.closeDate).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <Badge 
                      variant={deal.stage === "Fechamento" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {deal.stage}
                    </Badge>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">Probabilidade:</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all"
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-foreground">
                          {deal.probability}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}