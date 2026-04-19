'use client';

import type { ReactNode } from 'react';
import styles from './docs-ui.module.css';

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
    >
      <span className={styles.toggleThumb} />
    </button>
  );
}

export function ControlRow({
  label,
  children,
  fullWidth,
}: {
  label: string;
  children: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={`${styles.controlRow} ${fullWidth ? styles.controlRowFull : ''}`}>
      <span className={styles.controlLabel}>{label}</span>
      <div className={`${styles.controlValue} ${fullWidth ? styles.controlValueFull : ''}`}>
        {children}
      </div>
    </div>
  );
}

export function DemoRow({
  label,
  note,
  children,
}: {
  label: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.demoItem}>
      <div className={styles.demoMeta}>
        <span className={styles.demoLabel}>{label}</span>
        {note && <span className={styles.demoNote}>{note}</span>}
      </div>
      <div className={styles.demoCanvas}>{children}</div>
    </div>
  );
}
