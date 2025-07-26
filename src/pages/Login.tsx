import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useNavigate, Link } from "react-router-dom"
import { 
  MessageSquare, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock,
  Shield,
  Users
} from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Validações básicas
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive"
      })
      setIsLoading(false)
      return
    }

    try {
      // Simular processo de login
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock de validação (substituir por integração real)
      const validUsers = [
        { email: "admin@educhat.com", password: "Zayn@123", name: "João Silva", role: "admin", team: "Administração" },
        { email: "vendas@educhat.com", password: "123456", name: "Ana Costa", role: "vendas", team: "Vendas" },
        { email: "suporte@educhat.com", password: "123456", name: "Pedro Santos", role: "suporte", team: "Suporte" }
      ]
      
      const user = validUsers.find(u => u.email === email && u.password === password)
      
      if (user) {
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo(a), ${user.name}.`
        })
        
        // Armazenar dados do usuário (mock)
        localStorage.setItem('user', JSON.stringify({
          id: Date.now(),
          name: user.name,
          email: user.email,
          role: user.role,
          team: user.team
        }))
        
        navigate("/")
      } else {
        toast({
          title: "Credenciais inválidas",
          description: "Email ou senha incorretos.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-primary">
      {/* Lado esquerdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="text-center text-primary-foreground">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-card rounded-xl flex items-center justify-center shadow-lg">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            Bem-vindo ao EduChat
          </h1>
          
          <p className="text-xl mb-8 text-primary-foreground/90">
            Sistema completo de atendimento ao cliente
          </p>
          
          <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
            <div className="flex items-center space-x-4 text-primary-foreground/80">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Múltiplos Canais</h3>
                <p className="text-sm text-primary-foreground/70">
                  WhatsApp, Instagram, E-mail em um só lugar
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-primary-foreground/80">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Gestão de Equipes</h3>
                <p className="text-sm text-primary-foreground/70">
                  Organize atendimentos por departamento
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-primary-foreground/80">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">IA Integrada</h3>
                <p className="text-sm text-primary-foreground/70">
                  Respostas inteligentes e automação
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center mb-4 lg:hidden">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            
            <CardTitle className="text-2xl font-bold text-foreground">
              Entrar na sua conta
            </CardTitle>
            
            <p className="text-muted-foreground mt-2">
              Acesse o sistema de atendimento
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground">
                    Lembrar de mim
                  </Label>
                </div>
                
                <Button variant="link" className="text-sm p-0 h-auto">
                  Esqueceu a senha?
                </Button>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-hover"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link to="/cadastro" className="text-primary hover:underline">
                  Solicitar acesso
                </Link>
              </p>
            </div>
            
            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">Credenciais de teste:</p>
                  <p>• admin@educhat.com / Zayn@123</p>
                  <p>• vendas@educhat.com / 123456</p>
                  <p>• suporte@educhat.com / 123456</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}