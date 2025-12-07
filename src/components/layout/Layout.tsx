/**
 * Main Layout Component
 * Wraps the entire application with banner, header, sidebar, and content area
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import AtomicSDK from '@atomic.io/action-cards-web-sdk';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BannerContainer } from './BannerContainer';
import { CONTAINERS } from '../../constants/atomic';
import styles from './Layout.module.css';

// Type for the launcher instance
interface LauncherInstance {
  setOpen: (open: boolean) => void;
  stop: () => void;
}

export function Layout() {
  const launcherRef = useRef<LauncherInstance | null>(null);
  const modalRef = useRef<unknown>(null);
  const [cardCount, setCardCount] = useState(0);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);

  // Handle bell click - toggle the launcher open/closed
  const handleBellClick = useCallback(() => {
    if (launcherRef.current) {
      const newState = !isLauncherOpen;
      launcherRef.current.setOpen(newState);
      setIsLauncherOpen(newState);
    }
  }, [isLauncherOpen]);

  // Initialize the Atomic launcher for messages (Actions popover)
  useEffect(() => {
    const instance = AtomicSDK.launch({
      streamContainerId: CONTAINERS.secureMessages,
      customStrings: {
        cardListTitle: 'Actions',
      },
      enabledUiElements: {
        cardListHeader: true,
        cardListToast: true,
        // Hide the default launcher button - we use our own bell icon
        launcherButton: {
          disabled: true,
        },
      },
      onCardCountChanged: (visible, total) => {
        console.log('Message cards:', visible, total);
        setCardCount(total);
      },
      onLauncherToggled: (isOpen?: boolean) => {
        setIsLauncherOpen(isOpen ?? false);
      },
    });

    launcherRef.current = instance as LauncherInstance;

    return () => {
      if (launcherRef.current) {
        launcherRef.current.stop();
      }
    };
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
      {/* Top banner - full width, above everything */}
      <BannerContainer />

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

      {/* The Atomic launcher renders its popover when setOpen(true) is called */}
      {/* The modal container renders itself when cards are present */}
    </div>
  );
}
