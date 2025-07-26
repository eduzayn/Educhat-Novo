import { toast } from "@/hooks/use-toast"

interface AIConfig {
  openai: {
    enabled: boolean
    apiKey: string
    model: string
  }
  perplexity: {
    enabled: boolean
    apiKey: string
    model: string
  }
  anthropic: {
    enabled: boolean
    apiKey: string
    model: string
  }
}

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
}

interface AgentType {
  type: 'sdr' | 'closer' | 'support'
  context: string
}

class AIService {
  private config: AIConfig

  constructor() {
    this.config = {
      openai: {
        enabled: localStorage.getItem('openai_enabled') === 'true',
        apiKey: localStorage.getItem('openai_api_key') || '',
        model: localStorage.getItem('openai_model') || 'gpt-4.1-2025-04-14'
      },
      perplexity: {
        enabled: localStorage.getItem('perplexity_enabled') === 'true',
        apiKey: localStorage.getItem('perplexity_api_key') || '',
        model: localStorage.getItem('perplexity_model') || 'llama-3.1-sonar-small-128k-online'
      },
      anthropic: {
        enabled: localStorage.getItem('anthropic_enabled') === 'true',
        apiKey: localStorage.getItem('anthropic_api_key') || '',
        model: localStorage.getItem('anthropic_model') || 'claude-sonnet-4-20250514'
      }
    }
  }

  updateConfig(config: AIConfig) {
    this.config = config
    // Save to localStorage
    Object.entries(config).forEach(([provider, settings]) => {
      localStorage.setItem(`${provider}_enabled`, settings.enabled.toString())
      localStorage.setItem(`${provider}_api_key`, settings.apiKey)
      localStorage.setItem(`${provider}_model`, settings.model)
    })
  }

  // Determine the appropriate agent type based on message content
  analyzeIntent(messages: Message[]): AgentType {
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || ''
    
    // SDR keywords
    const sdrKeywords = ['preço', 'orçamento', 'cotação', 'valor', 'custo', 'interesse', 'produto', 'serviço', 'solução']
    
    // Closer keywords  
    const closerKeywords = ['comprar', 'adquirir', 'finalizar', 'fechar', 'desconto', 'condições', 'pagamento', 'contrato', 'proposta']
    
    // Support keywords
    const supportKeywords = ['problema', 'erro', 'ajuda', 'suporte', 'dúvida', 'não funciona', 'como fazer', 'tutorial']

    const sdrScore = sdrKeywords.filter(keyword => lastMessage.includes(keyword)).length
    const closerScore = closerKeywords.filter(keyword => lastMessage.includes(keyword)).length
    const supportScore = supportKeywords.filter(keyword => lastMessage.includes(keyword)).length

    if (closerScore > sdrScore && closerScore > supportScore) {
      return { type: 'closer', context: 'Foco em fechamento de vendas e negociação' }
    } else if (supportScore > sdrScore && supportScore > closerScore) {
      return { type: 'support', context: 'Foco em resolver problemas e dar suporte' }
    } else {
      return { type: 'sdr', context: 'Foco em qualificação e geração de leads' }
    }
  }

  // Get system prompt based on agent type
  getSystemPrompt(agentType: AgentType): string {
    const basePrompt = `Você é um assistente virtual especializado da empresa. Seja sempre educado, profissional e prestativo.`
    
    switch (agentType.type) {
      case 'sdr':
        return `${basePrompt}

FUNÇÃO: Você é um SDR (Sales Development Representative) especializado em qualificação de leads e geração de oportunidades.

OBJETIVOS:
- Qualificar o interesse do lead
- Entender as necessidades específicas
- Coletar informações de contato
- Agendar demonstrações ou reuniões
- Nutrir relacionamento para conversão

DIRETRIZES:
- Faça perguntas qualificadoras abertas
- Identifique dor/necessidade do cliente
- Apresente soluções de forma consultiva
- Mantenha tom amigável e profissional
- Colete dados para CRM (nome, empresa, cargo, necessidade)
- Ofereça materiais educativos
- Proponha próximos passos claros

QUANDO TRANSFERIR: Se o lead demonstrar interesse comercial forte e quiser negociar/comprar imediatamente.`

      case 'closer':
        return `${basePrompt}

FUNÇÃO: Você é um Closer especializado em fechamento de vendas e negociação.

OBJETIVOS:
- Finalizar vendas qualificadas
- Negociar condições e preços
- Superar objeções
- Estruturar propostas comerciais
- Acelerar ciclo de vendas

DIRETRIZES:
- Use técnicas de fechamento consultivo
- Apresente valor e ROI claramente
- Ofereça condições atrativas
- Crie senso de urgência saudável
- Mantenha foco no benefício para cliente
- Estruture propostas personalizadas
- Acompanhe processo de decisão

QUANDO TRANSFERIR: Se surgir questão técnica complexa ou problema pós-venda que não conseguir resolver.`

      case 'support':
        return `${basePrompt}

FUNÇÃO: Você é um especialista em suporte técnico e atendimento ao cliente.

OBJETIVOS:
- Resolver problemas técnicos
- Esclarecer dúvidas sobre produtos/serviços
- Orientar sobre uso correto
- Garantir satisfação do cliente
- Prevenir cancelamentos

DIRETRIZES:
- Seja paciente e empático
- Ofereça soluções práticas e claras
- Use linguagem simples e didática
- Verifique se problema foi resolvido
- Documente soluções para base de conhecimento
- Seja proativo em oferecer ajuda adicional
- Mantenha histórico de interações

QUANDO TRANSFERIR: Se problema requerer intervenção técnica especializada ou questão comercial/financeira complexa.`

      default:
        return basePrompt
    }
  }

  // Call OpenAI API
  async callOpenAI(messages: Message[], agentType: AgentType): Promise<string> {
    if (!this.config.openai.enabled || !this.config.openai.apiKey) {
      throw new Error('OpenAI não configurado')
    }

    const systemPrompt = this.getSystemPrompt(agentType)
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.openai.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.openai.model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || 'Erro ao gerar resposta'
      
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw error
    }
  }

  // Call Perplexity API
  async callPerplexity(messages: Message[], agentType: AgentType): Promise<string> {
    if (!this.config.perplexity.enabled || !this.config.perplexity.apiKey) {
      throw new Error('Perplexity não configurado')
    }

    const systemPrompt = this.getSystemPrompt(agentType)
    
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.perplexity.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.perplexity.model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1000,
          return_images: false,
          return_related_questions: false,
          search_recency_filter: 'month',
          frequency_penalty: 1,
          presence_penalty: 0
        }),
      })

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || 'Erro ao gerar resposta'
      
    } catch (error) {
      console.error('Perplexity API error:', error)
      throw error
    }
  }

  // Call Anthropic API
  async callAnthropic(messages: Message[], agentType: AgentType): Promise<string> {
    if (!this.config.anthropic.enabled || !this.config.anthropic.apiKey) {
      throw new Error('Anthropic não configurado')
    }

    const systemPrompt = this.getSystemPrompt(agentType)
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.config.anthropic.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.config.anthropic.model,
          max_tokens: 1000,
          system: systemPrompt,
          messages: messages.filter(msg => msg.role !== 'system').map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
          }))
        }),
      })

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`)
      }

      const data = await response.json()
      return data.content[0]?.text || 'Erro ao gerar resposta'
      
    } catch (error) {
      console.error('Anthropic API error:', error)
      throw error
    }
  }

  // Main method to generate AI response
  async generateResponse(messages: Message[]): Promise<{ response: string, agentType: AgentType, shouldTransfer: boolean }> {
    try {
      // Analyze intent to determine agent type
      const agentType = this.analyzeIntent(messages)
      
      let response = ''
      
      // Try APIs in order of preference
      if (this.config.openai.enabled && this.config.openai.apiKey) {
        response = await this.callOpenAI(messages, agentType)
      } else if (this.config.anthropic.enabled && this.config.anthropic.apiKey) {
        response = await this.callAnthropic(messages, agentType)
      } else if (this.config.perplexity.enabled && this.config.perplexity.apiKey) {
        response = await this.callPerplexity(messages, agentType)
      } else {
        throw new Error('Nenhuma IA configurada')
      }

      // Check if should transfer to human
      const shouldTransfer = this.shouldTransferToHuman(messages, response)
      
      return {
        response,
        agentType,
        shouldTransfer
      }
      
    } catch (error) {
      console.error('AI Service error:', error)
      toast({
        title: "Erro na IA",
        description: "Não foi possível gerar resposta automática. Transferindo para atendimento humano.",
        variant: "destructive"
      })
      
      return {
        response: "Desculpe, estou com dificuldades técnicas no momento. Vou transferir você para um atendente humano que poderá ajudá-lo melhor.",
        agentType: { type: 'support', context: 'Erro técnico' },
        shouldTransfer: true
      }
    }
  }

  // Determine if conversation should be transferred to human
  private shouldTransferToHuman(messages: Message[], aiResponse: string): boolean {
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || ''
    const response = aiResponse.toLowerCase()
    
    // Transfer triggers
    const transferKeywords = [
      'quero falar com humano',
      'atendente humano',
      'gerente',
      'responsável',
      'urgente',
      'emergência',
      'complexo',
      'não consegui resolver',
      'insatisfeito',
      'cancelar'
    ]
    
    // Check if user explicitly asks for human
    const userWantsHuman = transferKeywords.some(keyword => lastMessage.includes(keyword))
    
    // Check if AI indicates uncertainty
    const aiUncertainty = [
      'não tenho certeza',
      'não posso ajudar',
      'precisa de especialista',
      'transferir'
    ].some(phrase => response.includes(phrase))
    
    return userWantsHuman || aiUncertainty
  }
}

export const aiService = new AIService()