// src/data/transactions.js
// Seed data — used as default when localStorage is empty

export const SEED_TRANSACTIONS = [
  { id: 1,  date: '2026-04-01', description: 'Monthly salary',      category: 'Salary',        type: 'income',  amount: 95000 },
  { id: 2,  date: '2026-04-01', description: 'Freelance project',   category: 'Freelance',     type: 'income',  amount: 22000 },
  { id: 3,  date: '2026-04-02', description: 'Grocery shopping',    category: 'Food',          type: 'expense', amount: 3200  },
  { id: 4,  date: '2026-04-03', description: 'Ola & Rapido rides',  category: 'Transport',     type: 'expense', amount: 980   },
  { id: 5,  date: '2026-04-04', description: 'Myntra order',        category: 'Shopping',      type: 'expense', amount: 5400  },
  { id: 6,  date: '2026-04-05', description: 'Electricity bill',    category: 'Utilities',     type: 'expense', amount: 1850  },
  { id: 7,  date: '2026-04-06', description: 'Netflix & Spotify',   category: 'Entertainment', type: 'expense', amount: 649   },
  { id: 8,  date: '2026-04-07', description: 'Apollo Pharmacy',     category: 'Health',        type: 'expense', amount: 820   },
  { id: 9,  date: '2026-03-31', description: 'Performance bonus',   category: 'Salary',        type: 'income',  amount: 18000 },
  { id: 10, date: '2026-03-28', description: 'Dinner at Barbeque Nation', category: 'Food',   type: 'expense', amount: 2400  },
  { id: 11, date: '2026-03-25', description: 'Cult.fit membership', category: 'Health',        type: 'expense', amount: 2499  },
  { id: 12, date: '2026-03-22', description: 'Amazon shopping',     category: 'Shopping',      type: 'expense', amount: 7200  },
  { id: 13, date: '2026-03-20', description: 'Monthly salary',      category: 'Salary',        type: 'income',  amount: 95000 },
  { id: 14, date: '2026-03-18', description: 'Jio broadband bill',  category: 'Utilities',     type: 'expense', amount: 999   },
  { id: 15, date: '2026-03-15', description: 'Cafe Coffee Day',     category: 'Food',          type: 'expense', amount: 540   },
  { id: 16, date: '2026-03-10', description: 'PVR movie tickets',   category: 'Entertainment', type: 'expense', amount: 1200  },
  { id: 17, date: '2026-02-29', description: 'Monthly salary',      category: 'Salary',        type: 'income',  amount: 95000 },
  { id: 18, date: '2026-02-28', description: 'Clothing & shoes',    category: 'Shopping',      type: 'expense', amount: 6800  },
  { id: 19, date: '2026-02-20', description: 'Freelance UI design', category: 'Freelance',     type: 'income',  amount: 15000 },
  { id: 20, date: '2026-02-15', description: 'Big Basket order',    category: 'Food',          type: 'expense', amount: 2900  },
];

export const CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Utilities',
  'Entertainment', 'Health', 'Salary', 'Freelance',
];

export const ROLES = {
  ADMIN:  'admin',
  VIEWER: 'viewer',
};
