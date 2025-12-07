/**
 * Messages Modal Component
 * Shows secure messages stream in a modal overlay
 */

import { useEffect, useRef } from 'react';
import { useAtomicContainer } from '../../hooks/useAtomicContainer';
import { CONTAINERS } from '../../constants/atomic';
import styles from './MessagesModal.module.css';

interface MessagesModalProps {
  onClose: () => void;
}

export function MessagesModal({ onClose }: MessagesModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const { containerRef, totalCount } = useAtomicContainer({
    type: 'vertical',
    containerId: CONTAINERS.secureMessages,
    title: 'Message Centre',
    showHeader: true,
    showToast: true,
  });

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      className={styles.overlay}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Messages"
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Messages</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close messages"
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.content}>
          <div ref={containerRef} className={styles.container} />

          {totalCount === 0 && (
            <div className={styles.empty}>
              <EmptyIcon />
              <p>No messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
