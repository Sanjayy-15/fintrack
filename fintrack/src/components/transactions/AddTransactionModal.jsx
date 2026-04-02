// src/components/transactions/AddTransactionModal.jsx
import React, { useState } from 'react';
import useFinanceStore from '../../store/useFinanceStore';
import { CATEGORIES } from '../../data/transactions';

const emptyForm = {
  date:        new Date().toISOString().slice(0, 10),
  description: '',
  category:    'Food',
  type:        'expense',
  amount:      '',
};

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.35)',
    zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  modal: {
    background: 'var(--bg-primary)',
    borderRadius: 'var(--radius-xl)',
    padding: 28, width: 420,
    border: '0.5px solid var(--border)',
    boxShadow: 'var(--shadow-md)',
  },
  title: { fontSize: 16, fontWeight: 600, marginBottom: 20 },
  group: { marginBottom: 14 },
  label: { fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 },
  input: {
    width: '100%', padding: '9px 12px',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: 13,
  },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  btnRow: { display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' },
  btnCancel: {
    padding: '8px 16px',
    background: 'var(--bg-secondary)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: 13,
  },
  btnAdd: {
    padding: '8px 16px',
    background: 'var(--accent)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    color: '#fff',
    fontSize: 13, fontWeight: 500,
  },
};

export default function AddTransactionModal({ onClose }) {
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = () => {
    if (!form.date || !form.amount || !form.description.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    addTransaction({ ...form, amount: parseFloat(form.amount) });
    setForm(emptyForm);
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.title}>Add transaction</div>

        <div style={styles.row}>
          <div style={styles.group}>
            <label style={styles.label}>Date</label>
            <input type="date" style={styles.input} value={form.date}
              onChange={(e) => update('date', e.target.value)} />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Amount ($)</label>
            <input type="number" style={styles.input} placeholder="0.00" value={form.amount}
              onChange={(e) => update('amount', e.target.value)} />
          </div>
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Description</label>
          <input type="text" style={styles.input} placeholder="e.g. Grocery run" value={form.description}
            onChange={(e) => update('description', e.target.value)} />
        </div>

        <div style={styles.row}>
          <div style={styles.group}>
            <label style={styles.label}>Category</label>
            <select style={styles.input} value={form.category}
              onChange={(e) => update('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Type</label>
            <select style={styles.input} value={form.type}
              onChange={(e) => update('type', e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>

        {error && <p style={{ color: 'var(--danger)', fontSize: 12, marginBottom: 8 }}>{error}</p>}

        <div style={styles.btnRow}>
          <button style={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button style={styles.btnAdd} onClick={handleSubmit}>Add transaction</button>
        </div>
      </div>
    </div>
  );
}
