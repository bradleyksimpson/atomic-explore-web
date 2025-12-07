/**
 * Main Layout Component
 * Wraps the entire application with banner, header, sidebar, and content area
 */

import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import AtomicSDK from '@atomic.io/action-cards-web-sdk';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BannerContainer } from './BannerContainer';
import { CONTAINERS } from '../../constants/atomic';
import styles from './Layout.module.css';

export function Layout() {
  const unsubscribeRef = useRef<unknown>(null);

  // Initialize the Atomic launcher for messages
  useEffect(() => {
    // Launch the SDK's built-in launcher UI
    const instance = AtomicSDK.launch({
      streamContainerId: CONTAINERS.secureMessages,
      customStrings: {
        cardListTitle: 'Actions',
      },
      enabledUiElements: {
        cardListHeader: true,
        cardListToast: true,
      },
      onCardCountChanged: (visible, total) => {
        // Update badge count if needed
        console.log('Message cards:', visible, total);
      },
    });

    unsubscribeRef.current = instance;

    return () => {
      if (unsubscribeRef.current && typeof unsubscribeRef.current === 'function') {
        (unsubscribeRef.current as () => void)();
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
          {/* Header with logo and notifications */}
          <Header />

          {/* Main content area */}
          <main className={styles.page}>
            <Outlet />
          </main>
        </div>
      </div>

      {/* The Atomic launcher renders itself in the bottom-right corner */}
    </div>
  );
}
