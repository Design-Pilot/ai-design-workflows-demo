'use client';

import type { ReactNode } from 'react';
import { IconBookmark, IconChevronDown } from '../icons';
import styles from './filter.module.css';

interface FilterProps {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export function Filter({ label, icon, onClick }: FilterProps) {
  return (
    <button type="button" className={styles.root} onClick={onClick}>
      <span className={styles.wrapper}>
        <span className={styles.iconSlot}>{icon ?? <IconBookmark size={16} />}</span>
        <span className={styles.label}>{label}</span>
      </span>
      <span className={styles.chevron}>
        <IconChevronDown size={14} />
      </span>
    </button>
  );
}
