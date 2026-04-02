// src/components/layout/Topbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import useFinanceStore from '../../store/useFinanceStore';
import { ROLES } from '../../data/transactions';

const PAGE_META = {
  dashboard:    { title: 'Overview',      sub: 'April 2026' },
  transactions: { title: 'Transactions',  sub: 'All activity' },
  insights:     { title: 'Insights',      sub: 'Spending analysis' },
};

const ROLE_CONFIG = {
  [ROLES.ADMIN]: {
    label:       'Admin',
    description: 'Full access — add & delete transactions',
    accent:      '#185fa5',
    accentLight: '#deeaf8',
    accentMid:   '#378ADD',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="5" r="2.8" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M2 13c0-3.04 2.46-5.5 5.5-5.5S13 9.96 13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="12" cy="4" r="1.2" fill="currentColor"/>
        <path d="M11 4h2M12 3v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
  },
  [ROLES.VIEWER]: {
    label:       'Viewer',
    description: 'Read-only — data is visible but locked',
    accent:      '#3b6d11',
    accentLight: '#dff0ce',
    accentMid:   '#639922',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <ellipse cx="7.5" cy="7.5" rx="6" ry="4" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="7.5" cy="7.5" r="1.8" fill="currentColor"/>
        <path d="M4.5 4.5L3 3M10.5 4.5L12 3M4.5 10.5L3 12M10.5 10.5L12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".5"/>
      </svg>
    ),
  },
};

// Chevron icon that animates open/closed
function Chevron({ open }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none"
      style={{
        transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        flexShrink: 0,
      }}
    >
      <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Topbar() {
  const activePage = useFinanceStore((s) => s.activePage);
  const role       = useFinanceStore((s) => s.role);
  const setRole    = useFinanceStore((s) => s.setRole);
  const meta       = PAGE_META[activePage] || PAGE_META.dashboard;

  const [open, setOpen]           = useState(false);
  const [switching, setSwitching] = useState(false); // flash feedback on switch
  const dropdownRef               = useRef(null);

  const cfg = ROLE_CONFIG[role];

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSelect = (newRole) => {
    if (newRole === role) { setOpen(false); return; }
    setRole(newRole);
    setOpen(false);
    // Brief "switched" flash
    setSwitching(true);
    setTimeout(() => setSwitching(false), 800);
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: 28,
    }}>
      {/* Page title */}
      <div>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.5px' }}>{meta.title}</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 1 }}>{meta.sub}</div>
      </div>

      {/* Role switcher */}
      <div ref={dropdownRef} style={{ position: 'relative', userSelect: 'none' }}>

        {/* Trigger pill */}
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '7px 13px',
            borderRadius: 'var(--radius-lg)',
            border: `1.5px solid ${switching ? cfg.accentMid : (open ? cfg.accentMid : 'var(--border)')}`,
            background: switching ? cfg.accentLight : (open ? cfg.accentLight : 'var(--bg-primary)'),
            color: switching ? cfg.accent : (open ? cfg.accent : 'var(--text-primary)'),
            cursor: 'pointer',
            fontSize: 13, fontWeight: 500,
            transition: 'border-color 0.2s, background 0.2s, color 0.2s, box-shadow 0.2s',
            boxShadow: open ? `0 0 0 3px ${cfg.accentLight}` : 'none',
            outline: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {/* Role icon */}
          <span style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 24, height: 24,
            borderRadius: '50%',
            background: cfg.accentLight,
            color: cfg.accent,
            flexShrink: 0,
            transition: 'background 0.2s, color 0.2s',
          }}>
            {cfg.icon}
          </span>

          <span>{cfg.label}</span>
          <Chevron open={open} />
        </button>

        {/* Dropdown panel */}
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            width: 270,
            background: 'var(--bg-primary)',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            zIndex: 100,
            overflow: 'hidden',
            // Animate open/close
            opacity:         open ? 1 : 0,
            transform:       open ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.97)',
            pointerEvents:   open ? 'auto' : 'none',
            transition:      'opacity 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)',
            transformOrigin: 'top right',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '10px 14px 8px',
            fontSize: 11, fontWeight: 500,
            color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.6px',
            borderBottom: '0.5px solid var(--border)',
          }}>
            Switch role
          </div>

          {/* Role options */}
          {Object.entries(ROLE_CONFIG).map(([key, c]) => {
            const isActive = role === key;
            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  width: '100%', padding: '12px 14px',
                  background: isActive ? c.accentLight : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  borderBottom: '0.5px solid var(--border)',
                  transition: 'background 0.12s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Icon circle */}
                <span style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 34, height: 34, borderRadius: '50%',
                  background: c.accentLight, color: c.accent,
                  flexShrink: 0, marginTop: 1,
                  border: isActive ? `1.5px solid ${c.accentMid}` : '1.5px solid transparent',
                  transition: 'border-color 0.15s',
                }}>
                  {c.icon}
                </span>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 13, fontWeight: isActive ? 600 : 500,
                    color: isActive ? c.accent : 'var(--text-primary)',
                    marginBottom: 2,
                    transition: 'color 0.15s',
                  }}>
                    {c.label}
                  </div>
                  <div style={{
                    fontSize: 12, color: 'var(--text-secondary)',
                    lineHeight: 1.4,
                  }}>
                    {c.description}
                  </div>
                </div>

                {/* Active checkmark */}
                {isActive && (
                  <span style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 18, height: 18, borderRadius: '50%',
                    background: c.accentMid,
                    flexShrink: 0, marginTop: 8,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
              </button>
            );
          })}

          {/* Footer hint */}
          <div style={{
            padding: '8px 14px',
            fontSize: 11, color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1"/>
              <path d="M5.5 4.5v3M5.5 3.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Role affects what actions are available
          </div>
        </div>
      </div>
    </div>
  );
}
