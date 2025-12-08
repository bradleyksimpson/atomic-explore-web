/**
 * Messages Panel Component
 * Standalone embedded stream container for messages/actions
 * Uses AtomicSDK.embed() instead of launch() for custom positioning
 */

import { useEffect, useRef, useCallback } from 'react';
import AtomicSDK from '@atomic.io/action-cards-web-sdk';
import { CONTAINERS } from '../../constants/atomic';
import styles from './MessagesPanel.module.css';

interface MessagesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCardCountChanged?: (count: number) => void;
}

export function MessagesPanel({ isOpen, onClose, onCardCountChanged }: MessagesPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<{ stop?: () => void } | null>(null);

  // Initialize the embedded stream container
  const initEmbed = useCallback(() => {
    if (!containerRef.current || embedRef.current) return;

    embedRef.current = AtomicSDK.embed(containerRef.current, {
      streamContainerId: CONTAINERS.secureMessages,
      customStrings: {
        cardListTitle: 'Actions',
      },
      enabledUiElements: {
        cardListHeader: true,
        cardListToast: true,
      },
      onCardCountChanged: (_visible: number, total: number) => {
        onCardCountChanged?.(total);
      },
    });
  }, [onCardCountChanged]);

  // Initialize when panel opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(initEmbed, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initEmbed]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (embedRef.current?.stop) {
        embedRef.current.stop();
        embedRef.current = null;
      }
    };
  }, []);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.title}>Actions</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <div ref={containerRef} className={styles.container} />
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
