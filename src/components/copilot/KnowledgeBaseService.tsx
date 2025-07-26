interface KnowledgeItem {
  id: number
  type: 'faq' | 'document' | 'website'
  title: string
  content: string
  category: string
  keywords: string[]
  relevanceScore?: number
}

interface KnowledgeSearchResult {
  items: KnowledgeItem[]
  totalFound: number
  searchTerms: string[]
}

class KnowledgeBaseService {
  private static instance: KnowledgeBaseService
  private knowledge: KnowledgeItem[] = []

  static getInstance(): KnowledgeBaseService {
    if (!KnowledgeBaseService.instance) {
      KnowledgeBaseService.instance = new KnowledgeBaseService()
    }
    return KnowledgeBaseService.instance
  }

  // Initialize with default knowledge base
  constructor() {
    this.loadKnowledgeBase()
  }

  private loadKnowledgeBase() {
    // Load from localStorage or API
    const stored = localStorage.getItem('zaia_knowledge_base')
    if (stored) {
      this.knowledge = JSON.parse(stored)
    } else {
      // Default knowledge base
      this.knowledge = [
        {
          id: 1,
          type: 'faq',
          title: 'Como cancelar minha assinatura?',
          content: 'Para cancelar sua assinatura, acesse Configurações > Assinatura > Cancelar. O cancelamento é efetivo no próximo ciclo de cobrança. Não há multa para cancelamento.',
          category: 'Financeiro',
          keywords: ['cancelar', 'assinatura', 'subscription', 'billing']
        },
        {
          id: 2,
          type: 'faq',
          title: 'Qual o prazo de entrega?',
          content: 'O prazo padrão é de 5-7 dias úteis para produtos físicos e imediato para produtos digitais. Para entregas expressas, oferecemos opção de 1-2 dias úteis por taxa adicional.',
          category: 'Vendas',
          keywords: ['prazo', 'entrega', 'delivery', 'envio', 'tempo']
        },
        {
          id: 3,
          type: 'document',
          title: 'Política de Reembolso',
          content: 'Nossa política permite reembolso integral em até 30 dias para produtos digitais e 60 dias para produtos físicos, desde que não utilizados. O processo leva 5-7 dias úteis.',
          category: 'Atendimento',
          keywords: ['reembolso', 'devolução', 'money back', 'refund']
        },
        {
          id: 4,
          type: 'document',
          title: 'Preços e Planos',
          content: 'Plano Básico: R$ 99/mês - até 1000 contatos. Plano Pro: R$ 199/mês - até 5000 contatos + automações. Plano Enterprise: R$ 399/mês - ilimitado + suporte dedicado.',
          category: 'Vendas',
          keywords: ['preço', 'valor', 'plano', 'custo', 'pricing']
        },
        {
          id: 5,
          type: 'website',
          title: 'Recursos da Plataforma',
          content: 'Nossa plataforma oferece: CRM integrado, automação de marketing, relatórios avançados, integração com WhatsApp, chatbot IA, gestão de leads, pipeline de vendas.',
          category: 'Produto',
          keywords: ['recursos', 'funcionalidades', 'features', 'crm', 'automação']
        }
      ]
      this.saveKnowledgeBase()
    }
  }

  private saveKnowledgeBase() {
    localStorage.setItem('zaia_knowledge_base', JSON.stringify(this.knowledge))
  }

  // Add new knowledge item
  addKnowledgeItem(item: Omit<KnowledgeItem, 'id'>): void {
    const newItem: KnowledgeItem = {
      ...item,
      id: Date.now()
    }
    this.knowledge.push(newItem)
    this.saveKnowledgeBase()
  }

  // Update existing knowledge item
  updateKnowledgeItem(id: number, updates: Partial<KnowledgeItem>): void {
    this.knowledge = this.knowledge.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
    this.saveKnowledgeBase()
  }

  // Delete knowledge item
  deleteKnowledgeItem(id: number): void {
    this.knowledge = this.knowledge.filter(item => item.id !== id)
    this.saveKnowledgeBase()
  }

  // Search knowledge base
  searchKnowledge(query: string, category?: string, limit: number = 5): KnowledgeSearchResult {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2)
    
    if (searchTerms.length === 0) {
      return { items: [], totalFound: 0, searchTerms: [] }
    }

    const results = this.knowledge
      .filter(item => {
        // Filter by category if specified
        if (category && item.category.toLowerCase() !== category.toLowerCase()) {
          return false
        }
        return true
      })
      .map(item => {
        let score = 0
        const itemText = `${item.title} ${item.content} ${item.keywords.join(' ')}`.toLowerCase()
        
        // Calculate relevance score
        searchTerms.forEach(term => {
          // Title match (highest weight)
          if (item.title.toLowerCase().includes(term)) {
            score += 10
          }
          
          // Keywords match (high weight)
          if (item.keywords.some(keyword => keyword.toLowerCase().includes(term))) {
            score += 8
          }
          
          // Content match (medium weight)
          if (item.content.toLowerCase().includes(term)) {
            score += 5
          }
          
          // Exact word match bonus
          const exactMatch = new RegExp(`\\b${term}\\b`, 'i')
          if (exactMatch.test(itemText)) {
            score += 3
          }
        })
        
        return { ...item, relevanceScore: score }
      })
      .filter(item => item.relevanceScore! > 0)
      .sort((a, b) => b.relevanceScore! - a.relevanceScore!)
      .slice(0, limit)

    return {
      items: results,
      totalFound: results.length,
      searchTerms
    }
  }

  // Get knowledge by category
  getKnowledgeByCategory(category: string): KnowledgeItem[] {
    return this.knowledge.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    )
  }

  // Get all knowledge items
  getAllKnowledge(): KnowledgeItem[] {
    return this.knowledge
  }

  // Build context for AI from search results
  buildAIContext(searchResults: KnowledgeSearchResult): string {
    if (searchResults.items.length === 0) {
      return ""
    }

    let context = "## CONTEXTO DA BASE DE CONHECIMENTO:\n\n"
    
    searchResults.items.forEach((item, index) => {
      context += `### ${index + 1}. ${item.title} (${item.type.toUpperCase()} - ${item.category})\n`
      context += `${item.content}\n\n`
    })
    
    context += "## INSTRUÇÕES:\n"
    context += "- Use APENAS as informações do contexto acima para responder\n"
    context += "- Se a informação não estiver no contexto, informe que precisa verificar\n"
    context += "- Cite a fonte quando possível (ex: 'Segundo nossa política...')\n"
    context += "- Seja preciso e use os dados exatos fornecidos\n\n"
    
    return context
  }

  // Smart search based on agent type and user message
  smartSearch(userMessage: string, agentType: 'sdr' | 'closer' | 'support'): KnowledgeSearchResult {
    // Define category mapping for agent types
    const categoryMapping = {
      'sdr': ['Vendas', 'Produto'],
      'closer': ['Vendas', 'Financeiro', 'Produto'],
      'support': ['Atendimento', 'Produto', 'Suporte']
    }
    
    const relevantCategories = categoryMapping[agentType]
    
    // First, try to find exact matches in relevant categories
    let results = this.searchKnowledge(userMessage, undefined, 10)
    
    // Filter by relevant categories and re-score
    results.items = results.items.filter(item => 
      relevantCategories.includes(item.category)
    ).slice(0, 3) // Limit to top 3 for context size
    
    // If no results in relevant categories, expand search
    if (results.items.length === 0) {
      results = this.searchKnowledge(userMessage, undefined, 3)
    }
    
    return results
  }
}

export const knowledgeBaseService = KnowledgeBaseService.getInstance()