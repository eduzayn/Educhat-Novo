import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2,
  Save,
  Search
} from "lucide-react"

interface QuickReply {
  id: number
  title: string
  content: string
  category: string
  shortcuts: string[]
}

// Mock data para respostas rápidas
const initialQuickReplies: QuickReply[] = [
  {
    id: 1,
    title: "Saudação Inicial",
    content: "Olá! Seja bem-vindo(a) ao atendimento da EduChat. Como posso ajudá-lo(a) hoje?",
    category: "Saudações",
    shortcuts: ["ola", "bem-vindo"]
  },
  {
    id: 2,
    title: "Informações de Produtos",
    content: "Ficarei feliz em fornecer informações sobre nossos produtos. Qual categoria você tem interesse?",
    category: "Vendas",
    shortcuts: ["produtos", "informacoes"]
  },
  {
    id: 3,
    title: "Horário de Atendimento",
    content: "Nosso horário de atendimento é de segunda a sexta, das 8h às 18h. Retornaremos seu contato no próximo horário comercial.",
    category: "Informações",
    shortcuts: ["horario", "atendimento"]
  },
  {
    id: 4,
    title: "Transferir para Suporte",
    content: "Vou transferir você para nossa equipe de suporte técnico. Aguarde um momento, por favor.",
    category: "Suporte",
    shortcuts: ["suporte", "tecnico"]
  }
]

const categories = ["Saudações", "Vendas", "Suporte", "Informações", "Despedida"]

interface QuickRepliesModalProps {
  trigger?: React.ReactNode
  onSelectReply?: (reply: QuickReply) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function QuickRepliesModal({ trigger, onSelectReply, open: externalOpen, onOpenChange }: QuickRepliesModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>(initialQuickReplies)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editingReply, setEditingReply] = useState<QuickReply | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Saudações",
    shortcuts: ""
  })

  const filteredReplies = quickReplies.filter(reply => {
    const matchesCategory = !selectedCategory || reply.category === selectedCategory
    const matchesSearch = !searchTerm || 
      reply.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reply.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reply.shortcuts.some(shortcut => shortcut.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const handleSaveReply = () => {
    const shortcutsArray = formData.shortcuts.split(",").map(s => s.trim()).filter(s => s)
    
    if (editingReply) {
      // Editar resposta existente
      setQuickReplies(quickReplies.map(reply => 
        reply.id === editingReply.id 
          ? { ...editingReply, ...formData, shortcuts: shortcutsArray }
          : reply
      ))
    } else {
      // Criar nova resposta
      const newReply: QuickReply = {
        id: Date.now(),
        title: formData.title,
        content: formData.content,
        category: formData.category,
        shortcuts: shortcutsArray
      }
      setQuickReplies([...quickReplies, newReply])
    }
    
    resetForm()
  }

  const handleEditReply = (reply: QuickReply) => {
    setEditingReply(reply)
    setFormData({
      title: reply.title,
      content: reply.content,
      category: reply.category,
      shortcuts: reply.shortcuts.join(", ")
    })
    setIsEditing(true)
  }

  const handleDeleteReply = (replyId: number) => {
    setQuickReplies(quickReplies.filter(reply => reply.id !== replyId))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "Saudações",
      shortcuts: ""
    })
    setIsEditing(false)
    setEditingReply(null)
  }

  const handleSelectReply = (reply: QuickReply) => {
    onSelectReply?.(reply)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Respostas Rápidas
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex">
          {/* Painel esquerdo - Lista de respostas */}
          <div className="w-2/3 pr-4 flex flex-col">
            {/* Busca e filtros */}
            <div className="space-y-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar respostas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  Todas
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Lista de respostas */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {filteredReplies.map(reply => (
                <Card key={reply.id} className="border border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-1">{reply.title}</h3>
                        <Badge variant="outline" className="text-xs mb-2">
                          {reply.category}
                        </Badge>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {reply.content}
                        </p>
                        
                        {reply.shortcuts.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {reply.shortcuts.map((shortcut, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                /{shortcut}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSelectReply(reply)}
                          className="text-primary"
                        >
                          Usar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditReply(reply)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReply(reply.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredReplies.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Nenhuma resposta encontrada
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? "Tente ajustar sua busca" : "Crie sua primeira resposta rápida"}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Painel direito - Formulário */}
          <div className="w-1/3 border-l border-border pl-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {isEditing ? "Editar Resposta" : "Nova Resposta"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="Nome da resposta"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border border-border rounded-md bg-background"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="content">Conteúdo</Label>
                  <Textarea
                    id="content"
                    placeholder="Digite a resposta..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                  />
                </div>
                
                <div>
                  <Label htmlFor="shortcuts">Atalhos (separados por vírgula)</Label>
                  <Input
                    id="shortcuts"
                    placeholder="Ex: ola, bem-vindo, saudacao"
                    value={formData.shortcuts}
                    onChange={(e) => setFormData({ ...formData, shortcuts: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use /atalho para acesso rápido durante a conversa
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveReply}
                    disabled={!formData.title || !formData.content}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? "Atualizar" : "Salvar"}
                  </Button>
                  
                  {isEditing && (
                    <Button variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}