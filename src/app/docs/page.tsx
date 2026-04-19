import Link from 'next/link';
import styles from './page.module.css';

const READY = [
  {
    name: 'Email Row',
    href: '/docs/components/email-row',
    category: 'Components',
    description:
      'Single email list item with sender, subject, preview text, date, labels, and hover actions.',
  },
];

const SOON = [
  { name: 'Colors', category: 'Tokens' },
  { name: 'Typography', category: 'Tokens' },
  { name: 'Spacing', category: 'Tokens' },
  { name: 'Tag Button', category: 'Atoms' },
  { name: 'Icon Button', category: 'Atoms' },
  { name: 'Checkbox', category: 'Atoms' },
  { name: 'Inbox', category: 'Patterns' },
];

export default function DocsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>Notion Mail</p>
        <h1 className={styles.title}>Design System</h1>
        <p className={styles.subtitle}>
          Interactive documentation for every component, token, and pattern.
          Explore live previews and customizable controls for each piece of the system.
        </p>
      </header>

      <div className={styles.grid}>
        {READY.map((c) => (
          <Link key={c.href} href={c.href} className={styles.card}>
            <div className={styles.cardMeta}>
              <span className={styles.cardCategory}>{c.category}</span>
            </div>
            <span className={styles.cardName}>{c.name}</span>
            <p className={styles.cardDesc}>{c.description}</p>
          </Link>
        ))}
        {SOON.map((c) => (
          <div key={c.name} className={`${styles.card} ${styles.cardSoon}`}>
            <div className={styles.cardMeta}>
              <span className={styles.cardCategory}>{c.category}</span>
              <span className={styles.comingSoonBadge}>Soon</span>
            </div>
            <span className={styles.cardName}>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
