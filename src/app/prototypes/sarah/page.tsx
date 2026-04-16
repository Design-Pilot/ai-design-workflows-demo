import Link from 'next/link';
import styles from './page.module.css';

export default function SarahPrototypes() {
  return (
    <div className={styles.page}>
      <Link href="/" className={styles.back}>← Back</Link>
      <div className={styles.header}>
        <div className={styles.avatar}>SV</div>
        <h1 className={styles.title}>Sarah's Playground</h1>
      </div>
      <div className={styles.empty}>
        <div className={styles.emptyTitle}>Nothing here yet</div>
        <div className={styles.emptyDesc}>
          Sarah's prototypes will appear here once added to{' '}
          <code>src/app/prototypes/sarah/</code>.
        </div>
      </div>
    </div>
  );
}
