'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const HOVER_COLORS = [
  { hex: '#D3E5EF', name: 'Blue' },
  { hex: '#DBEDDB', name: 'Green' },
  { hex: '#FDECC8', name: 'Yellow' },
  { hex: '#EEE0DA', name: 'Brown' },
  { hex: '#E8D5EF', name: 'Purple' },
  { hex: '#FAD4D4', name: 'Pink' },
];

const NAV_ITEMS = ['Inbox', 'Promotion', 'Social', 'Labels', 'Archived', 'Trash'];

function RandomNavItem({ label }: { label: string }) {
  const [hoverColor, setHoverColor] = useState<string | null>(null);

  return (
    <button
      onMouseEnter={() => {
        const pick = HOVER_COLORS[Math.floor(Math.random() * HOVER_COLORS.length)];
        setHoverColor(pick.hex);
      }}
      onMouseLeave={() => setHoverColor(null)}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '6px 16px',
        background: hoverColor ?? 'transparent',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontFamily: 'var(--font-family)',
        fontSize: 'var(--text-primary-size)',
        fontWeight: 'var(--text-primary-weight)',
        color: 'var(--color-content-tertiary)',
        textAlign: 'left',
        transition: 'background 0.1s ease',
      }}
    >
      {label}
    </button>
  );
}

export default function HoverExperiment() {
  return (
    <div className={styles.page}>
      <Link href="/prototypes/chethan" className={styles.back}>← Back</Link>
      <div className={styles.label}>Interaction</div>
      <h1 className={styles.title}>Random Hover Colors</h1>
      <p className={styles.description}>
        Each sidebar nav item picks a random pastel background from 6 options on every hover.
        Exploring how small moments of randomness add delight to navigation.
      </p>

      <div className={styles.demo}>
        <div>
          <div className={styles.navPanel}>
            <div className={styles.navLabel}>Mailbox</div>
            {NAV_ITEMS.map((item) => (
              <RandomNavItem key={item} label={item} />
            ))}
          </div>
          <p className={styles.hint}>Hover the nav items above</p>
        </div>

        <div className={styles.swatches}>
          {HOVER_COLORS.map((c) => (
            <div key={c.hex} className={styles.swatchRow}>
              <div className={styles.swatch} style={{ background: c.hex }} />
              {c.name} — {c.hex}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
