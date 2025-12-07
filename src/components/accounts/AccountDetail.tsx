/**
 * Account Detail Component
 * Shows account transactions in a modal/sheet
 * Matches iOS ADAccountDetailView
 */

import { useEffect, useRef } from 'react';
import type { Account } from './AccountRow';
import styles from './AccountDetail.module.css';

interface AccountDetailProps {
  account: Account;
  onClose: () => void;
}

// Demo transactions
const demoTransactions = [
  { id: '1', description: 'Payment to Smiths Garage', amount: -400.10 },
  { id: '2', description: 'Debit from Grocery Store', amount: -75.50 },
  { id: '3', description: 'Payment to Tech Solutions Inc.', amount: -1500.00 },
  { id: '4', description: 'Debit from Coffee Shop', amount: -12.75 },
  { id: '5', description: 'Salary Deposit', amount: 4500.00 },
  { id: '6', description: 'Payment to Global Enterprises', amount: -300.45 },
  { id: '7', description: 'Debit from Bookstore', amount: -45.99 },
  { id: '8', description: 'Transfer from Savings', amount: 500.00 },
  { id: '9', description: 'Payment to Health & Wellness Corp.', amount: -900.25 },
  { id: '10', description: 'Debit from Clothing Store', amount: -210.00 },
];

export function AccountDetail({ account, onClose }: AccountDetailProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number): string => {
    const formatter = new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD',
      minimumFractionDigits: 2,
    });
    return formatter.format(Math.abs(amount));
  };

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
      aria-label={`${account.name} details`}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.accountName}>{account.name}</h2>
            <p className={styles.accountNumber}>{account.accountNumber}</p>
            <p className={`${styles.balance} ${account.balance < 0 ? styles.negative : ''}`}>
              {account.balance < 0 ? '-' : ''}
              {formatCurrency(account.balance)}
            </p>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.content}>
          <h3 className={styles.sectionTitle}>Recent Transactions</h3>
          <div className={styles.transactions}>
            {demoTransactions.map((tx) => (
              <div key={tx.id} className={styles.transaction}>
                <div className={styles.txIcon}>
                  {tx.amount > 0 ? <MoneyInIcon /> : <MoneyOutIcon />}
                </div>
                <div className={styles.txInfo}>
                  <span className={styles.txDescription}>{tx.description}</span>
                  <span className={styles.txDate}>Dec {Math.floor(Math.random() * 7) + 1}, 2025</span>
                </div>
                <span className={`${styles.txAmount} ${tx.amount > 0 ? styles.positive : styles.negative}`}>
                  {tx.amount > 0 ? '+' : '-'}
                  {formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
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

function MoneyInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-money-in)" strokeWidth="2">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function MoneyOutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-money-out)" strokeWidth="2">
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  );
}
