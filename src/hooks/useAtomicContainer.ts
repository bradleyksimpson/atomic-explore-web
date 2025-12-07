/**
 * React hooks for Atomic SDK containers
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { atomicService } from '../services/atomicService';

type ContainerType = 'horizontal' | 'vertical' | 'single' | 'banner' | 'embed';

interface UseAtomicContainerOptions {
  type: ContainerType;
  containerId: string;
  cardWidth?: number;
  title?: string;
  showHeader?: boolean;
  showToast?: boolean;
}

interface ContainerState {
  visibleCount: number;
  totalCount: number;
  width: number;
  height: number;
  isEmpty: boolean;
}

/**
 * Hook for creating and managing an Atomic container
 */
export function useAtomicContainer(options: UseAtomicContainerOptions) {
  const { type, containerId, cardWidth = 370, title, showHeader, showToast } = options;
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const [state, setState] = useState<ContainerState>({
    visibleCount: 0,
    totalCount: 0,
    width: 0,
    height: 0,
    isEmpty: true,
  });

  const containerRef = useCallback(
    (element: HTMLElement | null) => {
      // Cleanup previous container
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      if (!element) return;

      // Ensure SDK is initialized
      if (!atomicService.isInitialized()) {
        atomicService.initialize();
      }

      const callbacks = {
        onCardCountChanged: (visible: number, total: number) => {
          setState((prev) => ({
            ...prev,
            visibleCount: visible,
            totalCount: total,
            isEmpty: total === 0,
          }));
        },
        onSizeChanged: (width: number, height: number) => {
          setState((prev) => ({
            ...prev,
            width,
            height,
          }));
        },
      };

      // Create container based on type
      switch (type) {
        case 'horizontal':
          unsubscribeRef.current = atomicService.createHorizontalContainer(
            element,
            containerId,
            cardWidth,
            callbacks
          );
          break;
        case 'vertical':
          unsubscribeRef.current = atomicService.createVerticalContainer(
            element,
            containerId,
            { title, showHeader, showToast, ...callbacks }
          );
          break;
        case 'single':
          unsubscribeRef.current = atomicService.createSingleCardContainer(
            element,
            containerId,
            callbacks
          );
          break;
        case 'banner':
          unsubscribeRef.current = atomicService.createBannerContainer(
            element,
            containerId,
            callbacks
          );
          break;
        case 'embed':
          unsubscribeRef.current = atomicService.createEmbedContainer(
            element,
            containerId,
            callbacks
          );
          break;
      }
    },
    [type, containerId, cardWidth, title, showHeader, showToast]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return {
    containerRef,
    ...state,
  };
}

/**
 * Hook for getting card counts across containers
 */
export function useCardCounts() {
  const [counts, setCounts] = useState<{
    total: number;
    unseen: number;
    byContainer: Record<string, { total: number; unseen: number }>;
  }>({
    total: 0,
    unseen: 0,
    byContainer: {},
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      if (!atomicService.isInitialized()) return;

      const metrics = await atomicService.getUserMetrics();
      setCounts({
        total: metrics.totalCards,
        unseen: metrics.unseenCards,
        byContainer: metrics.containerCounts,
      });
    } catch (error) {
      console.error('Failed to fetch card counts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    // Refresh every 30 seconds
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { ...counts, loading, refresh };
}

/**
 * Hook for modal container
 */
export function useModalContainer(containerId: string) {
  const [isOpen, setIsOpen] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const open = useCallback(() => {
    if (!atomicService.isInitialized()) {
      atomicService.initialize();
    }

    unsubscribeRef.current = atomicService.launchModal(containerId, {
      onClose: () => setIsOpen(false),
    });
    setIsOpen(true);
  }, [containerId]);

  const close = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    setIsOpen(false);
  }, []);

  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return { isOpen, open, close };
}
