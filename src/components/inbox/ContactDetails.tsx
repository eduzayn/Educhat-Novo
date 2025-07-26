import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar,
  Tag,
  Edit,
  Save,
  X,
  Mic,
  Clock,
  Building2,
  MapPin,
  Plus,
  Trash2
} from "lucide-react"

// Mock data do contato
const contactData = {
  id: 1,
  name: "Maria Silva",
  phone: "+55 11 99999-9999",
  email: "maria.silva@email.com",
  channel: "WhatsApp",
  avatar: null,
  tags: ["Cliente VIP", "Interessada em Automação"],
  observations: "Cliente muito interessada em produtos de automação residencial. Já comprou conosco anteriormente.",
  company: "Silva & Associados",
  address: "São Paulo, SP",
  createdAt: "15/01/2024",
  lastContact: "Hoje às 10:30"
}

const conversationHistory = [
  {
    id: 1,
    date: "Hoje",
    summary: "Interesse em automação residencial",
    attendant: "João Silva",
    status: "Em andamento"
  },
  {
    id: 2,
    date: "20/01/2024",
    summary: "Dúvidas sobre garantia do produto",
    attendant: "Ana Costa",
    status: "Finalizado"
  },
  {
    id: 3,
    date: "15/01/2024",
    summary: "Primeira compra - Kit básico",
    attendant: "João Silva",
    status: "Finalizado"
  }
]

export function ContactDetails() {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(contactData)
  const [newObservation, setNewObservation] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  
  // Estados para gerenciamento de tags
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [selectedPredefinedTag, setSelectedPredefinedTag] = useState("")
  const { toast } = useToast()

  // Tags predefinidas
  const predefinedTags = [
    "Cliente VIP",
    "Interessado em Compra",
    "Reclamação",
    "Suporte Técnico",
    "Primeira Vez",
    "Fidelizado",
    "Empresarial",
    "Residencial",
    "Urgente",
    "Seguimento",
    "Orçamento",
    "Pós-Venda"
  ]

  const handleSave = () => {
    // Aqui salvaria os dados editados
    setIsEditing(false)
    toast({
      title: "Contato atualizado",
      description: "As informações foram salvas com sucesso."
    })
  }

  const handleCancel = () => {
    setEditData(contactData)
    setIsEditing(false)
  }

  const addObservation = () => {
    if (newObservation.trim()) {
      // Aqui adicionaria a nova observação
      setNewObservation("")
      toast({
        title: "Observação adicionada",
        description: "Nova observação foi registrada."
      })
    }
  }

  // Funções para gerenciar tags
  const addTag = (tag: string) => {
    if (tag.trim() && !editData.tags.includes(tag.trim())) {
      setEditData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }))
      toast({
        title: "Tag adicionada",
        description: `Tag "${tag}" foi adicionada ao contato.`
      })
    }
    setNewTag("")
    setSelectedPredefinedTag("")
    setIsTagModalOpen(false)
  }

  const removeTag = (tagToRemove: string) => {
    setEditData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
    toast({
      title: "Tag removida",
      description: `Tag "${tagToRemove}" foi removida.`
    })
  }

  const handleAddPredefinedTag = () => {
    if (selectedPredefinedTag) {
      addTag(selectedPredefinedTag)
    }
  }

  const handleAddCustomTag = () => {
    if (newTag.trim()) {
      addTag(newTag)
    }
  }

  return (
    <div className="w-80 bg-card border-l border-border h-full overflow-y-auto">
      {/* Header do contato */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Detalhes do Contato</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          </Button>
        </div>

        {/* Avatar e info básica */}
        <div className="text-center mb-4">
          <Avatar className="h-16 w-16 mx-auto mb-3">
            <AvatarImage src={editData.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {editData.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          {isEditing ? (
            <Input
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="text-center font-semibold"
            />
          ) : (
            <h4 className="font-semibold text-lg text-foreground">{editData.name}</h4>
          )}
          
          <Badge variant="secondary" className="mt-2">
            <MessageSquare className="h-3 w-3 mr-1 text-success" />
            {editData.channel}
          </Badge>
        </div>

        {/* Ações rápidas */}
        {isEditing && (
          <div className="flex space-x-2">
            <Button onClick={handleSave} size="sm" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
              Cancelar
            </Button>
          </div>
        )}
      </div>

      {/* Informações de contato */}
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <User className="h-4 w-4 mr-2" />
              Informações de Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Telefone</Label>
              {isEditing ? (
                <Input
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-foreground flex items-center mt-1">
                  <Phone className="h-3 w-3 mr-2" />
                  {editData.phone}
                </p>
              )}
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">E-mail</Label>
              {isEditing ? (
                <Input
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-foreground flex items-center mt-1">
                  <Mail className="h-3 w-3 mr-2" />
                  {editData.email}
                </p>
              )}
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Empresa</Label>
              {isEditing ? (
                <Input
                  value={editData.company}
                  onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-foreground flex items-center mt-1">
                  <Building2 className="h-3 w-3 mr-2" />
                  {editData.company}
                </p>
              )}
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Localização</Label>
              <p className="text-sm text-foreground flex items-center mt-1">
                <MapPin className="h-3 w-3 mr-2" />
                {editData.address}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Tags
              </div>
              <Dialog open={isTagModalOpen} onOpenChange={setIsTagModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-6 text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Gerenciar Tags</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Tags Predefinidas */}
                    <div>
                      <Label className="text-sm font-medium">Tags Predefinidas</Label>
                      <Select value={selectedPredefinedTag} onValueChange={setSelectedPredefinedTag}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Selecione uma tag" />
                        </SelectTrigger>
                        <SelectContent>
                          {predefinedTags
                            .filter(tag => !editData.tags.includes(tag))
                            .map((tag) => (
                              <SelectItem key={tag} value={tag}>
                                {tag}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        onClick={handleAddPredefinedTag}
                        disabled={!selectedPredefinedTag}
                        className="w-full mt-2"
                        size="sm"
                      >
                        Adicionar Tag Selecionada
                      </Button>
                    </div>

                    <Separator />

                    {/* Tag Personalizada */}
                    <div>
                      <Label className="text-sm font-medium">Tag Personalizada</Label>
                      <div className="flex space-x-2 mt-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Digite uma nova tag..."
                          onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
                        />
                        <Button 
                          onClick={handleAddCustomTag}
                          disabled={!newTag.trim()}
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {editData.tags.length > 0 ? (
                editData.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs flex items-center gap-1 pr-1"
                  >
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeTag(tag)}
                      title="Remover tag"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">Nenhuma tag adicionada</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Observações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isEditing ? (
              <Textarea
                value={editData.observations}
                onChange={(e) => setEditData({ ...editData, observations: e.target.value })}
                placeholder="Adicione observações sobre o contato..."
                rows={3}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {editData.observations}
              </p>
            )}

            {/* Nova observação */}
            <Separator />
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Nova Observação</Label>
              <div className="flex space-x-2">
                <Textarea
                  value={newObservation}
                  onChange={(e) => setNewObservation(e.target.value)}
                  placeholder="Adicionar nova observação..."
                  rows={2}
                  className="flex-1"
                />
                <div className="flex flex-col space-y-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`p-2 ${isRecording ? "text-destructive" : ""}`}
                    onClick={() => setIsRecording(!isRecording)}
                    title="Gravar áudio"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={addObservation}
                    size="sm"
                    className="p-2"
                    disabled={!newObservation.trim()}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Histórico de atendimentos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Histórico de Atendimentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {conversationHistory.map((history) => (
              <div key={history.id} className="border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-foreground">
                    {history.date}
                  </span>
                  <Badge 
                    variant={history.status === "Em andamento" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {history.status}
                  </Badge>
                </div>
                <p className="text-sm text-foreground mb-1">{history.summary}</p>
                <p className="text-xs text-muted-foreground">
                  Atendente: {history.attendant}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Informações adicionais */}
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Cliente desde:</span>
                <span>{contactData.createdAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Último contato:</span>
                <span>{contactData.lastContact}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}