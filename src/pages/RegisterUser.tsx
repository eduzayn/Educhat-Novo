import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useNavigate, Link } from "react-router-dom"
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Users,
  MessageSquare,
  ArrowLeft,
  UserPlus,
  Shield,
  Building,
  Phone
} from "lucide-react"

export default function RegisterUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "",
    team: "",
    department: "",
    notes: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const teams = [
    { value: "vendas", label: "Vendas" },
    { value: "suporte", label: "Suporte" },
    { value: "pos-vendas", label: "Pós-Vendas" },
    { value: "financeiro", label: "Financeiro" },
    { value: "marketing", label: "Marketing" },
    { value: "administracao", label: "Administração" }
  ]

  const roles = [
    { value: "admin", label: "Administrador" },
    { value: "supervisor", label: "Supervisor" },
    { value: "atendente", label: "Atendente" },
    { value: "analista", label: "Analista" },
    { value: "consultor", label: "Consultor" }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Nome completo é obrigatório.",
        variant: "destructive"
      })
      return false
    }

    if (!formData.email.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Email é obrigatório.",
        variant: "destructive"
      })
      return false
    }

    if (!formData.password.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Senha é obrigatória.",
        variant: "destructive"
      })
      return false
    }

    if (formData.password.length < 6) {
      toast({
        title: "Senha muito fraca",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      })
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas digitadas não são iguais.",
        variant: "destructive"
      })
      return false
    }

    if (!formData.role) {
      toast({
        title: "Campo obrigatório",
        description: "Selecione o cargo do usuário.",
        variant: "destructive"
      })
      return false
    }

    if (!formData.team) {
      toast({
        title: "Campo obrigatório",
        description: "Selecione a equipe do usuário.",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simular criação do usuário
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock: salvar usuário no localStorage (substituir por API real)
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        team: formData.team,
        department: formData.department,
        notes: formData.notes,
        active: true,
        createdAt: new Date().toISOString()
      }

      localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]))

      toast({
        title: "Usuário cadastrado com sucesso!",
        description: `${formData.name} foi adicionado ao sistema.`
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        role: "",
        team: "",
        department: "",
        notes: ""
      })

      // Redirect after success
      setTimeout(() => {
        navigate("/configuracoes")
      }, 1500)

    } catch (error) {
      toast({
        title: "Erro ao cadastrar usuário",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="container max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/configuracoes" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Configurações
          </Link>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <UserPlus className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Cadastrar Usuário</h1>
            <p className="text-muted-foreground mt-2">
              Adicione um novo usuário ao sistema EduChat
            </p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informações do Usuário
            </CardTitle>
            <CardDescription>
              Preencha os dados para criar uma nova conta de usuário
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Pessoais */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informações Pessoais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="João Silva"
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="joao@educhat.com"
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="department">Departamento</Label>
                    <div className="relative mt-1">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => handleInputChange("department", e.target.value)}
                        placeholder="Atendimento ao Cliente"
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Credenciais */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Credenciais de Acesso</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Senha *</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="pl-10 pr-10"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        placeholder="Digite a senha novamente"
                        className="pl-10 pr-10"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissões */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Permissões e Equipe</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Cargo *</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)} disabled={isLoading}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="team">Equipe *</Label>
                    <Select value={formData.team} onValueChange={(value) => handleInputChange("team", value)} disabled={isLoading}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione a equipe" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.value} value={team.value}>
                            {team.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Informações adicionais sobre o usuário..."
                  rows={3}
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/configuracoes")}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Cadastrar Usuário
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informações adicionais */}
        <Card className="mt-6 border-dashed border-muted-foreground/30">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-2">
              <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">Informações sobre permissões:</p>
                <p>• Administrador: Acesso total ao sistema</p>
                <p>• Supervisor: Gerencia equipe e relatórios</p>
                <p>• Atendente: Acesso limitado ao atendimento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}