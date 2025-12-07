/**
 * Main Layout Component
 * Wraps the entire application with banner, header, sidebar, and content area
 */

import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BannerContainer } from './BannerContainer';
import { MessagesModal } from '../shared/MessagesModal';
import { useState } from 'react';
import styles from './Layout.module.css';

export function Layout() {
  const [showMessages, setShowMessages] = useState(false);

  return (
    <div className={styles.layout}>
      {/* Top banner - full width, above everything */}
      <BannerContainer />

      <div className={styles.main}>
        {/* Sidebar navigation */}
        <Sidebar />

        <div className={styles.content}>
          {/* Header with logo and notifications */}
          <Header onMessagesClick={() => setShowMessages(true)} />

          {/* Main content area */}
          <main className={styles.page}>
            <Outlet />
          </main>
        </div>
      </div>

      {/* Messages modal */}
      {showMessages && (
        <MessagesModal onClose={() => setShowMessages(false)} />
      )}
    </div>
  );
}
