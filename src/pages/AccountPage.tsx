/**
 * Account Page
 * Main account overview with horizontal Atomic containers and account list
 * Matches iOS ADAccountMainView
 */

import { useState } from 'react';
import { HorizontalStream } from '../components/atomic/HorizontalStream';
import { AccountList, demoAccounts } from '../components/accounts/AccountList';
import type { Account } from '../components/accounts/AccountRow';
import { AccountDetail } from '../components/accounts/AccountDetail';
import { CONTAINERS, LAYOUT } from '../constants/atomic';
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
      {/* Hero cards from Atomic */}
      <div className={styles.heroSection}>
        <HorizontalStream
          containerId={CONTAINERS.accountsHome}
          cardWidth={LAYOUT.cardWidth}
        />
      </div>

      {/* Accounts section */}
      <div className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>Accounts</h2>
        <AccountList
          accounts={demoAccounts}
          onAccountClick={handleAccountClick}
        />

        {/* Rainy Day savings specific container */}
        <div className={styles.savingsSection}>
          <HorizontalStream
            containerId={CONTAINERS.rainyDay}
            cardWidth={LAYOUT.cardWidth}
          />
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
