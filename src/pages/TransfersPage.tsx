/**
 * Transfers Page
 * Transfer money between accounts
 * Matches iOS ADTransferView
 */

import { FormView } from '../components/shared/FormView';
import { CONTAINERS } from '../constants/atomic';

export function TransfersPage() {
  const handleSubmit = (data: { from: string; to: string; amount: string; reference: string }) => {
    console.log('Transfer submitted:', data);
    // In a real app, this would initiate the transfer
    alert(`Transfer of $${data.amount} submitted!`);
  };

  return (
    <FormView
      title="Transfer Money"
      containerId={CONTAINERS.transfers}
      fromLabel="From Account"
      toLabel="To Account"
      amountLabel="Amount"
      submitLabel="Transfer"
      onSubmit={handleSubmit}
    />
  );
}
