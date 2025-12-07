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
export const demoAccounts: Account[] = [
  {
    id: 'everyday',
    name: 'Everyday Spending',
    accountNumber: '12-3456-7890123-00',
    balance: 1234.56 + Math.random() * 1000,
    thumbnail: 'everyday',
    type: 'everyday',
  },
  {
    id: 'savings',
    name: 'Rainy Day Savings',
    accountNumber: '12-3456-7890124-00',
    balance: 100 + Math.random() * 1900,
    thumbnail: 'savings',
    type: 'savings',
  },
  {
    id: 'credit',
    name: 'Credit Card',
    accountNumber: '****-****-****-4567',
    balance: -(Math.random() * 500 + 200),
    thumbnail: 'credit',
    type: 'credit',
  },
  {
    id: 'homeloan',
    name: 'Home Loan',
    accountNumber: '12-3456-7890126-00',
    balance: -(290000 + Math.random() * 10000),
    thumbnail: 'loan',
    type: 'loan',
  },
  {
    id: 'kiwisaver',
    name: 'KiwiSaver',
    accountNumber: '98-7654-3210987-00',
    balance: 30000 + Math.random() * 20000,
    thumbnail: 'investment',
    type: 'investment',
  },
];
