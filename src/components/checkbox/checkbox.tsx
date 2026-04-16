'use client';

import styles from './checkbox.module.css';

interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
}

export function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      className={`${styles.checkbox} ${checked ? styles.checked : ''}`}
      onClick={() => onChange?.(!checked)}
      type="button"
    >
      <div className={styles.inner}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </button>
  );
}
