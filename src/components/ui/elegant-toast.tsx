import { CheckCircle, AlertCircle, Info, Trash2, Copy, Edit, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export interface ElegantToastProps {
  title: string
  description?: string
  variant?: "success" | "error" | "warning" | "info"
  action?: "create" | "update" | "delete" | "duplicate" | "save" | "connect" | "disconnect"
  duration?: number
}

const getToastConfig = (variant: string, action?: string) => {
  const configs = {
    success: {
      icon: CheckCircle,
      className: "border-success bg-success/10 text-success-foreground",
      iconColor: "text-success"
    },
    error: {
      icon: AlertCircle, 
      className: "border-destructive bg-destructive/10 text-destructive-foreground",
      iconColor: "text-destructive"
    },
    warning: {
      icon: AlertCircle,
      className: "border-warning bg-warning/10 text-warning-foreground", 
      iconColor: "text-warning"
    },
    info: {
      icon: Info,
      className: "border-primary bg-primary/10 text-primary-foreground",
      iconColor: "text-primary"
    }
  }

  // Ícones específicos por ação
  if (action) {
    const actionIcons = {
      create: Plus,
      update: Edit,
      delete: Trash2,
      duplicate: Copy,
      save: CheckCircle,
      connect: CheckCircle,
      disconnect: X
    }
    
    if (actionIcons[action]) {
      configs[variant as keyof typeof configs].icon = actionIcons[action]
    }
  }

  return configs[variant as keyof typeof configs] || configs.info
}

export const useElegantToast = () => {
  const { toast } = useToast()

  const showToast = ({ 
    title, 
    description, 
    variant = "info", 
    action,
    duration = 4000 
  }: ElegantToastProps) => {
    const config = getToastConfig(variant, action)
    const Icon = config.icon

    toast({
      title,
      description,
      className: `${config.className} border-l-4 shadow-lg backdrop-blur-sm animate-fade-in flex items-center space-x-3`,
      duration
    })
  }

  // Funções pré-configuradas para ações comuns
  const success = (title: string, description?: string, action?: ElegantToastProps['action']) => {
    showToast({ title, description, variant: "success", action })
  }

  const error = (title: string, description?: string, action?: ElegantToastProps['action']) => {
    showToast({ title, description, variant: "error", action })
  }

  const warning = (title: string, description?: string, action?: ElegantToastProps['action']) => {
    showToast({ title, description, variant: "warning", action })
  }

  const info = (title: string, description?: string, action?: ElegantToastProps['action']) => {
    showToast({ title, description, variant: "info", action })
  }

  // Ações específicas com mensagens padronizadas
  const created = (itemName: string, itemType: string = "item") => {
    success(
      `${itemType} criado com sucesso!`,
      `${itemName} foi adicionado ao sistema`,
      "create"
    )
  }

  const updated = (itemName: string, itemType: string = "item") => {
    success(
      `${itemType} atualizado!`,
      `As alterações em ${itemName} foram salvas`,
      "update"
    )
  }

  const deleted = (itemName: string, itemType: string = "item") => {
    success(
      `${itemType} excluído!`,
      `${itemName} foi removido do sistema`,
      "delete"
    )
  }

  const duplicated = (itemName: string, itemType: string = "item") => {
    success(
      `${itemType} duplicado!`,
      `Uma cópia de ${itemName} foi criada`,
      "duplicate"
    )
  }

  const connected = (serviceName: string) => {
    success(
      "Conexão estabelecida!",
      `${serviceName} foi conectado com sucesso`,
      "connect"
    )
  }

  const disconnected = (serviceName: string) => {
    warning(
      "Conexão encerrada",
      `${serviceName} foi desconectado`,
      "disconnect"
    )
  }

  const validationError = (message: string) => {
    error(
      "Dados inválidos",
      message,
      "update"
    )
  }

  const networkError = (action: string = "executar a ação") => {
    error(
      "Erro de conexão",
      `Não foi possível ${action}. Verifique sua conexão e tente novamente.`
    )
  }

  return {
    showToast,
    success,
    error,
    warning,
    info,
    created,
    updated,
    deleted,
    duplicated,
    connected,
    disconnected,
    validationError,
    networkError
  }
}