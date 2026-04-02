// src/components/layout/Sidebar.jsx
// Collapsible sidebar with smooth CSS transition animation.
// open / onToggle props come from App.jsx which owns the state.

import React from 'react';
import useFinanceStore from '../../store/useFinanceStore';

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Overview',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".8"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".8"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".8"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".8"/>
      </svg>
    ),
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <rect x="1" y="3" width="14" height="2" rx="1" fill="currentColor" opacity=".8"/>
        <rect x="1" y="7" width="10" height="2" rx="1" fill="currentColor" opacity=".8"/>
        <rect x="1" y="11" width="12" height="2" rx="1" fill="currentColor" opacity=".8"/>
      </svg>
    ),
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <path d="M2 12L6 7l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

// Animated hamburger → X icon
function ToggleIcon({ open }) {
  const bar = (extraStyle) => ({
    display: 'block',
    width: 16, height: 1.5,
    background: 'var(--text-secondary)',
    borderRadius: 2,
    transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s',
    transformOrigin: 'center',
    ...extraStyle,
  });
  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 4.5, width: 16 }}>
      <span style={bar({ transform: open ? 'translateY(6px) rotate(45deg)' : 'none' })} />
      <span style={bar({ opacity: open ? 0 : 1, transform: open ? 'scaleX(0)' : 'none' })} />
      <span style={bar({ transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none' })} />
    </span>
  );
}

export const SIDEBAR_OPEN_W    = 220;
export const SIDEBAR_CLOSED_W  = 64;

export default function Sidebar({ open, onToggle }) {
  const activePage = useFinanceStore((s) => s.activePage);
  const setPage    = useFinanceStore((s) => s.setActivePage);

  const handleNav = (id) => {
    setPage(id);
    if (window.innerWidth < 768 && open) onToggle();
  };

  return (
    <aside
      style={{
        position: 'fixed', left: 0, top: 0,
        width: open ? SIDEBAR_OPEN_W : SIDEBAR_CLOSED_W,
        height: '100vh',
        background: 'var(--bg-primary)',
        borderRight: '0.5px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        zIndex: 30,
        overflow: 'hidden',
        transition: 'width 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: open ? 'none' : '3px 0 14px rgba(0,0,0,0.055)',
      }}
    >
      {/* ── Header: logo + toggle ── */}
      <div
        style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 14px',
          height: 64, flexShrink: 0,
          borderBottom: '0.5px solid var(--border)',
        }}
      >
        <span
          style={{
            fontSize: 17, fontWeight: 600, letterSpacing: '-0.5px',
            whiteSpace: 'nowrap', overflow: 'hidden',
            opacity: open ? 1 : 0,
            transform: open ? 'translateX(0)' : 'translateX(-10px)',
            transition: 'opacity 0.2s ease, transform 0.28s cubic-bezier(0.4,0,0.2,1)',
            pointerEvents: 'none',
          }}
        >
          Fin<span style={{ color: 'var(--accent)' }}>track</span>
        </span>

        <button
          onClick={onToggle}
          title={open ? 'Collapse sidebar' : 'Expand sidebar'}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 8, borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            marginLeft: open ? 4 : 'auto',
            marginRight: open ? 0 : 'auto',
            transition: 'margin 0.32s cubic-bezier(0.4,0,0.2,1), background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
        >
          <ToggleIcon open={open} />
        </button>
      </div>

      {/* ── Nav items ── */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              title={!open ? item.label : undefined}
              onClick={() => handleNav(item.id)}
              style={{
                display: 'flex', alignItems: 'center',
                gap: 10,
                padding: '9px 10px',
                justifyContent: open ? 'flex-start' : 'center',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer', fontSize: 13.5,
                color:      active ? 'var(--accent)'       : 'var(--text-secondary)',
                fontWeight: active ? 500                   : 400,
                background: active ? 'var(--accent-light)' : 'transparent',
                border: 'none', width: '100%',
                whiteSpace: 'nowrap', overflow: 'hidden',
                marginBottom: 2,
                transition: 'background 0.12s, color 0.12s, justify-content 0.32s',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              {item.icon}
              <span
                style={{
                  opacity:   open ? 1 : 0,
                  transform: open ? 'translateX(0)' : 'translateX(-8px)',
                  transition: 'opacity 0.18s ease, transform 0.24s cubic-bezier(0.4,0,0.2,1)',
                  pointerEvents: 'none',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── Collapsed brand monogram ── */}
      <div
        style={{
          padding: '14px 0', textAlign: 'center',
          fontSize: 11, fontWeight: 600,
          color: 'var(--accent)', letterSpacing: '1px',
          opacity: open ? 0 : 0.8,
          transition: 'opacity 0.2s ease',
          userSelect: 'none',
        }}
      >
        FT
      </div>
    </aside>
  );
}
