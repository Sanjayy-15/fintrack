// src/utils/format.js

export const fmt = {
  currency: (n) =>
    '₹' + Math.abs(Number(n)).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),

  percent: (n) => Math.round(n) + '%',

  ratio: (n) => Number(n).toFixed(2) + '×',

  date: (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  },
};

// Category → inline style colors
export const catStyle = (cat) => {
  const map = {
    Food:          { bg: '#faeeda', color: '#854f0b' },
    Transport:     { bg: '#e6f1fb', color: '#185fa5' },
    Shopping:      { bg: '#fbeaf0', color: '#993556' },
    Salary:        { bg: '#eaf3de', color: '#3b6d11' },
    Utilities:     { bg: '#EEEDFE', color: '#534ab7' },
    Entertainment: { bg: '#faece7', color: '#993c1d' },
    Health:        { bg: '#e1f5ee', color: '#0f6e56' },
    Freelance:     { bg: '#eaf3de', color: '#3b6d11' },
  };
  return map[cat] || { bg: '#f1efe8', color: '#5f5e5a' };
};

// Chart.js palette (hardcoded — canvas can't read CSS vars)
export const CHART_COLORS = {
  blue:   '#378ADD',
  green:  '#97C459',
  red:    '#F09595',
  purple: '#7F77DD',
  amber:  '#EF9F27',
  coral:  '#D85A30',
  pink:   '#D4537E',
  teal:   '#1D9E75',
};

export const CAT_COLORS = ['#D4537E', '#BA7517', '#7F77DD', '#1D9E75', '#D85A30', '#378ADD', '#639922', '#533ab7'];
