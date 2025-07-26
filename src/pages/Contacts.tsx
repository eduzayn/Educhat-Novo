import { useState } from "react"
import { NewContactModal } from "@/components/modals/NewContactModal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { 
  Search, 
  Plus, 
  Filter, 
  Users, 
  Phone, 
  Mail, 
  MessageSquare,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Archive,
  Star,
  Tag,
  X,
  Save
} from "lucide-react"

// Mock data para contatos
const contacts = [
  {
    id: 1,
    name: "Maria Silva",
    phone: "+55 11 99999-9999",
    email: "maria.silva@email.com",
    channel: "WhatsApp",
    tags: ["Cliente VIP", "Automação"],
    lastContact: "Hoje",
    avatar: null
  },
  {
    id: 2,
    name: "João Santos",
    phone: "+55 11 88888-8888",
    email: "joao.santos@email.com",
    channel: "Instagram",
    tags: ["Prospect"],
    lastContact: "Ontem",
    avatar: null
  },
  {
    id: 3,
    name: "Empresa XYZ",
    phone: "+55 11 77777-7777",
    email: "contato@empresaxyz.com",
    channel: "E-mail",
    tags: ["Corporativo", "B2B"],
    lastContact: "2 dias atrás",
    avatar: null
  },
]

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContacts, setSelectedContacts] = useState<number[]>([])
  const [contactsList, setContactsList] = useState(contacts)
  const [editingContact, setEditingContact] = useState<any>(null)
  const [deletingContact, setDeletingContact] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  const filteredContacts = contactsList.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  )

  // Função para iniciar uma conversa
  const handleStartConversation = (contact: any) => {
    toast({
      title: "Conversa iniciada",
      description: `Iniciando conversa com ${contact.name} via ${contact.channel}`
    })
    // Aqui redirecionaria para a página de inbox com a conversa
    console.log("Iniciando conversa com:", contact)
  }

  // Função para editar contato
  const handleEditContact = (contact: any) => {
    setEditingContact({
      ...contact,
      company: "", // Adicionar campos que podem estar faltando
      assignedUser: "",
      observations: ""
    })
    setIsEditModalOpen(true)
  }

  // Função para salvar edição do contato
  const handleSaveEdit = () => {
    if (!editingContact.name.trim()) {
      toast({ title: "Nome é obrigatório", variant: "destructive" })
      return
    }

    setContactsList(prev => prev.map(contact => 
      contact.id === editingContact.id ? editingContact : contact
    ))
    
    toast({ title: "Contato atualizado com sucesso!" })
    setIsEditModalOpen(false)
    setEditingContact(null)
  }

  // Função para confirmar exclusão
  const handleDeleteContact = (contact: any) => {
    setDeletingContact(contact)
    setIsDeleteDialogOpen(true)
  }

  // Função para excluir contato
  const confirmDeleteContact = () => {
    setContactsList(prev => prev.filter(contact => contact.id !== deletingContact.id))
    toast({ 
      title: "Contato excluído", 
      description: `${deletingContact.name} foi removido dos seus contatos`
    })
    setIsDeleteDialogOpen(false)
    setDeletingContact(null)
  }

  // Função para duplicar contato
  const handleDuplicateContact = (contact: any) => {
    const newContact = {
      ...contact,
      id: Math.max(...contactsList.map(c => c.id)) + 1,
      name: `${contact.name} (Cópia)`,
      phone: "", // Limpar telefone para evitar duplicata
      email: "" // Limpar email para evitar duplicata
    }
    setContactsList(prev => [...prev, newContact])
    toast({ title: "Contato duplicado com sucesso!" })
  }

  // Função para arquivar contato
  const handleArchiveContact = (contact: any) => {
    toast({ 
      title: "Contato arquivado", 
      description: `${contact.name} foi arquivado` 
    })
    // Aqui implementaria a lógica de arquivamento
    console.log("Arquivando contato:", contact)
  }

  // Função para favoritar contato
  const handleFavoriteContact = (contact: any) => {
    toast({ 
      title: "Contato favoritado", 
      description: `${contact.name} foi adicionado aos favoritos` 
    })
    // Aqui implementaria a lógica de favoritos
    console.log("Favoritando contato:", contact)
  }

  return (
    <div className="h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                <Users className="h-6 w-6 mr-3" />
                Contatos
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerencie todos os seus contatos e clientes
              </p>
            </div>
            
            <NewContactModal 
              onSave={(contactData) => {
                const newContact = {
                  ...contactData,
                  id: Math.max(...contactsList.map(c => c.id)) + 1,
                  channel: contactData.selectedChannel ? "WhatsApp" : "Manual",
                  lastContact: "Agora"
                }
                setContactsList(prev => [...prev, newContact])
                toast({ title: "Contato criado com sucesso!" })
              }}
            />
          </div>

          {/* Barra de busca e filtros */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar contatos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button variant="outline" onClick={() => toast({ title: "Filtros em desenvolvimento" })}>
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{contactsList.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">WhatsApp</p>
                <p className="text-2xl font-bold text-foreground">
                  {contactsList.filter(c => c.channel === "WhatsApp").length}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">E-mail</p>
                <p className="text-2xl font-bold text-foreground">
                  {contactsList.filter(c => c.channel === "E-mail").length}
                </p>
              </div>
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Instagram</p>
                <p className="text-2xl font-bold text-foreground">
                  {contactsList.filter(c => c.channel === "Instagram").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de contatos */}
      <div className="px-6 pb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Todos os Contatos ({filteredContacts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredContacts.map((contact) => (
                <Card key={contact.id} className="border border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {contact.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{contact.name}</h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {contact.phone}
                            </div>
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {contact.email}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {contact.channel}
                            </Badge>
                            {contact.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="text-right text-sm text-muted-foreground">
                          <p>Último contato:</p>
                          <p>{contact.lastContact}</p>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleStartConversation(contact)}
                            title="Iniciar conversa"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditContact(contact)}
                            title="Editar contato"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive" 
                            onClick={() => handleDeleteContact(contact)}
                            title="Excluir contato"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" title="Mais opções">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDuplicateContact(contact)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicar contato
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleFavoriteContact(contact)}>
                                <Star className="h-4 w-4 mr-2" />
                                Adicionar aos favoritos
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleArchiveContact(contact)}>
                                <Archive className="h-4 w-4 mr-2" />
                                Arquivar contato
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredContacts.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nenhum contato encontrado
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Tente ajustar sua busca" : "Adicione seu primeiro contato para começar"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="h-5 w-5 mr-2" />
              Editar Contato
            </DialogTitle>
          </DialogHeader>
          
          {editingContact && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome Completo *</Label>
                  <Input
                    id="edit-name"
                    value={editingContact.name}
                    onChange={(e) => setEditingContact({...editingContact, name: e.target.value})}
                    placeholder="Nome do contato"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-company">Empresa</Label>
                  <Input
                    id="edit-company"
                    value={editingContact.company || ""}
                    onChange={(e) => setEditingContact({...editingContact, company: e.target.value})}
                    placeholder="Nome da empresa"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Telefone</Label>
                  <Input
                    id="edit-phone"
                    value={editingContact.phone}
                    onChange={(e) => setEditingContact({...editingContact, phone: e.target.value})}
                    placeholder="+55 11 99999-9999"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-email">E-mail</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingContact.email}
                    onChange={(e) => setEditingContact({...editingContact, email: e.target.value})}
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-channel">Canal Preferencial</Label>
                <Select value={editingContact.channel} onValueChange={(value) => setEditingContact({...editingContact, channel: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="E-mail">E-mail</SelectItem>
                    <SelectItem value="Telefone">Telefone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-observations">Observações</Label>
                <Textarea
                  id="edit-observations"
                  value={editingContact.observations || ""}
                  onChange={(e) => setEditingContact({...editingContact, observations: e.target.value})}
                  placeholder="Observações sobre o contato..."
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o contato <strong>{deletingContact?.name}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteContact}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}