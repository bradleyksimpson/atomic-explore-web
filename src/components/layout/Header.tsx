/**
 * Header Component
 * Blue header bar with logo
 * The notification bell is now handled by the Atomic SDK launcher
 */

import styles from './Header.module.css';

export function Header() {
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
        {/* The Atomic SDK launcher button appears in the bottom-right corner */}
        {/* This space can be used for other header actions if needed */}
      </div>
    </header>
  );
}
