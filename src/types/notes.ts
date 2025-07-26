// Tipos para o sistema de anotações internas
export interface ContactNote {
  id: number
  contactId: number
  content: string
  authorName: string
  authorId?: string
  isPrivate: boolean
  createdAt: string
  updatedAt: string
}

export interface InsertContactNote {
  contactId: number
  content: string
  authorName: string
  authorId?: string
  isPrivate?: boolean
}