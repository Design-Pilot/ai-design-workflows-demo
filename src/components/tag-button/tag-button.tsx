import styles from './tag-button.module.css';

export type TagColor = 'neutral' | 'yellow' | 'green' | 'blue' | 'brown';

interface TagButtonProps {
  label: string;
  color?: TagColor;
}

export function TagButton({ label, color = 'neutral' }: TagButtonProps) {
  return (
    <span className={`${styles.tag} ${styles[color]}`}>
      <span className={styles.label}>{label}</span>
    </span>
  );
}
