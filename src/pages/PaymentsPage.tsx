/**
 * Payments Page
 * Make payments to payees
 * Matches iOS ADPaymentsView
 */

import { FormView } from '../components/shared/FormView';
import { CONTAINERS } from '../constants/atomic';

export function PaymentsPage() {
  const handleSubmit = (data: { from: string; to: string; amount: string; reference: string }) => {
    console.log('Payment submitted:', data);
    // In a real app, this would initiate the payment
    alert(`Payment of $${data.amount} submitted!`);
  };

  return (
    <FormView
      title="Make a Payment"
      containerId={CONTAINERS.payments}
      fromLabel="Pay From"
      toLabel="Pay To"
      amountLabel="Amount"
      submitLabel="Pay"
      onSubmit={handleSubmit}
    />
  );
}
