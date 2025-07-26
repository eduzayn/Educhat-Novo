import { useState } from "react"
import { useContactNotes } from "@/hooks/useContactNotes"
import { InternalNoteButton } from "@/components/inbox/InternalNoteButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { StickyNote, Edit3, Trash2, Save, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ContactNotesDisplayProps {
  contactId: number
  className?: string
  onNoteAddedToConversation?: (note: { content: string, authorName: string, authorId?: string }) => void
}

export function ContactNotesDisplay({ contactId, className, onNoteAddedToConversation }: ContactNotesDisplayProps) {
  const { notes, isLoading, fetchNotes, updateNote, deleteNote } = useContactNotes(contactId)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState('')

  const handleEditStart = (id: number, content: string) => {
    setEditingId(id)
    setEditContent(content)
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditContent('')
  }

  const handleEditSave = async (id: number) => {
    if (!editContent.trim()) return

    const success = await updateNote(id, editContent)
    if (success) {
      setEditingId(null)
      setEditContent('')
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
      await deleteNote(id)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className={`p-4 text-center ${className}`}>
        <div className="flex items-center justify-center space-x-2">
          <StickyNote className="w-4 h-4 animate-pulse text-yellow-600" />
          <span className="text-sm text-gray-500">Carregando notas...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <StickyNote className="w-4 h-4 text-yellow-600" />
          <h3 className="text-sm font-medium text-gray-700">Notas Internas</h3>
          <span className="text-xs text-gray-500">({notes.length})</span>
        </div>
        <InternalNoteButton 
          contactId={contactId} 
          onNoteAdded={fetchNotes}
          onNoteAddedToConversation={onNoteAddedToConversation}
        />
      </div>

      {notes && notes.length > 0 ? (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {notes.map((note) => (
            <Card 
              key={note.id} 
              className="bg-yellow-50 border-yellow-200 shadow-sm"
            >
              <CardContent className="p-3">
                {editingId === note.id ? (
                  // Modo de edição
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[80px] bg-white border-yellow-300 focus:border-yellow-500"
                      autoFocus
                    />
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditCancel}
                        className="h-7 px-2 text-xs"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Cancelar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSave(note.id)}
                        disabled={!editContent.trim()}
                        className="h-7 px-2 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Salvar
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Modo de visualização
                  <div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap mb-2">
                      {note.content}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-yellow-700 font-medium">
                          {note.authorName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(note.createdAt)}
                        </span>
                        {note.updatedAt !== note.createdAt && (
                          <span className="text-xs text-gray-400 italic">
                            (editado)
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditStart(note.id, note.content)}
                          className="h-6 w-6 p-0 text-gray-500 hover:text-blue-600"
                          title="Editar nota"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(note.id)}
                          className="h-6 w-6 p-0 text-gray-500 hover:text-red-600"
                          title="Excluir nota"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4 text-center">
            <StickyNote className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-2">Nenhuma nota interna cadastrada</p>
            <p className="text-xs text-gray-400">
              Adicione notas internas para compartilhar informações importantes sobre este contato com sua equipe.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}