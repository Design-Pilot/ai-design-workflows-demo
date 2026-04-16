'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './nav-menu-item.module.css';

interface NavMenuItemProps {
  label: string;
  count?: number;
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
}

const HOVER_COLORS = [
  '#D3E5EF', // blue-100
  '#DBEDDB', // green-100
  '#FDECC8', // yellow-100
  '#EEE0DA', // brown-100
  '#E8D5EF', // soft purple
  '#FAD4D4', // soft pink
];

function formatCount(count: number): string {
  return count >= 99 ? '99+' : String(count);
}

export function NavMenuItem({ label, count, isActive = false, href, onClick }: NavMenuItemProps) {
  const [hoverColor, setHoverColor] = useState<string | null>(null);

  const handleMouseEnter = () => {
    const color = HOVER_COLORS[Math.floor(Math.random() * HOVER_COLORS.length)];
    setHoverColor(color);
  };

  const handleMouseLeave = () => {
    setHoverColor(null);
  };

  const inner = (
    <button
      type="button"
      className={`${styles.wrapper} ${isActive ? styles.active : ''}`}
      style={hoverColor ? { background: hoverColor } : undefined}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={styles.label}>{label}</span>
      {count !== undefined && <span className={styles.count}>{formatCount(count)}</span>}
    </button>
  );

  return (
    <div className={styles.root}>
      {href ? <Link href={href} style={{ textDecoration: 'none', display: 'block', width: '100%' }}>{inner}</Link> : inner}
    </div>
  );
}
