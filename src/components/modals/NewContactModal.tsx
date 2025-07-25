import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  User, 
  Phone, 
  Mail, 
  MessageSquare,
  Tag,
  X,
  Save
} from "lucide-react"

interface NewContactModalProps {
  trigger?: React.ReactNode
  onSave?: (contactData: any) => void
}

export function NewContactModal({ trigger, onSave }: NewContactModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    preferredChannel: "WhatsApp",
    observations: ""
  })
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const handleSave = () => {
    const contactData = {
      ...formData,
      tags,
      createdAt: new Date().toISOString()
    }
    
    console.log("Novo contato:", contactData)
    onSave?.(contactData)
    
    // Reset form
    setFormData({
      name: "",
      phone: "",
      email: "",
      company: "",
      preferredChannel: "WhatsApp",
      observations: ""
    })
    setTags([])
    setOpen(false)
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Contato
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Novo Contato
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                placeholder="Nome do contato"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                placeholder="Nome da empresa"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
          </div>

          {/* Contato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="+55 11 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Canal Preferencial */}
          <div className="space-y-2">
            <Label htmlFor="channel">Canal Preferencial</Label>
            <select
              id="channel"
              value={formData.preferredChannel}
              onChange={(e) => setFormData({ ...formData, preferredChannel: e.target.value })}
              className="w-full p-2 border border-border rounded-md bg-background"
            >
              <option value="WhatsApp">WhatsApp</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="E-mail">E-mail</option>
              <option value="Telefone">Telefone</option>
            </select>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label>Tags</Label>
            
            {/* Tags existentes */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Adicionar nova tag */}
            <div className="flex gap-2">
              <Input
                placeholder="Adicionar tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                disabled={!newTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              placeholder="Observações sobre o contato..."
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              rows={4}
            />
          </div>
        </div>
        
        {/* Ações */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={!formData.name || !formData.phone}
              className="bg-primary hover:bg-primary-hover"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Contato
            </Button>
            
            <Button
              onClick={() => {
                handleSave()
                // Aqui abriria uma nova conversa automaticamente
                console.log("Criar conversa ativa para:", formData.name)
              }}
              disabled={!formData.name || !formData.phone}
              variant="outline"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Salvar e Conversar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}