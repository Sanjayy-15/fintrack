// src/store/useFinanceStore.js
// Central Zustand store. Handles transactions, filters, role, and sorting.
// Data is persisted to localStorage automatically.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SEED_TRANSACTIONS, ROLES } from '../data/transactions';

const useFinanceStore = create(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────────
      transactions: SEED_TRANSACTIONS,
      role: ROLES.ADMIN,

      filters: {
        search: '',
        type:     '',   // 'income' | 'expense' | ''
        category: '',
      },

      sort: {
        col: 'date',
        dir: -1,        // -1 = descending, 1 = ascending
      },

      activePage: 'dashboard', // 'dashboard' | 'transactions' | 'insights'

      // ── Actions ────────────────────────────────────────────────────────
      setRole: (role) => set({ role }),
      setActivePage: (page) => set({ activePage: page }),

      setFilter: (key, value) =>
        set((state) => ({ filters: { ...state.filters, [key]: value } })),

      resetFilters: () =>
        set({ filters: { search: '', type: '', category: '' } }),

      setSort: (col) =>
        set((state) => ({
          sort: {
            col,
            dir: state.sort.col === col ? state.sort.dir * -1 : -1,
          },
        })),

      addTransaction: (txn) =>
        set((state) => ({
          transactions: [
            { ...txn, id: Date.now() },
            ...state.transactions,
          ],
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      editTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      // ── Derived / selectors ────────────────────────────────────────────
      getFilteredTransactions: () => {
        const { transactions, filters, sort } = get();
        const { search, type, category } = filters;

        let result = transactions.filter((t) => {
          const matchSearch =
            !search ||
            t.description.toLowerCase().includes(search.toLowerCase()) ||
            t.category.toLowerCase().includes(search.toLowerCase());
          const matchType     = !type     || t.type === type;
          const matchCategory = !category || t.category === category;
          return matchSearch && matchType && matchCategory;
        });

        result = [...result].sort((a, b) => {
          let av = a[sort.col];
          let bv = b[sort.col];
          if (sort.col === 'amount') { av = Number(av); bv = Number(bv); }
          return av < bv ? -sort.dir : av > bv ? sort.dir : 0;
        });

        return result;
      },

      getSummary: () => {
        const { transactions } = get();
        const now   = new Date();
        const curM  = now.getMonth();
        const curY  = now.getFullYear();

        const thisMonth = transactions.filter((t) => {
          const d = new Date(t.date);
          return d.getMonth() === curM && d.getFullYear() === curY;
        });

        const income   = thisMonth.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
        const expenses = thisMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
        const balance  = transactions.reduce((s, t) => s + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0);

        return { balance, income, expenses, savings: income - expenses };
      },
    }),
    {
      name: 'fintrack-storage', // localStorage key
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
      }),
    }
  )
);

export default useFinanceStore;
