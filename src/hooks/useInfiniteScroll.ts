import { useCallback, useRef, useEffect, useState } from 'react';

interface UseInfiniteScrollProps {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  itemCount: number;
}

export const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  itemCount
}: UseInfiniteScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [needsScroll, setNeedsScroll] = useState(false);

  // Detecta se o conteúdo excede a altura do container
  useEffect(() => {
    const checkScrollNeed = () => {
      if (containerRef.current) {
        const { scrollHeight, clientHeight } = containerRef.current;
        const needsScrolling = scrollHeight > clientHeight;
        setNeedsScroll(needsScrolling);
      }
    };

    // Verifica imediatamente e após mudanças nos items
    checkScrollNeed();
    
    // Observer para mudanças no DOM
    const observer = new ResizeObserver(checkScrollNeed);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [itemCount]);

  // Detectar quando usuário chega ao final da coluna
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    
    if (isNearBottom && hasNextPage && !isFetchingNextPage && onLoadMore) {
      onLoadMore();
    }
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  return {
    containerRef,
    needsScroll,
    handleScroll
  };
};