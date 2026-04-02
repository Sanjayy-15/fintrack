// src/components/insights/InsightsPage.jsx
import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Tooltip, Legend,
} from 'chart.js';
import useFinanceStore from '../../store/useFinanceStore';
import { fmt } from '../../utils/format';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MONTHS      = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
const INCOME_DATA = [108000, 115000, 113000, 117000, 113000, 117000];
const EXPENSE_DATA= [62000, 71000, 58000, 66000, 63000, 68000];

const compareData = {
  labels: MONTHS,
  datasets: [
    { label: 'Income',   data: INCOME_DATA,  backgroundColor: '#97C459', borderRadius: 4 },
    { label: 'Expenses', data: EXPENSE_DATA, backgroundColor: '#F09595', borderRadius: 4 },
  ],
};

const compareOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: { label: (ctx) => `${ctx.dataset.label}: ₹${ctx.parsed.y.toLocaleString("en-IN")}` },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#888' } },
    y: {
      grid: { color: 'rgba(0,0,0,0.05)' },
      ticks: { font: { size: 11 }, color: '#888', callback: (v) => '₹' + (v / 1000).toFixed(0) + 'k' },
    },
  },
};

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 },
  card: {
    background: 'var(--bg-primary)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '18px 20px',
  },
  label: { fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 },
  value: { fontSize: 20, fontWeight: 600, letterSpacing: '-0.5px' },
  note:  { fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 },
  chartCard: {
    background: 'var(--bg-primary)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 20,
  },
  chartTitle: { fontSize: 14, fontWeight: 500, marginBottom: 12 },
  legend: { display: 'flex', gap: 16, marginBottom: 12, fontSize: 12, color: 'var(--text-secondary)' },
  swatch: (bg) => ({
    width: 10, height: 10, borderRadius: 2,
    background: bg, display: 'inline-block', marginRight: 4,
  }),
  wrap: { position: 'relative', height: 220 },
};

export default function InsightsPage() {
  const transactions = useFinanceStore((s) => s.transactions);

  const insights = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const income   = transactions.filter((t) => t.type === 'income');

    const catTotals = {};
    const catCounts = {};
    expenses.forEach((t) => {
      catTotals[t.category] = (catTotals[t.category] || 0) + Number(t.amount);
      catCounts[t.category] = (catCounts[t.category] || 0) + 1;
    });

    const sortedCats  = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
    const topCat      = sortedCats[0];
    const totalExp    = Object.values(catTotals).reduce((s, v) => s + v, 0);
    const freqCat     = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0];
    const largest     = [...expenses].sort((a, b) => b.amount - a.amount)[0];
    const totalInc    = income.reduce((s, t) => s + Number(t.amount), 0);
    const savingsRate = totalInc ? ((totalInc - totalExp) / totalInc) * 100 : 0;

    return {
      topCat:      topCat ? topCat[0] : '—',
      topCatPct:   topCat ? Math.round((topCat[1] / totalExp) * 100) : 0,
      avgSpend:    Math.round(totalExp / 6),
      savingsRate: Math.round(savingsRate),
      freqCat:     freqCat ? freqCat[0] : '—',
      freqCount:   freqCat ? freqCat[1] : 0,
      largestAmt:  largest ? Number(largest.amount) : 0,
      largestNote: largest ? `${largest.description} — ${fmt.date(largest.date)}` : '—',
      ratio:       totalExp ? totalInc / totalExp : 0,
    };
  }, [transactions]);

  const INSIGHT_CARDS = [
    { label: 'Highest spending category', value: insights.topCat,   note: `${insights.topCatPct}% of total expenses` },
    { label: 'Avg monthly spend',         value: fmt.currency(insights.avgSpend), note: 'Based on last 6 months' },
    { label: 'Savings rate',              value: fmt.percent(insights.savingsRate), note: insights.savingsRate >= 50 ? '🎉 Above 50% — excellent!' : 'Keep it up!' },
    { label: 'Most frequent category',    value: insights.freqCat,  note: `${insights.freqCount} transactions` },
    { label: 'Largest single expense',    value: fmt.currency(insights.largestAmt), note: insights.largestNote },
    { label: 'Income vs Expenses',        value: fmt.ratio(insights.ratio), note: 'Income exceeds spending' },
  ];

  return (
    <div>
      <div style={styles.grid}>
        {INSIGHT_CARDS.map((card) => (
          <div key={card.label} style={styles.card}>
            <div style={styles.label}>{card.label}</div>
            <div style={styles.value}>{card.value}</div>
            <div style={styles.note}>{card.note}</div>
          </div>
        ))}
      </div>

      <div style={styles.chartCard}>
        <div style={styles.chartTitle}>Monthly income vs expenses — last 6 months</div>
        <div style={styles.legend}>
          <span><span style={styles.swatch('#97C459')} />Income</span>
          <span><span style={styles.swatch('#F09595')} />Expenses</span>
        </div>
        <div style={styles.wrap}>
          <Bar data={compareData} options={compareOptions} />
        </div>
      </div>
    </div>
  );
}
