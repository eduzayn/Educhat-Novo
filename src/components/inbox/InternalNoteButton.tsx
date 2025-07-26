import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StickyNote } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface InternalNoteButtonProps {
  contactId: number
  onNoteAdded?: () => void
  onNoteAddedToConversation?: (note: { content: string, authorName: string, authorId?: string }) => void
  className?: string
}

export function InternalNoteButton({ contactId, onNoteAdded, onNoteAddedToConversation, className }: InternalNoteButtonProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [noteContent, setNoteContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock user data - substituir por hook de autenticação real
  const user = {
    displayName: "Atendente",
    id: "1"
  }

  const handleSaveNote = async () => {
    if (!noteContent.trim()) return

    setIsSubmitting(true)
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))

      // TODO: Implementar chamada real para API
      // const response = await fetch(`/api/contacts/${contactId}/notes`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     content: noteContent.trim(),
      //     authorName: user?.displayName || user?.username || 'Atendente',
      //     authorId: user?.id?.toString()
      //   })
      // })

      // if (response.ok) {
        setNoteContent('')
        setShowDialog(false)
        
        // Callback para recarregar notas no painel lateral
        onNoteAdded?.()
        
        // Callback para adicionar nota como mensagem na conversa
        onNoteAddedToConversation?.({
          content: noteContent.trim(),
          authorName: user?.displayName || 'Atendente',
          authorId: user?.id
        })
        
        toast({
          title: "Nota interna adicionada",
          description: "A nota foi salva e aparece na conversa."
        })
      // } else {
      //   throw new Error('Erro ao salvar nota')
      // }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a nota.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setShowDialog(false)
    setNoteContent('')
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 w-7 p-0 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 ${className}`}
          title="Nota interna"
        >
          <StickyNote className="w-3.5 h-3.5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <StickyNote className="w-4 h-4 text-yellow-600" />
            <span>Adicionar Nota Interna</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Nota (visível apenas para a equipe interna)
            </label>
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Digite sua nota interna sobre este contato..."
              className="min-h-[120px] resize-none"
              autoFocus
            />
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <StickyNote className="w-3 h-3 mr-1" />
            Esta nota será salva como privada e visível apenas para a equipe
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveNote}
              disabled={!noteContent.trim() || isSubmitting}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Nota'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}