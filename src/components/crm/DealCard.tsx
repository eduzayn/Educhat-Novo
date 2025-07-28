import React, { memo } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Building2, MoreHorizontal, Edit, Trash, Lock } from 'lucide-react';
// Substitua pelos imports corretos do seu projeto:
// import { useAuth } from '@/seu-caminho/useAuth';
// import { useUserPermissions, canEditDeal } from '@/seu-caminho/permissions';

// Hooks temporários - SUBSTITUA pelos seus hooks reais
const useAuth = () => ({ user: { id: 'current-user' } });
const useUserPermissions = () => ({ data: {} });
const canEditDeal = (permissions: any, deal: any, userId: string) => true;

interface DealCardProps {
  deal: any;
  index: number;
  onEdit: (deal: any) => void;
  onDelete: (dealId: string) => void;
}

const DealCardContent = memo(function DealCardContent({ deal, onEdit, onDelete, canEdit }: {
  deal: any;
  onEdit: (deal: any) => void;
  onDelete: (dealId: string) => void;
  canEdit: boolean;
}) {
  return (
    <CardContent className="p-3 space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium leading-tight line-clamp-2 text-gray-900">
            {deal.name}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 -mt-0.5 flex-shrink-0 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {canEdit ? (
              <>
                <DropdownMenuItem onClick={() => onEdit(deal)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Negócio
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(deal.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Excluir Negócio
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem disabled className="text-gray-400">
                <Lock className="mr-2 h-4 w-4" />
                Negócio de outro atendente
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {deal.company && (
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <Building2 className="h-3 w-3 flex-shrink-0 text-gray-400" />
          <span className="truncate">{deal.company}</span>
        </div>
      )}
      
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm text-green-600 font-semibold">
              R$ {(deal.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500">Valor Previsto</p>
          </div>
          <Badge variant="outline" className="text-xs py-0.5 px-2 bg-blue-50 text-blue-700 border-blue-200">
            {deal.probability || 0}%
          </Badge>
        </div>
        
        {deal.valorRecebido && deal.valorRecebido > 0 && (
          <div className="flex items-center gap-2">
            <p className="text-sm text-blue-600 font-medium">
              R$ {(deal.valorRecebido || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500">Recebido no Mês</p>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 truncate max-w-[60%]">
          {deal.owner || 'Não atribuído'}
        </span>
        {deal.expectedCloseDate && (
          <span className="text-gray-400">
            {new Date(deal.expectedCloseDate).toLocaleDateString('pt-BR')}
          </span>
        )}
      </div>
      
      {deal.tags && deal.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 max-h-6 overflow-hidden">
          {deal.tags.slice(0, 2).map((tag: string, i: number) => (
            <Badge key={i} variant="outline" className="text-xs py-0 px-1.5 bg-gray-50">
              {tag}
            </Badge>
          ))}
          {deal.tags.length > 2 && (
            <Badge variant="outline" className="text-xs py-0 px-1.5 bg-gray-100">
              +{deal.tags.length - 2}
            </Badge>
          )}
        </div>
      )}
    </CardContent>
  );
});

export const DealCard = memo(function DealCard({ deal, index, onEdit, onDelete }: DealCardProps) {
  const { user } = useAuth();
  const { data: userPermissions } = useUserPermissions();
  
  const currentUserId = (user as any)?.id;
  const canEdit = canEditDeal(userPermissions, deal, currentUserId);
  const isRestricted = !canEdit;
  
  return (
    <Draggable 
      key={deal.id} 
      draggableId={String(deal.id)} 
      index={index} 
      isDragDisabled={isRestricted}
    >
      {(provided, snapshot) => {
        const dragProps = isRestricted ? {} : provided.dragHandleProps;
        
        const cardClassName = [
          isRestricted ? 'bg-gray-50 opacity-75' : 'bg-white',
          'shadow-sm hover:shadow-md transition-all duration-200',
          isRestricted ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
          snapshot.isDragging ? 'shadow-lg rotate-2 bg-blue-50 cursor-grabbing scale-105' : ''
        ].filter(Boolean).join(' ');
        
        return (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...dragProps}
            className={cardClassName}
            style={{
              ...provided.draggableProps.style,
            }}
          >
            <DealCardContent 
              deal={deal} 
              onEdit={onEdit} 
              onDelete={onDelete} 
              canEdit={canEdit} 
            />
          </Card>
        );
      }}
    </Draggable>
  );
});