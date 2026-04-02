// src/components/dashboard/DashboardPage.jsx
import React from 'react';
import SummaryCards from './SummaryCards';
import TrendChart   from './TrendChart';
import SpendingDonut from './SpendingDonut';

const styles = {
  chartRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: 16,
  },
};

export default function DashboardPage() {
  return (
    <div>
      <SummaryCards />
      <div style={styles.chartRow}>
        <TrendChart />
        <SpendingDonut />
      </div>
    </div>
  );
}
