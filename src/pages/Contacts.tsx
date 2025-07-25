import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Trash2
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

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  )

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
            
            <Button className="bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Novo Contato
            </Button>
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
            
            <Button variant="outline">
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
                <p className="text-2xl font-bold text-foreground">{contacts.length}</p>
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
                  {contacts.filter(c => c.channel === "WhatsApp").length}
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
                  {contacts.filter(c => c.channel === "E-mail").length}
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
                  {contacts.filter(c => c.channel === "Instagram").length}
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
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
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
    </div>
  )
}