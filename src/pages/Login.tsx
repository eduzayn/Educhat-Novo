import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Aqui será integrado com JWT/backend no futuro
    setTimeout(() => {
      console.log("Login attempt:", { email, password, rememberMe })
      setIsLoading(false)
      // Redirect to dashboard after successful login
      window.location.href = "/"
    }, 1500)
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
                <Button variant="link" className="text-primary p-0 h-auto">
                  Solicitar acesso
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}