import styles from './icon-button.module.css';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  'aria-label'?: string;
}

export function IconButton({ icon, onClick, 'aria-label': ariaLabel }: IconButtonProps) {
  return (
    <button
      className={styles.iconButton}
      onClick={onClick}
      type="button"
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
}
