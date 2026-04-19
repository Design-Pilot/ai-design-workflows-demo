import Link from 'next/link';
import { DocsNav } from './nav';
import styles from './layout.module.css';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/docs" className={styles.logo}>
            Notion Mail
          </Link>
          <span className={styles.logoSub}>Design System</span>
        </div>

        <DocsNav />

        <div className={styles.sidebarFooter}>
          <Link href="/inbox" className={styles.footerLink}>
            Open Inbox →
          </Link>
        </div>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
