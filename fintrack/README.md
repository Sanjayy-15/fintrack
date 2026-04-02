# Fintrack — Finance Dashboard

A clean, interactive personal finance dashboard built with React, Zustand, and Chart.js.

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm start

# 3. Open in browser
http://localhost:3000
```

To create a production build:

```bash
npm run build
```

---

## Project overview

Fintrack lets users track and understand their financial activity through three main views: an overview dashboard, a transactions manager, and an insights panel.

The UI adapts based on the active role. Admins can add and delete transactions. Viewers get a read-only experience.

---

## Feature walkthrough

### Overview (Dashboard)
- Four summary cards: Total Balance, Monthly Income, Monthly Expenses, Net Savings
- A line chart showing balance trend over the last 6 months
- A doughnut chart breaking down spending by category

### Transactions
- Full table of all transactions with date, description, category, type, and amount
- Search by description or category (live filter)
- Filter dropdown for transaction type (income / expense) and category
- Click any column header to sort ascending or descending
- Admin role: "+ Add transaction" button opens a modal form; each row has a delete button
- Viewer role: read-only — no add/delete controls shown

### Insights
- Six derived insight cards: highest spending category, average monthly spend, savings rate, most frequent category, largest single expense, income-to-expense ratio
- A grouped bar chart comparing income vs expenses across the last 6 months

### Role-based UI (RBAC simulation)
Switch roles from the sidebar dropdown. No backend — role state lives in the Zustand store.

| Feature             | Admin | Viewer |
|---------------------|-------|--------|
| View all data       | ✓     | ✓      |
| Add transaction     | ✓     | ✗      |
| Delete transaction  | ✓     | ✗      |

---

## State management

All application state is managed by a single **Zustand** store (`src/store/useFinanceStore.js`).

The store exposes:

| State slice       | Description                                      |
|-------------------|--------------------------------------------------|
| `transactions`    | Array of all transaction objects                 |
| `role`            | Active role (`'admin'` or `'viewer'`)            |
| `filters`         | `{ search, type, category }` for the table       |
| `sort`            | `{ col, dir }` for table sorting                 |
| `activePage`      | Currently visible page                           |

Key actions: `addTransaction`, `deleteTransaction`, `editTransaction`, `setFilter`, `setSort`, `setRole`, `setActivePage`.

Selector: `getFilteredTransactions()` applies all filters and sort in one pass.

Data is **persisted to localStorage** automatically via Zustand's `persist` middleware. Transactions and role survive page refresh.

---

## Tech stack

| Library              | Purpose                          |
|----------------------|----------------------------------|
| React 18             | UI framework                     |
| Zustand 4            | Global state management          |
| Chart.js 4           | Charts (line, doughnut, bar)     |
| react-chartjs-2      | React bindings for Chart.js      |
| DM Sans / DM Mono    | Typography (Google Fonts)        |

No UI component library is used — all styling is plain CSS-in-JS using CSS custom properties.

---

## Project structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx          # Navigation + role switcher
│   │   └── Topbar.jsx           # Page title + role badge
│   ├── dashboard/
│   │   ├── DashboardPage.jsx    # Overview layout
│   │   ├── SummaryCards.jsx     # Four metric cards
│   │   ├── TrendChart.jsx       # Balance line chart
│   │   └── SpendingDonut.jsx    # Category doughnut chart
│   ├── transactions/
│   │   ├── TransactionsPage.jsx # Table + filters + toolbar
│   │   └── AddTransactionModal.jsx # Add transaction form
│   └── insights/
│       └── InsightsPage.jsx     # Insight cards + comparison chart
├── store/
│   └── useFinanceStore.js       # Zustand store (single source of truth)
├── data/
│   └── transactions.js          # Seed data + constants
├── utils/
│   └── format.js                # Currency, date, color helpers
├── App.jsx                      # Root layout + page routing
├── index.js                     # React entry point
└── index.css                    # Global styles + CSS variables
```

---

## Design decisions

**Zustand over Context API** — Zustand avoids boilerplate (no Provider, no useReducer), is easier to test, and its `persist` middleware handles localStorage with one line. For a dashboard of this scale, it's the cleaner choice.

**CSS custom properties** — All colors and spacing are defined as CSS variables in `index.css`. This makes theming (including dark mode) trivial and keeps component styles portable.

**Selector pattern** — `getFilteredTransactions()` is a derived selector on the store. Components never hold local filter/sort state; everything is derived from the single store. This keeps the UI consistent regardless of which component triggers a change.

**Mock data** — Seed transactions are defined in `src/data/transactions.js`. Once the app loads, data lives in the store (and persists to localStorage). Swapping in a real API means replacing the seed with an async fetch in the store's initialization.

---

## Assumptions made

- Date range is fixed to the last 6 months for chart data (easily wired to real computed values).
- The "monthly comparison" chart uses static data to illustrate the design pattern — in production this would be computed from `transactions` grouped by month.
- No authentication — role switching is a UI toggle for demonstration purposes only.

---

## Possible extensions

- Connect to a real REST API or Firebase for persistent backend storage
- Add date-range filtering to all views
- Export transactions to CSV using the native `Blob` API
- Add edit-in-place for transactions (row click → inline form)
- Add unit tests for the store selectors using Vitest
