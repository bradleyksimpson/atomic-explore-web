/**
 * Header Component
 * Blue header bar - minimal, clean design
 * The notification bell triggers the Atomic SDK launcher
 */

import styles from './Header.module.css';

interface HeaderProps {
  onBellClick?: () => void;
  badgeCount?: number;
}

export function Header({ onBellClick, badgeCount = 0 }: HeaderProps) {
  return (
    <header className={styles.header}>
      {/* Empty left side for balance */}
      <div className={styles.spacer} />

      {/* Bell icon on the right - triggers the Actions launcher */}
      <div className={styles.actions}>
        <button
          className={styles.bellButton}
          onClick={onBellClick}
          aria-label="Actions"
          id="header-bell-button"
        >
          <BellIcon />
          {badgeCount > 0 && (
            <span className={styles.badge}>{badgeCount > 9 ? '9+' : badgeCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
