import { toast } from "@/hooks/use-toast"
import { knowledgeBaseService } from "./KnowledgeBaseService"

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
  elevenlabs: {
    enabled: boolean
    apiKey: string
    voiceId: string
    model: string
  }
  whisper: {
    enabled: boolean
    model: string
  }
  firecrawl: {
    enabled: boolean
    apiKey: string
  }
}

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
  type?: 'text' | 'audio' | 'image' | 'document'
  audioUrl?: string
  imageUrl?: string
}

interface AgentType {
  type: 'sdr' | 'closer' | 'support'
  context: string
}

interface AIResponse {
  response: string
  agentType: AgentType
  shouldTransfer: boolean
  audioUrl?: string
  confidence?: number
  usedKnowledge?: boolean
  knowledgeSources?: string[]
}

class EnhancedAIService {
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
      },
      elevenlabs: {
        enabled: localStorage.getItem('elevenlabs_enabled') === 'true',
        apiKey: localStorage.getItem('elevenlabs_api_key') || '',
        voiceId: localStorage.getItem('elevenlabs_voice') || '9BWtsMINqrJLrRacOk9x', // Aria
        model: localStorage.getItem('elevenlabs_model') || 'eleven_multilingual_v2'
      },
      whisper: {
        enabled: localStorage.getItem('whisper_enabled') === 'true',
        model: 'whisper-1'
      },
      firecrawl: {
        enabled: localStorage.getItem('firecrawl_enabled') === 'true',
        apiKey: localStorage.getItem('firecrawl_api_key') || ''
      }
    }
  }

  updateConfig(config: AIConfig) {
    this.config = config
    // Save to localStorage
    Object.entries(config).forEach(([provider, settings]) => {
      Object.entries(settings).forEach(([key, value]) => {
        localStorage.setItem(`${provider}_${key}`, value.toString())
      })
    })
  }

  // Analyze message content and intent
  analyzeIntent(messages: Message[]): AgentType {
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || ''
    
    const sdrKeywords = ['preço', 'orçamento', 'cotação', 'valor', 'custo', 'interesse', 'produto', 'serviço', 'solução']
    const closerKeywords = ['comprar', 'adquirir', 'finalizar', 'fechar', 'desconto', 'condições', 'pagamento', 'contrato', 'proposta']
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

  // Generate system prompt based on agent type
  getSystemPrompt(agentType: AgentType, knowledgeContext?: string): string {
    const basePrompt = `Você é ZAIA, assistente virtual especializado da empresa. Seja sempre educado, profissional e prestativo. Responda de forma concisa e objetiva.`
    
    let agentSpecificPrompt = ""
    
    switch (agentType.type) {
      case 'sdr':
        agentSpecificPrompt = `
FUNÇÃO: SDR (Sales Development Representative) - Qualificação de leads e geração de oportunidades.

OBJETIVOS:
- Qualificar interesse e necessidades
- Coletar informações de contato
- Agendar demonstrações
- Nutrir relacionamento

ESTILO: Consultivo, amigável, focado em entender necessidades.`
        break

      case 'closer':
        agentSpecificPrompt = `
FUNÇÃO: Closer - Fechamento de vendas e negociação.

OBJETIVOS:
- Finalizar vendas qualificadas
- Negociar condições
- Superar objeções
- Estruturar propostas

ESTILO: Assertivo, focado em resultados, criador de urgência saudável.`
        break

      case 'support':
        agentSpecificPrompt = `
FUNÇÃO: Suporte - Atendimento técnico e satisfação do cliente.

OBJETIVOS:
- Resolver problemas técnicos
- Esclarecer dúvidas
- Garantir satisfação
- Prevenir cancelamentos

ESTILO: Paciente, empático, didático e solucionador.`
        break

      default:
        agentSpecificPrompt = `
FUNÇÃO: Atendimento geral e suporte ao cliente.`
    }

    let fullPrompt = basePrompt + agentSpecificPrompt

    // Add knowledge context if available
    if (knowledgeContext) {
      fullPrompt += `\n\n${knowledgeContext}`
    }

    return fullPrompt
  }

  // Transcribe audio using OpenAI Whisper
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    if (!this.config.openai.enabled || !this.config.openai.apiKey) {
      throw new Error('OpenAI não configurado para transcrição')
    }

    try {
      const formData = new FormData()
      formData.append('file', audioBlob, 'audio.webm')
      formData.append('model', this.config.whisper.model)
      formData.append('language', 'pt')

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.openai.apiKey}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Whisper API error: ${response.status}`)
      }

      const data = await response.json()
      return data.text || 'Erro na transcrição'
      
    } catch (error) {
      console.error('Whisper transcription error:', error)
      throw error
    }
  }

  // Analyze image using OpenAI Vision
  async analyzeImage(imageUrl: string, prompt: string = "Descreva esta imagem e extraia informações relevantes"): Promise<string> {
    if (!this.config.openai.enabled || !this.config.openai.apiKey) {
      throw new Error('OpenAI não configurado para análise de imagens')
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.openai.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { type: 'image_url', image_url: { url: imageUrl } }
              ]
            }
          ],
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        throw new Error(`Vision API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || 'Erro na análise da imagem'
      
    } catch (error) {
      console.error('Vision API error:', error)
      throw error
    }
  }

  // Generate audio using ElevenLabs
  async generateAudio(text: string): Promise<string> {
    if (!this.config.elevenlabs.enabled || !this.config.elevenlabs.apiKey) {
      throw new Error('ElevenLabs não configurado')
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.config.elevenlabs.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.config.elevenlabs.apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: this.config.elevenlabs.model,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        }),
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      return audioUrl
      
    } catch (error) {
      console.error('ElevenLabs TTS error:', error)
      throw error
    }
  }

  // Scrape website content using Firecrawl
  async scrapeWebsite(url: string): Promise<string> {
    if (!this.config.firecrawl.enabled || !this.config.firecrawl.apiKey) {
      throw new Error('Firecrawl não configurado')
    }

    try {
      const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.firecrawl.apiKey}`,
        },
        body: JSON.stringify({
          url: url,
          formats: ['markdown', 'html'],
          onlyMainContent: true
        }),
      })

      if (!response.ok) {
        throw new Error(`Firecrawl API error: ${response.status}`)
      }

      const data = await response.json()
      return data.data?.markdown || data.data?.html || 'Erro ao extrair conteúdo'
      
    } catch (error) {
      console.error('Firecrawl scraping error:', error)
      throw error
    }
  }

  // Enhanced response generation with knowledge base integration
  async generateResponse(messages: Message[]): Promise<AIResponse> {
    try {
      const agentType = this.analyzeIntent(messages)
      let contextualMessages = [...messages]
      const lastUserMessage = messages[messages.length - 1]?.content || ''
      
      // Search knowledge base for relevant context
      const knowledgeSearch = knowledgeBaseService.smartSearch(lastUserMessage, agentType.type)
      const knowledgeContext = knowledgeBaseService.buildAIContext(knowledgeSearch)
      
      console.log('Knowledge search results:', knowledgeSearch)
      console.log('Knowledge context:', knowledgeContext)
      
      // Process special message types
      for (const message of messages) {
        if (message.type === 'image' && message.imageUrl) {
          const imageAnalysis = await this.analyzeImage(message.imageUrl)
          contextualMessages.push({
            role: 'system',
            content: `Análise da imagem: ${imageAnalysis}`
          })
        }
        
        if (message.type === 'document' && message.content.startsWith('http')) {
          try {
            const scrapedContent = await this.scrapeWebsite(message.content)
            contextualMessages.push({
              role: 'system',
              content: `Conteúdo do documento: ${scrapedContent.substring(0, 2000)}...`
            })
          } catch (error) {
            console.warn('Erro ao processar documento:', error)
          }
        }
      }

      // Generate text response with knowledge context
      let textResponse = ''
      
      if (this.config.openai.enabled && this.config.openai.apiKey) {
        textResponse = await this.callOpenAI(contextualMessages, agentType, knowledgeContext)
      } else {
        throw new Error('Nenhuma IA configurada')
      }

      // Generate audio response if enabled
      let audioUrl: string | undefined
      if (this.config.elevenlabs.enabled && this.config.elevenlabs.apiKey) {
        try {
          audioUrl = await this.generateAudio(textResponse)
        } catch (error) {
          console.warn('Erro ao gerar áudio:', error)
        }
      }

      const shouldTransfer = this.shouldTransferToHuman(contextualMessages, textResponse)
      
      return {
        response: textResponse,
        agentType,
        shouldTransfer,
        audioUrl,
        confidence: knowledgeSearch.items.length > 0 ? 0.95 : 0.7,
        usedKnowledge: knowledgeSearch.items.length > 0,
        knowledgeSources: knowledgeSearch.items.map(item => item.title)
      }
      
    } catch (error) {
      console.error('Enhanced AI Service error:', error)
      toast({
        title: "Erro na IA",
        description: "Não foi possível gerar resposta automática.",
        variant: "destructive"
      })
      
      return {
        response: "Desculpe, estou com dificuldades técnicas no momento. Vou transferir você para um atendente humano.",
        agentType: { type: 'support', context: 'Erro técnico' },
        shouldTransfer: true
      }
    }
  }

  // Call OpenAI API (enhanced with knowledge context)
  private async callOpenAI(messages: Message[], agentType: AgentType, knowledgeContext?: string): Promise<string> {
    if (!this.config.openai.enabled || !this.config.openai.apiKey) {
      throw new Error('OpenAI não configurado')
    }

    const systemPrompt = this.getSystemPrompt(agentType, knowledgeContext)
    
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
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
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

  // Check if should transfer to human
  private shouldTransferToHuman(messages: Message[], aiResponse: string): boolean {
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || ''
    const response = aiResponse.toLowerCase()
    
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
    
    const userWantsHuman = transferKeywords.some(keyword => lastMessage.includes(keyword))
    const aiUncertainty = [
      'não tenho certeza',
      'não posso ajudar',
      'precisa de especialista',
      'transferir'
    ].some(phrase => response.includes(phrase))
    
    return userWantsHuman || aiUncertainty
  }
}

export const enhancedAIService = new EnhancedAIService()