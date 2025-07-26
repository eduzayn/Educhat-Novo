import { useElegantToast } from "@/components/ui/elegant-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Exemplos de uso do sistema de notificações elegantes
 * Este arquivo demonstra todos os tipos de notificações disponíveis
 */
export function ElegantToastExamples() {
  const elegantToast = useElegantToast()

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sistema de Notificações Elegantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Notificações básicas */}
          <div className="space-y-2">
            <h3 className="font-semibold">Notificações Básicas</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={() => elegantToast.success("Operação realizada", "Tudo funcionou perfeitamente!")}
              >
                Sucesso
              </Button>
              <Button 
                variant="outline" 
                onClick={() => elegantToast.error("Algo deu errado", "Verifique os dados e tente novamente")}
              >
                Erro
              </Button>
              <Button 
                variant="outline" 
                onClick={() => elegantToast.warning("Atenção necessária", "Esta ação pode ter consequências")}
              >
                Aviso
              </Button>
              <Button 
                variant="outline" 
                onClick={() => elegantToast.info("Nova informação", "Dados atualizados disponíveis")}
              >
                Informação
              </Button>
            </div>
          </div>

          {/* Ações pré-configuradas */}
          <div className="space-y-2">
            <h3 className="font-semibold">Ações Padronizadas</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={() => elegantToast.created("João Silva", "Contato")}
              >
                Criado
              </Button>
              <Button 
                variant="outline" 
                onClick={() => elegantToast.updated("Equipe Vendas", "Equipe")}
              >
                Atualizado
              </Button>
              <Button 
                variant="outline" 
                onClick={() => elegantToast.deleted("Maria Santos", "Contato")}
              >
                Excluído
              </Button>
              <Button 
                variant="outline" 
                onClick={() => elegantToast.duplicated("Campanha Marketing", "Campanha")}
              >
                Duplicado
              </Button>
            </div>
          </div>

          {/* Conexões */}
          <div className="space-y-2">
            <h3 className="font-semibold">Status de Conexão</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={() => elegantToast.connected("WhatsApp Comercial")}
              >
                Conectado
              </Button>
              <Button 
                variant="outline" 
                onClick={() => elegantToast.disconnected("Instagram")}
              >
                Desconectado
              </Button>
            </div>
          </div>

          {/* Erros específicos */}
          <div className="space-y-2">
            <h3 className="font-semibold">Erros Específicos</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={() => elegantToast.validationError("E-mail é obrigatório")}
              >
                Erro de Validação
              </Button>
              <Button 
                variant="outline" 
                onClick={() => elegantToast.networkError("salvar os dados")}
              >
                Erro de Rede
              </Button>
            </div>
          </div>

          {/* Exemplo customizado */}
          <div className="space-y-2">
            <h3 className="font-semibold">Notificação Customizada</h3>
            <Button 
              variant="outline" 
              onClick={() => elegantToast.showToast({
                title: "Backup realizado",
                description: "Todos os dados foram salvos com segurança",
                variant: "success",
                action: "save",
                duration: 6000
              })}
            >
              Custom Toast
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Guia de uso do sistema de notificações elegantes:
 * 
 * 1. IMPORTAR O HOOK:
 * import { useElegantToast } from "@/components/ui/elegant-toast"
 * 
 * 2. USAR NO COMPONENTE:
 * const elegantToast = useElegantToast()
 * 
 * 3. CHAMAR AS FUNÇÕES:
 * 
 * // Notificações básicas
 * elegantToast.success("Título", "Descrição opcional")
 * elegantToast.error("Título", "Descrição opcional") 
 * elegantToast.warning("Título", "Descrição opcional")
 * elegantToast.info("Título", "Descrição opcional")
 * 
 * // Ações padronizadas (com ícones específicos)
 * elegantToast.created("Nome do item", "Tipo do item")
 * elegantToast.updated("Nome do item", "Tipo do item")
 * elegantToast.deleted("Nome do item", "Tipo do item")
 * elegantToast.duplicated("Nome do item", "Tipo do item")
 * 
 * // Conexões
 * elegantToast.connected("Nome do serviço")
 * elegantToast.disconnected("Nome do serviço")
 * 
 * // Erros específicos
 * elegantToast.validationError("Mensagem de erro")
 * elegantToast.networkError("ação que falhou")
 * 
 * // Notificação totalmente customizada
 * elegantToast.showToast({
 *   title: "Título",
 *   description: "Descrição",
 *   variant: "success" | "error" | "warning" | "info",
 *   action: "create" | "update" | "delete" | "duplicate" | "save" | "connect" | "disconnect",
 *   duration: 4000 // ms
 * })
 * 
 * CARACTERÍSTICAS:
 * - ✅ Animações suaves de entrada e saída
 * - ✅ Ícones contextuais para cada tipo de ação
 * - ✅ Cores consistentes com o design system
 * - ✅ Mensagens padronizadas e informativas
 * - ✅ Bordas laterais coloridas para destaque
 * - ✅ Backdrop blur para elegância
 * - ✅ Duração configurável
 * - ✅ Posicionamento automático
 */