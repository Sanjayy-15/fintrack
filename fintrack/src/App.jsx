// src/App.jsx
// Owns sidebar open/closed state so the main content margin
// animates in perfect sync with the sidebar width transition.

import React, { useState } from 'react';
import useFinanceStore  from './store/useFinanceStore';
import Sidebar, { SIDEBAR_OPEN_W, SIDEBAR_CLOSED_W } from './components/layout/Sidebar';
import Topbar           from './components/layout/Topbar';
import DashboardPage    from './components/dashboard/DashboardPage';
import TransactionsPage from './components/transactions/TransactionsPage';
import InsightsPage     from './components/insights/InsightsPage';

const PAGE_MAP = {
  dashboard:    <DashboardPage />,
  transactions: <TransactionsPage />,
  insights:     <InsightsPage />,
};

export default function App() {
  const activePage = useFinanceStore((s) => s.activePage);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const marginLeft = sidebarOpen ? SIDEBAR_OPEN_W : SIDEBAR_CLOSED_W;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

      <main
        style={{
          marginLeft,
          flex: 1,
          padding: '28px 32px',
          minHeight: '100vh',
          // Margin slides in sync with sidebar width
          transition: 'margin-left 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Topbar />
        {PAGE_MAP[activePage] || <DashboardPage />}
      </main>
    </div>
  );
}
