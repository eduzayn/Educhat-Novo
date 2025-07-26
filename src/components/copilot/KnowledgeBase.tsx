import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import { 
  FileText, 
  Link, 
  MessageSquare, 
  Upload, 
  Brain, 
  Search,
  Plus,
  Trash2,
  Edit,
  Download,
  Globe,
  BookOpen,
  HelpCircle,
  Database,
  Zap,
  CheckCircle
} from "lucide-react"

interface Document {
  id: number
  name: string
  type: 'pdf' | 'doc' | 'txt' | 'url'
  content: string
  category: string
  status: 'processing' | 'ready' | 'error'
  createdAt: string
  size?: string
}

interface FAQ {
  id: number
  question: string
  answer: string
  category: string
  keywords: string[]
  createdAt: string
}

interface WebSource {
  id: number
  url: string
  title: string
  content: string
  lastCrawled: string
  status: 'active' | 'error' | 'pending'
}

export function KnowledgeBase() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      name: "Manual do Produto v2.1.pdf",
      type: 'pdf',
      content: "Manual completo com todas as funcionalidades...",
      category: "Produto",
      status: 'ready',
      createdAt: "2024-01-15",
      size: "2.5 MB"
    },
    {
      id: 2,
      name: "Políticas de Atendimento",
      type: 'doc',
      content: "Diretrizes para atendimento ao cliente...",
      category: "Atendimento",
      status: 'ready',
      createdAt: "2024-01-10",
      size: "1.2 MB"
    }
  ])

  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: 1,
      question: "Como cancelar minha assinatura?",
      answer: "Para cancelar sua assinatura, acesse Configurações > Assinatura > Cancelar. O cancelamento é efetivo no próximo ciclo de cobrança.",
      category: "Financeiro",
      keywords: ["cancelar", "assinatura", "subscription"],
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      question: "Qual o prazo de entrega?",
      answer: "O prazo padrão é de 5-7 dias úteis para produtos físicos e imediato para produtos digitais.",
      category: "Vendas",
      keywords: ["prazo", "entrega", "delivery"],
      createdAt: "2024-01-12"
    }
  ])

  const [webSources, setWebSources] = useState<WebSource[]>([
    {
      id: 1,
      url: "https://minhaempresa.com/faq",
      title: "FAQ Oficial",
      content: "Perguntas frequentes atualizadas...",
      lastCrawled: "2024-01-15 10:30",
      status: 'active'
    }
  ])

  // Form states
  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "", category: "Geral", keywords: "" })
  const [newURL, setNewURL] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Add new FAQ
  const handleAddFAQ = () => {
    if (!newFAQ.question || !newFAQ.answer) {
      toast({
        title: "Erro",
        description: "Pergunta e resposta são obrigatórias.",
        variant: "destructive"
      })
      return
    }

    const faq: FAQ = {
      id: Date.now(),
      question: newFAQ.question,
      answer: newFAQ.answer,
      category: newFAQ.category,
      keywords: newFAQ.keywords.split(',').map(k => k.trim()),
      createdAt: new Date().toISOString().split('T')[0]
    }

    setFaqs(prev => [...prev, faq])
    setNewFAQ({ question: "", answer: "", category: "Geral", keywords: "" })
    
    toast({
      title: "FAQ adicionada",
      description: "Nova pergunta e resposta foram adicionadas à base de conhecimento."
    })
  }

  // Add web source
  const handleAddWebSource = async () => {
    if (!newURL) return

    const webSource: WebSource = {
      id: Date.now(),
      url: newURL,
      title: "Processando...",
      content: "",
      lastCrawled: new Date().toLocaleString(),
      status: 'pending'
    }

    setWebSources(prev => [...prev, webSource])
    setNewURL("")

    // Simulate crawling process
    setTimeout(() => {
      setWebSources(prev => prev.map(ws => 
        ws.id === webSource.id 
          ? { ...ws, title: "Conteúdo Extraído", content: "Conteúdo do site processado...", status: 'active' }
          : ws
      ))
      
      toast({
        title: "Site processado",
        description: "Conteúdo do site foi extraído e adicionado à base de conhecimento."
      })
    }, 3000)
  }

  // Delete functions
  const handleDeleteFAQ = (id: number) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id))
    toast({
      title: "FAQ removida",
      description: "Pergunta e resposta foram removidas da base."
    })
  }

  const handleDeleteWebSource = (id: number) => {
    setWebSources(prev => prev.filter(ws => ws.id !== id))
    toast({
      title: "Fonte removida",
      description: "Site foi removido da base de conhecimento."
    })
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const document: Document = {
      id: Date.now(),
      name: file.name,
      type: file.type.includes('pdf') ? 'pdf' : 'doc',
      content: "",
      category: "Geral",
      status: 'processing',
      createdAt: new Date().toISOString().split('T')[0],
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
    }

    setDocuments(prev => [...prev, document])

    // Simulate processing
    setTimeout(() => {
      setDocuments(prev => prev.map(doc => 
        doc.id === document.id 
          ? { ...doc, status: 'ready', content: "Conteúdo extraído do documento..." }
          : doc
      ))
      
      toast({
        title: "Documento processado",
        description: "Documento foi analisado e adicionado à base de conhecimento."
      })
    }, 2000)
  }

  // Filter functions
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchTerm === "" || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(faqs.map(faq => faq.category)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-xl">
                <Database className="h-6 w-6 mr-3" />
                Base de Conhecimento ZAIA
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Alimente a IA com contexto específico da sua empresa
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-success/10 text-success">
                <CheckCircle className="h-3 w-3 mr-1" />
                {documents.length + faqs.length + webSources.length} itens
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs for different content types */}
      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq" className="flex items-center space-x-2">
            <HelpCircle className="h-4 w-4" />
            <span>FAQ</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Documentos</span>
          </TabsTrigger>
          <TabsTrigger value="websites" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Sites</span>
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Treinamento</span>
          </TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="mt-6">
          <div className="space-y-6">
            {/* Add new FAQ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Adicionar Nova FAQ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Pergunta</Label>
                    <Textarea
                      value={newFAQ.question}
                      onChange={(e) => setNewFAQ(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="Como posso..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Resposta</Label>
                    <Textarea
                      value={newFAQ.answer}
                      onChange={(e) => setNewFAQ(prev => ({ ...prev, answer: e.target.value }))}
                      placeholder="Para fazer isso, você deve..."
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Categoria</Label>
                    <Select 
                      value={newFAQ.category} 
                      onValueChange={(value) => setNewFAQ(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vendas">Vendas</SelectItem>
                        <SelectItem value="Suporte">Suporte</SelectItem>
                        <SelectItem value="Financeiro">Financeiro</SelectItem>
                        <SelectItem value="Produto">Produto</SelectItem>
                        <SelectItem value="Geral">Geral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Palavras-chave (separadas por vírgula)</Label>
                    <Input
                      value={newFAQ.keywords}
                      onChange={(e) => setNewFAQ(prev => ({ ...prev, keywords: e.target.value }))}
                      placeholder="cancelar, assinatura, billing"
                    />
                  </div>
                </div>
                
                <Button onClick={handleAddFAQ} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar FAQ
                </Button>
              </CardContent>
            </Card>

            {/* Search and filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar nas FAQs..."
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                        <p className="text-muted-foreground text-sm mb-3">{faq.answer}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{faq.category}</Badge>
                          {faq.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir FAQ</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta FAQ? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteFAQ(faq.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-6">
          <div className="space-y-6">
            {/* Upload new document */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload de Documentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Arraste arquivos ou clique para selecionar
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="document-upload"
                  />
                  <Button asChild>
                    <label htmlFor="document-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar Arquivo
                    </label>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Suporta: PDF, DOC, DOCX, TXT (máx. 10MB)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Documents list */}
            <div className="space-y-4">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-medium text-foreground">{doc.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>{doc.createdAt}</span>
                            <span>•</span>
                            <Badge variant="outline">{doc.category}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {doc.status === 'processing' && (
                          <Badge variant="secondary">
                            <Zap className="h-3 w-3 mr-1 animate-pulse" />
                            Processando
                          </Badge>
                        )}
                        {doc.status === 'ready' && (
                          <Badge variant="outline" className="bg-success/10 text-success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Pronto
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Websites Tab */}
        <TabsContent value="websites" className="mt-6">
          <div className="space-y-6">
            {/* Add new website */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Link className="h-5 w-5 mr-2" />
                  Adicionar Site
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newURL}
                    onChange={(e) => setNewURL(e.target.value)}
                    placeholder="https://minhaempresa.com/faq"
                    className="flex-1"
                  />
                  <Button onClick={handleAddWebSource}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  A ZAIA irá extrair o conteúdo automaticamente e manter atualizado
                </p>
              </CardContent>
            </Card>

            {/* Website sources */}
            <div className="space-y-4">
              {webSources.map((source) => (
                <Card key={source.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-medium text-foreground">{source.title}</h3>
                          <p className="text-sm text-muted-foreground">{source.url}</p>
                          <p className="text-xs text-muted-foreground">
                            Última atualização: {source.lastCrawled}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {source.status === 'pending' && (
                          <Badge variant="secondary">
                            <Zap className="h-3 w-3 mr-1 animate-pulse" />
                            Processando
                          </Badge>
                        )}
                        {source.status === 'active' && (
                          <Badge variant="outline" className="bg-success/10 text-success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Ativo
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover Site</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover este site da base de conhecimento?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteWebSource(source.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Status do Treinamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-semibold">{documents.length}</p>
                    <p className="text-sm text-muted-foreground">Documentos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-semibold">{faqs.length}</p>
                    <p className="text-sm text-muted-foreground">FAQs</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-semibold">{webSources.length}</p>
                    <p className="text-sm text-muted-foreground">Sites</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="border rounded-lg p-4 bg-muted/10">
                <h4 className="font-medium mb-2">Próximas Melhorias</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Atualização automática de conteúdo web</li>
                  <li>• Análise de sentimento em conversas</li>
                  <li>• Sugestões de novas FAQs baseadas em perguntas frequentes</li>
                  <li>• Integração com sistema de tickets</li>
                </ul>
              </div>
              
              <Button className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Treinar IA com Novo Conteúdo
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}