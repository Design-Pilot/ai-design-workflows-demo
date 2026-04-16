'use client';

import Link from 'next/link';
import styles from './nav-menu-item.module.css';

interface NavMenuItemProps {
  label: string;
  count?: number;
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
}

function formatCount(count: number): string {
  return count >= 99 ? '99+' : String(count);
}

export function NavMenuItem({ label, count, isActive = false, href, onClick }: NavMenuItemProps) {
  const inner = (
    <button
      type="button"
      className={`${styles.wrapper} ${isActive ? styles.active : ''}`}
      onClick={onClick}
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
