import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, User, Phone, Mail, MessageSquare, Tag, X, Save, Send, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useElegantToast } from "@/components/ui/elegant-toast";
interface NewContactModalProps {
  trigger?: React.ReactNode;
  onSave?: (contactData: any) => void;
}
export function NewContactModal({
  trigger,
  onSave
}: NewContactModalProps) {
  const [open, setOpen] = useState(false);
  const {
    toast
  } = useToast();
  const elegantToast = useElegantToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    assignedUser: "",
    observations: ""
  });

  // Estados para envio de mensagem ativa
  const [sendActiveMessage, setSendActiveMessage] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [activeMessage, setActiveMessage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // Mock dos canais WhatsApp configurados
  const whatsappChannels = [{
    id: "comercial",
    name: "WhatsApp Comercial",
    connected: true
  }, {
    id: "suporte",
    name: "WhatsApp Suporte",
    connected: false
  }, {
    id: "cobranca",
    name: "WhatsApp Cobrança",
    connected: true
  }, {
    id: "marketing",
    name: "WhatsApp Marketing",
    connected: true
  }, {
    id: "vendas",
    name: "WhatsApp Vendas",
    connected: false
  }];

  // Mock dos usuários/proprietários
  const users = [{
    id: "1",
    name: "João Silva"
  }, {
    id: "2",
    name: "Maria Santos"
  }, {
    id: "3",
    name: "Pedro Costa"
  }, {
    id: "4",
    name: "Ana Oliveira"
  }];
  const validateForm = () => {
    if (!formData.name.trim()) {
      elegantToast.validationError("Nome é obrigatório");
      return false;
    }
    if (sendActiveMessage && !selectedChannel) {
      elegantToast.validationError("Selecione um canal para enviar mensagem");
      return false;
    }
    if (sendActiveMessage && !activeMessage.trim()) {
      elegantToast.validationError("Digite a mensagem ativa");
      return false;
    }
    if (selectedChannel && !activeMessage.trim()) {
      elegantToast.validationError("Digite a mensagem ativa");
      return false;
    }
    return true;
  };
  const handleCreateContact = async () => {
    if (!validateForm()) return;
    try {
      const contactData = {
        ...formData,
        tags,
        createdAt: new Date().toISOString(),
        sendActiveMessage,
        selectedChannel,
        activeMessage: sendActiveMessage ? activeMessage : null
      };
      console.log("Criando contato com dados:", contactData);

      // Simular criação do contato
      if (sendActiveMessage && selectedChannel && activeMessage) {
        const channel = whatsappChannels.find(ch => ch.id === selectedChannel);
        if (!channel?.connected) {
          elegantToast.warning("Canal desconectado", "Contato criado, mas o canal WhatsApp está desconectado");
        } else {
          elegantToast.success("Sucesso!", "Contato criado e mensagem enviada");
        }
      } else {
        elegantToast.created(contactData.name, "Contato");
      }
      onSave?.(contactData);
      resetForm();
      setOpen(false);
    } catch (error) {
      elegantToast.networkError("criar contato");
    }
  };
  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      company: "",
      assignedUser: "",
      observations: ""
    });
    setSendActiveMessage(false);
    setSelectedChannel("");
    setActiveMessage("");
    setTags([]);
    setNewTag("");
  };
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // Verificar se há canais desconectados
  const hasDisconnectedChannels = whatsappChannels.some(ch => !ch.connected);
  return <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Contato
          </Button>}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Novo Contato
          </DialogTitle>
        </DialogHeader>
        
        {/* Aviso sobre canais desconectados */}
        {hasDisconnectedChannels && <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              WhatsApp não conectado. Configure nas Configurações → Canais para sincronização automática
            </AlertDescription>
          </Alert>}

        <div className="space-y-6 py-4">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input id="name" placeholder="Nome do contato" value={formData.name} onChange={e => setFormData({
              ...formData,
              name: e.target.value
            })} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input id="company" placeholder="Nome da empresa" value={formData.company} onChange={e => setFormData({
              ...formData,
              company: e.target.value
            })} />
            </div>
          </div>

          {/* Contato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="email@exemplo.com" value={formData.email} onChange={e => setFormData({
                ...formData,
                email: e.target.value
              })} className="pl-10" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="phone" placeholder="+55 11 99999-9999" value={formData.phone} onChange={e => setFormData({
                ...formData,
                phone: e.target.value
              })} className="pl-10" />
              </div>
            </div>
          </div>

          {/* Proprietário */}
          <div className="space-y-2">
            <Label htmlFor="assignedUser">Proprietário</Label>
            <Select value={formData.assignedUser} onValueChange={value => setFormData({
            ...formData,
            assignedUser: value
          })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o proprietário" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Enviar Mensagem Ativa */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="sendActiveMessage" checked={sendActiveMessage} onChange={e => setSendActiveMessage(e.target.checked)} className="h-4 w-4" />
              <Label htmlFor="sendActiveMessage" className="flex items-center cursor-pointer">
                <Send className="h-4 w-4 mr-2" />
                Enviar Mensagem Ativa
              </Label>
            </div>

            <p className="text-sm text-muted-foreground">
              Configure um canal e mensagem para enviar automaticamente após criar o contato.
            </p>

            {/* Canal WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="whatsappChannel">Canal WhatsApp</Label>
              <Select value={selectedChannel} onValueChange={value => {
              setSelectedChannel(value);
              if (value && !sendActiveMessage) {
                setSendActiveMessage(true);
              }
            }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um canal (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {whatsappChannels.map(channel => <SelectItem key={channel.id} value={channel.id} disabled={!channel.connected}>
                      <div className="flex items-center justify-between w-full">
                        <span>{channel.name}</span>
                        {!channel.connected && <Badge variant="destructive" className="ml-2 text-xs">
                            Desconectado
                          </Badge>}
                      </div>
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Mensagem Ativa */}
            <div className="space-y-2">
              <Label htmlFor="activeMessage">Mensagem Ativa</Label>
              <Textarea id="activeMessage" placeholder="Digite a mensagem que será enviada automaticamente após criar o contato..." value={activeMessage} onChange={e => {
              setActiveMessage(e.target.value);
              if (e.target.value && !sendActiveMessage) {
                setSendActiveMessage(true);
              }
            }} rows={3} disabled={!selectedChannel} />
            </div>
          </div>

          {/* Observações */}
          
        </div>
        
        {/* Ações */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => {
          resetForm();
          setOpen(false);
        }}>
            Cancelar
          </Button>
          
          <Button onClick={handleCreateContact} disabled={!formData.name.trim()} className="bg-primary hover:bg-primary-hover">
            <Save className="h-4 w-4 mr-2" />
            Criar Contato
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
}