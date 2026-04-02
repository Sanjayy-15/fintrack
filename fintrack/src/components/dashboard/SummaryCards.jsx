// src/components/dashboard/SummaryCards.jsx
import React from 'react';
import useFinanceStore from '../../store/useFinanceStore';
import { fmt } from '../../utils/format';

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16, marginBottom: 28,
  },
  card: {
    background: 'var(--bg-primary)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '18px 20px',
  },
  label: { fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 },
  value: {
    fontSize: 26, fontWeight: 600, letterSpacing: '-1px',
    fontFamily: 'var(--font-mono)',
  },
  sub: (positive) => ({
    fontSize: 12, marginTop: 6,
    color: positive ? 'var(--success)' : 'var(--danger)',
  }),
};

const CARDS = [
  {
    label:    'Total Balance',
    key:      'balance',
    format:   (v) => fmt.currency(v),
    sub:      () => '+4.2% this month',
    positive: true,
  },
  {
    label:    'Monthly Income',
    key:      'income',
    format:   (v) => fmt.currency(v),
    sub:      () => '+₹5,000 vs last month',
    positive: true,
  },
  {
    label:    'Monthly Expenses',
    key:      'expenses',
    format:   (v) => fmt.currency(v),
    sub:      () => '+₹3,200 vs last month',
    positive: false,
  },
  {
    label:    'Net Savings',
    key:      'savings',
    format:   (v) => fmt.currency(v),
    sub:      (s) => `${fmt.percent(s.income ? (s.savings / s.income) * 100 : 0)} savings rate`,
    positive: true,
  },
];

export default function SummaryCards() {
  const getSummary = useFinanceStore((s) => s.getSummary);
  const summary    = getSummary();

  return (
    <div style={styles.grid}>
      {CARDS.map((card) => (
        <div key={card.key} style={styles.card}>
          <div style={styles.label}>{card.label}</div>
          <div style={styles.value}>{card.format(summary[card.key])}</div>
          <div style={styles.sub(card.positive)}>
            {typeof card.sub === 'function' ? card.sub(summary) : card.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
