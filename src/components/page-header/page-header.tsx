import styles from './page-header.module.css';

interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{title}</h1>
    </div>
  );
}
