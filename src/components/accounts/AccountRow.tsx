/**
 * Account Row Component
 * Single account item with thumbnail, name, and balance
 * Matches iOS ADAccountRow
 */

import styles from './AccountRow.module.css';

export interface Account {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  thumbnail: string;
  type: 'everyday' | 'savings' | 'credit' | 'loan' | 'investment';
}

interface AccountRowProps {
  account: Account;
  onClick?: (account: Account) => void;
}

export function AccountRow({ account, onClick }: AccountRowProps) {
  const isNegative = account.balance < 0;

  const formatBalance = (amount: number): string => {
    const formatter = new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD',
      minimumFractionDigits: 2,
    });
    return formatter.format(Math.abs(amount));
  };

  return (
    <button
      className={styles.row}
      onClick={() => onClick?.(account)}
      aria-label={`${account.name}, balance ${formatBalance(account.balance)}`}
    >
      <div className={styles.thumbnail}>
        <AccountThumbnail type={account.type} />
      </div>

      <div className={styles.info}>
        <span className={styles.name}>{account.name}</span>
        <span className={styles.number}>{account.accountNumber}</span>
      </div>

      <div className={styles.balanceWrapper}>
        <span className={`${styles.balance} ${isNegative ? styles.negative : styles.positive}`}>
          {isNegative ? '-' : ''}
          {formatBalance(account.balance)}
        </span>
      </div>

      <div className={styles.chevron}>
        <ChevronIcon />
      </div>
    </button>
  );
}

interface AccountThumbnailProps {
  type: Account['type'];
}

function AccountThumbnail({ type }: AccountThumbnailProps) {
  const colors: Record<Account['type'], string> = {
    everyday: '#FFC565',
    savings: '#50C099',
    credit: '#FF6B6B',
    loan: '#1F3CFF',
    investment: '#9B59B6',
  };

  const icons: Record<Account['type'], React.ReactNode> = {
    everyday: <WalletIcon />,
    savings: <PiggyIcon />,
    credit: <CardIcon />,
    loan: <HomeIcon />,
    investment: <ChartIcon />,
  };

  return (
    <div
      className={styles.thumbnailIcon}
      style={{ backgroundColor: colors[type] }}
    >
      {icons[type]}
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function PiggyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="M18 17V9M13 17V5M8 17v-3" />
    </svg>
  );
}
