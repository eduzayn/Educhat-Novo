import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Image, 
  Camera, 
  Headphones, 
  User, 
  BarChart3, 
  Calendar,
  Sticker,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AttachmentOption {
  icon: React.ReactNode
  label: string
  color: string
  bgColor: string
  action: () => void
}

interface AttachmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectAttachment: (type: string) => void
}

export function AttachmentModal({ open, onOpenChange, onSelectAttachment }: AttachmentModalProps) {
  const attachmentOptions: AttachmentOption[] = [
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Documento",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      action: () => onSelectAttachment("document")
    },
    {
      icon: <Image className="h-5 w-5" />,
      label: "Fotos e vídeos",
      color: "text-purple-600", 
      bgColor: "bg-purple-100",
      action: () => onSelectAttachment("media")
    },
    {
      icon: <Camera className="h-5 w-5" />,
      label: "Câmera",
      color: "text-pink-600",
      bgColor: "bg-pink-100", 
      action: () => onSelectAttachment("camera")
    },
    {
      icon: <Headphones className="h-5 w-5" />,
      label: "Áudio",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      action: () => onSelectAttachment("audio")
    },
    {
      icon: <User className="h-5 w-5" />,
      label: "Contato",
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
      action: () => onSelectAttachment("contact")
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Enquete",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      action: () => onSelectAttachment("poll")
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Evento",
      color: "text-red-600",
      bgColor: "bg-red-100",
      action: () => onSelectAttachment("event")
    },
    {
      icon: <Sticker className="h-5 w-5" />,
      label: "Nova figurinha",
      color: "text-green-600",
      bgColor: "bg-green-100",
      action: () => onSelectAttachment("sticker")
    }
  ]

  const handleOptionClick = (option: AttachmentOption) => {
    option.action()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Selecionar anexo
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {attachmentOptions.map((option, index) => (
              <Button
                key={index}
                variant="ghost"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-muted/50 transition-colors"
                onClick={() => handleOptionClick(option)}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  option.bgColor,
                  option.color
                )}>
                  {option.icon}
                </div>
                <span className="text-sm text-foreground font-medium">
                  {option.label}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}