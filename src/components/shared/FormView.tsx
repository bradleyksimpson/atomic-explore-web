/**
 * Form View Component
 * Reusable form for transfers and payments
 * 2-column layout: form on left, single card container on right
 * Matches iOS ADFormView
 */

import { useState } from 'react';
import { SingleCard } from '../atomic/SingleCard';
import styles from './FormView.module.css';

interface FormViewProps {
  title: string;
  containerId: string;
  fromLabel?: string;
  toLabel?: string;
  amountLabel?: string;
  submitLabel?: string;
  onSubmit?: (data: FormData) => void;
}

interface FormData {
  from: string;
  to: string;
  amount: string;
  reference: string;
}

const defaultAccounts = [
  { value: 'everyday', label: 'Everyday Spending - $1,234.56' },
  { value: 'savings', label: 'Rainy Day Savings - $1,500.00' },
  { value: 'credit', label: 'Credit Card - -$450.00' },
];

const defaultPayees = [
  { value: 'alice', label: 'Alice Johnson' },
  { value: 'global', label: 'Global Enterprises' },
  { value: 'emily', label: 'Emily Davis' },
  { value: 'health', label: 'Health & Wellness Corp.' },
  { value: 'sarah', label: 'Sarah Miller' },
];

export function FormView({
  title,
  containerId,
  fromLabel = 'From',
  toLabel = 'To',
  amountLabel = 'Amount',
  submitLabel = 'Continue',
  onSubmit,
}: FormViewProps) {
  const [formData, setFormData] = useState<FormData>({
    from: '',
    to: '',
    amount: '',
    reference: '',
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const isValid = formData.from && formData.to && formData.amount;

  return (
    <div className={styles.container}>
      {/* Small blue header strip for visual continuity */}
      <div className={styles.headerStrip} />

      {/* 2-column layout */}
      <div className={styles.content}>
        {/* Left column: Form */}
        <div className={styles.formColumn}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.title}>{title}</h2>

            <div className={styles.field}>
              <label className={styles.label}>{fromLabel}</label>
              <select
                className={styles.select}
                value={formData.from}
                onChange={(e) => handleChange('from', e.target.value)}
              >
                <option value="">Select account</option>
                {defaultAccounts.map((acc) => (
                  <option key={acc.value} value={acc.value}>
                    {acc.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>{toLabel}</label>
              <select
                className={styles.select}
                value={formData.to}
                onChange={(e) => handleChange('to', e.target.value)}
              >
                <option value="">Select recipient</option>
                {defaultPayees.map((payee) => (
                  <option key={payee.value} value={payee.value}>
                    {payee.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>{amountLabel}</label>
              <div className={styles.amountWrapper}>
                <span className={styles.currency}>$</span>
                <input
                  type="number"
                  className={styles.amountInput}
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Reference (optional)</label>
              <input
                type="text"
                className={styles.input}
                value={formData.reference}
                onChange={(e) => handleChange('reference', e.target.value)}
                placeholder="Add a reference"
                maxLength={50}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={!isValid}
            >
              {submitLabel}
            </button>
          </form>
        </div>

        {/* Right column: Single card Atomic container */}
        <div className={styles.cardColumn}>
          <SingleCard containerId={containerId} />
        </div>
      </div>
    </div>
  );
}
