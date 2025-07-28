import React, { memo, useCallback, useMemo } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { DealCard } from './DealCard';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface KanbanColumnProps {
  stage: any;
  deals: any[];
  onNewDeal: (stageId: string) => void;
  onEditDeal: (deal: any) => void;
  onDeleteDeal: (dealId: string) => void;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

const ColumnHeader = memo(function ColumnHeader({ 
  stage, 
  dealsCount, 
  stageValue 
}: { 
  stage: any; 
  dealsCount: number; 
  stageValue: number; 
}) {
  return (
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${stage.color}`} />
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{stage.name}</h3>
        <Badge 
          variant="secondary" 
          className="bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 font-medium"
        >
          {dealsCount}
        </Badge>
      </div>
      <div className="text-sm font-medium text-green-600 dark:text-green-400">
        R$ {stageValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
});

const EmptyState = memo(function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
        <Plus className="h-8 w-8 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        Nenhum negócio nesta etapa
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
        Adicione o primeiro negócio aqui
      </p>
    </div>
  );
});

const LoadingIndicator = memo(function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center py-6">
      <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
        Carregando mais negócios...
      </span>
    </div>
  );
});

export const KanbanColumn = memo(function KanbanColumn({ 
  stage, 
  deals, 
  onNewDeal, 
  onEditDeal,
  onDeleteDeal,
  onLoadMore, 
  hasNextPage, 
  isFetchingNextPage 
}: KanbanColumnProps) {
  
  const stageValue = useMemo(() => {
    return deals.reduce((acc: number, deal: any) => acc + (deal.value || 0), 0);
  }, [deals]);

  const { containerRef, needsScroll, handleScroll } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    itemCount: deals.length
  });

  const handleNewDeal = useCallback(() => {
    onNewDeal(stage.id);
  }, [onNewDeal, stage.id]);

  const scrollContainerStyles = useMemo(() => ({
    overflowY: needsScroll ? 'auto' as const : 'hidden' as const,
    overflowX: 'hidden' as const,
    scrollbarWidth: 'thin' as const,
    scrollbarColor: '#cbd5e1 transparent'
  }), [needsScroll]);

  return (
    <div className="min-w-80 max-w-80 flex-1 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl p-4 flex flex-col shadow-sm border border-gray-200/50 dark:border-gray-700/50">
      <ColumnHeader 
        stage={stage} 
        dealsCount={deals.length} 
        stageValue={stageValue} 
      />
      
      <Droppable droppableId={stage.id} type="DEAL">
        {(provided, snapshot) => (
          <div
            ref={(el) => {
              provided.innerRef(el);
              containerRef.current = el;
            }}
            {...provided.droppableProps}
            className={`space-y-3 flex-1 min-h-[500px] max-h-[calc(100vh-280px)] pr-2 transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-blue-50/50 dark:bg-blue-950/30 rounded-lg' : ''
            }`}
            onScroll={handleScroll}
            style={scrollContainerStyles}
          >
            {deals.map((deal: any, index: number) => (
              <div key={deal.id} className="group">
                <DealCard
                  deal={deal}
                  index={index}
                  onEdit={onEditDeal}
                  onDelete={onDeleteDeal}
                />
              </div>
            ))}
            {provided.placeholder}
            
            {isFetchingNextPage && <LoadingIndicator />}
            
            {deals.length === 0 && !isFetchingNextPage && <EmptyState />}
          </div>
        )}
      </Droppable>
      
      <Button 
        variant="ghost" 
        className="w-full mt-4 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200 py-6"
        size="sm"
        onClick={handleNewDeal}
      >
        <Plus className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" /> 
        <span className="text-gray-600 dark:text-gray-300">Adicionar Negócio</span>
      </Button>
    </div>
  );
});