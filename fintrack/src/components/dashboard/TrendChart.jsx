// src/components/dashboard/TrendChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const LABELS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
const DATA   = [310000, 355000, 398000, 442000, 489000, 524000];

const chartData = {
  labels: LABELS,
  datasets: [{
    label:           'Balance',
    data:            DATA,
    borderColor:     '#3266ad',
    backgroundColor: 'rgba(50,102,173,0.08)',
    borderWidth:     2,
    pointRadius:     4,
    pointBackgroundColor: '#3266ad',
    fill:            true,
    tension:         0.4,
  }],
};

const options = {
  responsive:          true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: { label: (ctx) => '₹' + ctx.parsed.y.toLocaleString('en-IN') },
    },
  },
  scales: {
    x: {
      grid:  { display: false },
      ticks: { font: { size: 11 }, color: '#888' },
    },
    y: {
      grid:  { color: 'rgba(0,0,0,0.05)' },
      ticks: {
        font: { size: 11 }, color: '#888',
        callback: (v) => '₹' + (v / 1000).toFixed(0) + 'k',
      },
    },
  },
};

const styles = {
  card: {
    background: 'var(--bg-primary)',
    border: '0.5px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 20,
  },
  title: { fontSize: 14, fontWeight: 500, marginBottom: 16 },
  wrap:  { position: 'relative', height: 200 },
};

export default function TrendChart() {
  return (
    <div style={styles.card}>
      <div style={styles.title}>Balance trend — last 6 months</div>
      <div style={styles.wrap}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
