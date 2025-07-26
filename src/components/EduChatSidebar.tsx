import { useState } from "react"
import { 
  Inbox, 
  Users, 
  Building2, 
  Bot, 
  BarChart3, 
  Settings, 
  LogOut, 
  User,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navigation = [
  { 
    title: "Caixa de Entrada", 
    url: "/", 
    icon: Inbox,
    badge: 12 // Quantidade de mensagens não lidas
  },
  { 
    title: "Contatos", 
    url: "/contatos", 
    icon: Users 
  },
  { 
    title: "CRM", 
    url: "/crm", 
    icon: Building2 
  },
  { 
    title: "Copiloto", 
    url: "/copiloto", 
    icon: Bot 
  },
  { 
    title: "Relatórios", 
    url: "/relatorios", 
    icon: BarChart3 
  },
  { 
    title: "Configurações", 
    url: "/configuracoes", 
    icon: Settings 
  },
]

export function EduChatSidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/"
    }
    return currentPath.startsWith(path)
  }

  return (
    <div className={cn(
      "bg-card border-r border-border flex flex-col h-screen transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header com Logo */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">EduChat</h1>
              <p className="text-xs text-muted-foreground">Sistema de Atendimento</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="p-2"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive: linkActive }) =>
              cn(
                "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors group relative",
                linkActive || isActive(item.url)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )
            }
          >
            <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
            {!collapsed && (
              <>
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                <Badge 
                  variant="secondary" 
                  className="ml-auto bg-muted text-muted-foreground text-xs px-1.5 py-0.5"
                >
                  {item.badge}
                </Badge>
                )}
              </>
            )}
            
            {/* Tooltip para modo collapsed */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.title}
                {item.badge && ` (${item.badge})`}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer com informações do usuário */}
      <div className="border-t border-border p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                João Silva
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Atendente
              </p>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-muted-foreground hover:text-destructive"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        
        {!collapsed && (
          <div className="mt-3 flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        )}
      </div>
    </div>
  )
}