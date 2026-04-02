// src/components/dashboard/SpendingDonut.jsx
import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import useFinanceStore from '../../store/useFinanceStore';
import { CAT_COLORS } from '../../utils/format';

ChartJS.register(ArcElement, Tooltip, Legend);

const styles = {
  card: {
    background: 'var(--bg-primary)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 20,
  },
  title:  { fontSize: 14, fontWeight: 500, marginBottom: 12 },
  legend: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  legendItem: {
    display: 'flex', alignItems: 'center', gap: 4,
    fontSize: 11, color: 'var(--text-secondary)',
  },
  swatch: (bg) => ({
    width: 8, height: 8, borderRadius: 2,
    background: bg, display: 'inline-block',
  }),
  wrap: { position: 'relative', height: 160 },
};

export default function SpendingDonut() {
  const transactions = useFinanceStore((s) => s.transactions);

  const catData = useMemo(() => {
    const totals = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => { totals[t.category] = (totals[t.category] || 0) + Number(t.amount); });

    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const total  = sorted.reduce((s, [, v]) => s + v, 0);
    return sorted.map(([label, value], i) => ({
      label, value, color: CAT_COLORS[i % CAT_COLORS.length],
      pct: Math.round((value / total) * 100),
    }));
  }, [transactions]);

  const chartData = {
    labels:   catData.map((d) => d.label),
    datasets: [{
      data:            catData.map((d) => d.value),
      backgroundColor: catData.map((d) => d.color),
      borderWidth:     0,
      hoverOffset:     4,
    }],
  };

  const options = {
    responsive: true, maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (ctx) => `${ctx.label}: ₹${ctx.parsed.toLocaleString("en-IN")}` },
      },
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.title}>Spending by category</div>
      <div style={styles.legend}>
        {catData.map((d) => (
          <span key={d.label} style={styles.legendItem}>
            <span style={styles.swatch(d.color)} />
            {d.label} {d.pct}%
          </span>
        ))}
      </div>
      <div style={styles.wrap}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}
