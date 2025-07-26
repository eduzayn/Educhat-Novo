import { useState, useEffect, useRef, useCallback } from "react"
import { toast } from "@/hooks/use-toast"

// Declarações de tipo para Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  start(): void
  stop(): void
  abort(): void
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  readonly length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition
  new(): SpeechRecognition
}

interface UseSpeechRecognitionOptions {
  onTranscript?: (transcript: string) => void
  onError?: (error: string) => void
  language?: string
  continuous?: boolean
  interimResults?: boolean
}

export function useSpeechRecognition({
  onTranscript,
  onError,
  language = 'pt-BR',
  continuous = true,
  interimResults = true
}: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Verificar se o navegador suporta Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()
      
      const recognition = recognitionRef.current
      recognition.continuous = continuous
      recognition.interimResults = interimResults
      recognition.lang = language
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
        console.log('Speech recognition started')
      }

      recognition.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart
          } else {
            interimTranscript += transcriptPart
          }
        }

        const fullTranscript = finalTranscript || interimTranscript
        setTranscript(fullTranscript)
        
        if (finalTranscript && onTranscript) {
          onTranscript(finalTranscript)
        }
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        
        let errorMessage = 'Erro na transcrição de voz'
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'Nenhuma fala detectada. Tente falar mais alto.'
            break
          case 'audio-capture':
            errorMessage = 'Microfone não encontrado ou sem permissão.'
            break
          case 'not-allowed':
            errorMessage = 'Permissão de microfone negada. Verifique as configurações do navegador.'
            break
          case 'network':
            errorMessage = 'Erro de rede. Verifique sua conexão.'
            break
          case 'language-not-supported':
            errorMessage = 'Idioma não suportado.'
            break
          default:
            errorMessage = `Erro de transcrição: ${event.error}`
        }

        if (onError) {
          onError(errorMessage)
        } else {
          toast({
            title: "Erro na transcrição",
            description: errorMessage,
            variant: "destructive"
          })
        }
      }

      recognition.onend = () => {
        setIsListening(false)
        console.log('Speech recognition ended')
      }
    } else {
      setIsSupported(false)
      console.warn('Speech Recognition not supported in this browser')
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [continuous, interimResults, language, onTranscript, onError])

  const startListening = useCallback(() => {
    if (!isSupported) {
      const message = 'Transcrição de voz não suportada neste navegador. Use Chrome, Safari ou Edge.'
      if (onError) {
        onError(message)
      } else {
        toast({
          title: "Funcionalidade não suportada",
          description: message,
          variant: "destructive"
        })
      }
      return
    }

    if (recognitionRef.current && !isListening) {
      setTranscript('')
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error('Error starting speech recognition:', error)
        if (onError) {
          onError('Erro ao iniciar transcrição')
        }
      }
    }
  }, [isSupported, isListening, onError])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
  }, [])

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript
  }
}