import { useState, useEffect } from "react"
import { ContactNote } from "@/types/notes"
import { toast } from "@/hooks/use-toast"

// Hook personalizado para gerenciar notas de contato
export function useContactNotes(contactId: number) {
  const [notes, setNotes] = useState<ContactNote[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Buscar notas do contato
  const fetchNotes = async () => {
    if (!contactId) return
    
    setIsLoading(true)
    try {
      // Por enquanto usando dados mock até integração com backend
      const mockNotes: ContactNote[] = [
        {
          id: 1,
          contactId: contactId,
          content: "Cliente interessado em automação residencial. Já enviamos o catálogo por email.",
          authorName: "João Silva",
          authorId: "1",
          isPrivate: true,
          createdAt: "2024-01-26T10:30:00Z",
          updatedAt: "2024-01-26T10:30:00Z"
        },
        {
          id: 2,
          contactId: contactId,
          content: "Demonstração agendada para próxima semana. Cliente demonstrou muito interesse no kit básico.",
          authorName: "Maria Santos",
          authorId: "2", 
          isPrivate: true,
          createdAt: "2024-01-25T16:45:00Z",
          updatedAt: "2024-01-25T16:45:00Z"
        }
      ]
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      setNotes(mockNotes)
      
      // TODO: Implementar chamada real para API
      // const response = await fetch(`/api/contacts/${contactId}/notes`)
      // if (response.ok) {
      //   const data = await response.json()
      //   setNotes(Array.isArray(data) ? data : [])
      // }
    } catch (error) {
      console.error('Erro ao buscar notas:', error)
      setNotes([])
      toast({
        title: "Erro",
        description: "Não foi possível carregar as notas.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Adicionar nova nota
  const addNote = async (content: string, authorName: string, authorId?: string) => {
    try {
      // Criar nova nota mock
      const newNote: ContactNote = {
        id: Date.now(), // ID temporário
        contactId: contactId,
        content: content.trim(),
        authorName: authorName.trim(),
        authorId: authorId,
        isPrivate: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Adicionar à lista local
      setNotes(prev => [newNote, ...prev])

      toast({
        title: "Nota adicionada",
        description: "A nota interna foi salva com sucesso."
      })

      // TODO: Implementar chamada real para API
      // const response = await fetch(`/api/contacts/${contactId}/notes`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     content: content.trim(),
      //     authorName: authorName.trim(),
      //     authorId: authorId
      //   })
      // })
      
      // if (response.ok) {
      //   await fetchNotes() // Recarregar lista
      //   return true
      // }
      
      return true
    } catch (error) {
      console.error('Erro ao adicionar nota:', error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar a nota.",
        variant: "destructive"
      })
      return false
    }
  }

  // Atualizar nota existente
  const updateNote = async (id: number, content: string) => {
    try {
      setNotes(prev => prev.map(note => 
        note.id === id 
          ? { ...note, content: content.trim(), updatedAt: new Date().toISOString() }
          : note
      ))

      toast({
        title: "Nota atualizada",
        description: "A nota foi atualizada com sucesso."
      })

      // TODO: Implementar chamada real para API
      // const response = await fetch(`/api/contact-notes/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content: content.trim() })
      // })
      
      return true
    } catch (error) {
      console.error('Erro ao atualizar nota:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a nota.",
        variant: "destructive"
      })
      return false
    }
  }

  // Deletar nota
  const deleteNote = async (id: number) => {
    try {
      setNotes(prev => prev.filter(note => note.id !== id))

      toast({
        title: "Nota removida",
        description: "A nota foi removida com sucesso."
      })

      // TODO: Implementar chamada real para API
      // const response = await fetch(`/api/contact-notes/${id}`, {
      //   method: 'DELETE'
      // })
      
      return true
    } catch (error) {
      console.error('Erro ao deletar nota:', error)
      toast({
        title: "Erro",
        description: "Não foi possível remover a nota.",
        variant: "destructive"
      })
      return false
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [contactId])

  return { 
    notes, 
    isLoading, 
    fetchNotes, 
    addNote, 
    updateNote, 
    deleteNote 
  }
}