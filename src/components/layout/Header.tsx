/**
 * Header Component
 * Blue header bar with logo and notification bell
 * Matches iOS ADAccountMainView header
 */

import { useCardCounts } from '../../hooks/useAtomicContainer';
import styles from './Header.module.css';

interface HeaderProps {
  onMessagesClick?: () => void;
}

export function Header({ onMessagesClick }: HeaderProps) {
  const { byContainer } = useCardCounts();
  const messageCount = byContainer.secureMessages?.unseen ?? 0;

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <svg
          width="140"
          height="25"
          viewBox="0 0 140 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="0"
            y="20"
            fill="white"
            fontFamily="Figtree, sans-serif"
            fontWeight="700"
            fontSize="20"
          >
            Demo Bank
          </text>
        </svg>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.bellButton}
          onClick={onMessagesClick}
          aria-label={`Messages${messageCount > 0 ? ` (${messageCount} unread)` : ''}`}
        >
          <BellIcon />
          {messageCount > 0 && (
            <span className={styles.badge}>{messageCount > 9 ? '9+' : messageCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}

function BellIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
