/**
 * Account List Component
 * List of account rows with section header
 * Matches iOS ADAccountView
 */

import { AccountRow, type Account } from './AccountRow';
import styles from './AccountList.module.css';

interface AccountListProps {
  accounts: Account[];
  onAccountClick?: (account: Account) => void;
}

export function AccountList({ accounts, onAccountClick }: AccountListProps) {
  return (
    <div className={styles.list}>
      {accounts.map((account) => (
        <AccountRow
          key={account.id}
          account={account}
          onClick={onAccountClick}
        />
      ))}
    </div>
  );
}

// Demo accounts matching iOS app
// Balances use seeded pseudo-random values for consistency
// Using a simple formula based on account ID hash for reproducible "random" values
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash % 10000) / 10000;
}

export const demoAccounts: Account[] = [
  {
    id: 'everyday',
    name: 'Everyday Spending',
    accountNumber: '12-3456-7890123-00',
    balance: 1000 + seededRandom('everyday-2024') * 1500, // ~$1,000 - $2,500
    thumbnail: 'everyday',
    type: 'everyday',
  },
  {
    id: 'savings',
    name: 'Savings',
    accountNumber: '12-3456-7890124-00',
    balance: 500 + seededRandom('savings-2024') * 1500, // ~$500 - $2,000
    thumbnail: 'savings',
    type: 'savings',
  },
  {
    id: 'credit',
    name: 'Credit Card',
    accountNumber: '****-****-****-4567',
    balance: -(200 + seededRandom('credit-2024') * 600), // ~-$200 - -$800
    thumbnail: 'credit',
    type: 'credit',
  },
  {
    id: 'homeloan',
    name: 'Home Loan',
    accountNumber: '12-3456-7890126-00',
    balance: -(290000 + seededRandom('homeloan-2024') * 15000), // ~-$290k - -$305k
    thumbnail: 'loan',
    type: 'loan',
  },
  {
    id: 'kiwisaver',
    name: 'KiwiSaver',
    accountNumber: '98-7654-3210987-00',
    balance: 30000 + seededRandom('kiwisaver-2024') * 20000, // ~$30k - $50k
    thumbnail: 'investment',
    type: 'investment',
  },
];
