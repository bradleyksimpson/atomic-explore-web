/**
 * Account Page
 * Main account overview with single card Atomic container and account list
 * Matches iOS ADAccountMainView
 */

import { useState } from 'react';
import { SingleCard } from '../components/atomic/SingleCard';
import { AccountList, demoAccounts } from '../components/accounts/AccountList';
import type { Account } from '../components/accounts/AccountRow';
import { AccountDetail } from '../components/accounts/AccountDetail';
import { CONTAINERS } from '../constants/atomic';
import styles from './AccountPage.module.css';

export function AccountPage() {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const handleAccountClick = (account: Account) => {
    setSelectedAccount(account);
  };

  const handleCloseDetail = () => {
    setSelectedAccount(null);
  };

  return (
    <div className={styles.page}>
      {/* Blue header section - just for visual continuity */}
      <div className={styles.headerSection} />

      {/* Content area with white background */}
      <div className={styles.contentSection}>
        {/* Single card Atomic container - above Accounts title */}
        <div className={styles.cardSection}>
          <SingleCard containerId={CONTAINERS.accountsHome} />
        </div>

        {/* Accounts section */}
        <h2 className={styles.sectionTitle}>Accounts</h2>
        <AccountList
          accounts={demoAccounts}
          onAccountClick={handleAccountClick}
        />

        {/* Rainy Day savings specific container */}
        <div className={styles.savingsSection}>
          <SingleCard containerId={CONTAINERS.rainyDay} />
        </div>
      </div>

      {/* Account detail modal */}
      {selectedAccount && (
        <AccountDetail
          account={selectedAccount}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}
