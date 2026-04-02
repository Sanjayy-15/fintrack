// src/components/transactions/TransactionsPage.jsx
import React, { useState } from 'react';
import useFinanceStore from '../../store/useFinanceStore';
import { CATEGORIES, ROLES } from '../../data/transactions';
import { catStyle, fmt } from '../../utils/format';
import AddTransactionModal from './AddTransactionModal';

const styles = {
  toolbar: { display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' },
  search: {
    flex: 1, minWidth: 180,
    padding: '8px 12px',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
  },
  select: {
    padding: '8px 12px',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
  },
  addBtn: {
    padding: '8px 16px',
    background: 'var(--accent)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    color: '#fff',
    fontSize: 13, fontWeight: 500,
  },
  tableWrap: {
    background: 'var(--bg-primary)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: {
    textAlign: 'left', fontSize: 11, fontWeight: 500,
    color: 'var(--text-secondary)',
    padding: '10px 14px',
    borderBottom: '0.5px solid var(--border)',
    textTransform: 'uppercase', letterSpacing: '0.3px',
    cursor: 'pointer', userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '12px 14px',
    borderBottom: '0.5px solid var(--border)',
    color: 'var(--text-primary)',
    verticalAlign: 'middle',
  },
  pill: (cat) => ({
    fontSize: 11, padding: '3px 8px',
    borderRadius: 20, fontWeight: 500,
    background: catStyle(cat).bg,
    color: catStyle(cat).color,
    whiteSpace: 'nowrap',
  }),
  amtIncome: { color: 'var(--success)', fontFamily: 'var(--font-mono)', fontWeight: 500 },
  amtExpense:{ color: 'var(--danger)',  fontFamily: 'var(--font-mono)', fontWeight: 500 },
  deleteBtn: {
    background: 'none', border: 'none',
    cursor: 'pointer', fontSize: 13,
    color: 'var(--text-muted)',
    padding: '2px 6px', borderRadius: 4,
  },
  empty: {
    textAlign: 'center', padding: 48,
    color: 'var(--text-muted)', fontSize: 13,
  },
};

const COLUMNS = [
  { key: 'date',        label: 'Date'        },
  { key: 'description', label: 'Description' },
  { key: 'category',    label: 'Category'    },
  { key: 'type',        label: 'Type'        },
  { key: 'amount',      label: 'Amount'      },
];

export default function TransactionsPage() {
  const filters              = useFinanceStore((s) => s.filters);
  const setFilter            = useFinanceStore((s) => s.setFilter);
  const sort                 = useFinanceStore((s) => s.sort);
  const setSort              = useFinanceStore((s) => s.setSort);
  const getFiltered          = useFinanceStore((s) => s.getFilteredTransactions);
  const deleteTransaction    = useFinanceStore((s) => s.deleteTransaction);
  const role                 = useFinanceStore((s) => s.role);

  const [showModal, setShowModal] = useState(false);

  const isAdmin   = role === ROLES.ADMIN;
  const rows      = getFiltered();

  const sortIcon = (col) => {
    if (sort.col !== col) return ' ·';
    return sort.dir === -1 ? ' ↓' : ' ↑';
  };

  return (
    <div>
      <div style={styles.toolbar}>
        <input
          type="text"
          style={styles.search}
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
        />
        <select style={styles.select} value={filters.type}
          onChange={(e) => setFilter('type', e.target.value)}>
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select style={styles.select} value={filters.category}
          onChange={(e) => setFilter('category', e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        {isAdmin && (
          <button style={styles.addBtn} onClick={() => setShowModal(true)}>
            + Add transaction
          </button>
        )}
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  style={{ ...styles.th, textAlign: col.key === 'amount' ? 'right' : 'left' }}
                  onClick={() => setSort(col.key)}
                >
                  {col.label}{sortIcon(col.key)}
                </th>
              ))}
              {isAdmin && <th style={styles.th} />}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={isAdmin ? 6 : 5} style={styles.empty}>No transactions found.</td></tr>
            ) : rows.map((txn) => (
              <tr key={txn.id}>
                <td style={{ ...styles.td, color: 'var(--text-secondary)', fontSize: 12 }}>
                  {fmt.date(txn.date)}
                </td>
                <td style={styles.td}>{txn.description}</td>
                <td style={styles.td}>
                  <span style={styles.pill(txn.category)}>{txn.category}</span>
                </td>
                <td style={{ ...styles.td, color: 'var(--text-secondary)', textTransform: 'capitalize', fontSize: 12 }}>
                  {txn.type}
                </td>
                <td style={{ ...styles.td, textAlign: 'right',
                  ...(txn.type === 'income' ? styles.amtIncome : styles.amtExpense) }}>
                  {txn.type === 'income' ? '+' : '−'}{fmt.currency(txn.amount)}
                </td>
                {isAdmin && (
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <button
                      style={styles.deleteBtn}
                      title="Delete"
                      onClick={() => window.confirm('Delete this transaction?') && deleteTransaction(txn.id)}
                    >✕</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
