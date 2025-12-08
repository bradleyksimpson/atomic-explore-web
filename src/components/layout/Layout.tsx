/**
 * Main Layout Component
 * Wraps the entire application with header, sidebar, and content area
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import AtomicSDK from '@atomic.io/action-cards-web-sdk';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MessagesPanel } from './MessagesPanel';
import { CONTAINERS } from '../../constants/atomic';
import styles from './Layout.module.css';

export function Layout() {
  const modalRef = useRef<unknown>(null);
  const [cardCount, setCardCount] = useState(0);
  const [isMessagesPanelOpen, setIsMessagesPanelOpen] = useState(false);

  // Handle bell click - toggle the messages panel
  const handleBellClick = useCallback(() => {
    setIsMessagesPanelOpen((prev) => !prev);
  }, []);

  // Handle messages panel close
  const handleMessagesPanelClose = useCallback(() => {
    setIsMessagesPanelOpen(false);
  }, []);

  // Handle card count updates from messages panel
  const handleCardCountChanged = useCallback((count: number) => {
    setCardCount(count);
  }, []);

  // Initialize the overlay/modal container
  // This shows cards as full-screen takeover with 60% opacity background
  useEffect(() => {
    const instance = AtomicSDK.modalStreamContainer({
      streamContainerId: CONTAINERS.overlay,
      cardMaximumWidth: 400,
      cardHorizontalAlignment: 'center',
      modalContainerPositioning: 'center',
      modalContainerVerticalPadding: 50,
    });

    modalRef.current = instance;

    return () => {
      if (modalRef.current) {
        // Modal container cleanup
        const modal = modalRef.current as { stop?: () => void };
        if (modal.stop) {
          modal.stop();
        }
      }
    };
  }, []);


  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        {/* Sidebar navigation */}
        <Sidebar />

        <div className={styles.content}>
          {/* Header with bell icon */}
          <Header onBellClick={handleBellClick} badgeCount={cardCount} />

          {/* Main content area */}
          <main className={styles.page}>
            <Outlet />
          </main>
        </div>
      </div>

      {/* Standalone messages panel - triggered by bell icon */}
      <MessagesPanel
        isOpen={isMessagesPanelOpen}
        onClose={handleMessagesPanelClose}
        onCardCountChanged={handleCardCountChanged}
      />

      {/* The modal container renders itself when cards are present */}
    </div>
  );
}
