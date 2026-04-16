import Link from 'next/link';
import styles from './page.module.css';

const designers = [
  {
    slug: 'chethan',
    name: 'Chethan',
    initials: 'CK',
    avatarBg: '#D3E5EF',
    avatarColor: '#183347',
    prototypeCount: 1,
  },
  {
    slug: 'sarah',
    name: 'Sarah',
    initials: 'SV',
    avatarBg: '#DBEDDB',
    avatarColor: '#1C3829',
    prototypeCount: 0,
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>Notion Mail</span>
        <Link href="/inbox" className={styles.playgroundLink}>
          Open Inbox →
        </Link>
      </header>
      <main className={styles.main}>
        <p className={styles.eyebrow}>Design System</p>
        <h1 className={styles.title}>Designer Playgrounds</h1>
        <p className={styles.subtitle}>
          Isolated spaces for experiments and prototypes. Nothing here affects production.
        </p>
        <div className={styles.grid}>
          {designers.map((d) => (
            <Link key={d.slug} href={`/prototypes/${d.slug}`} className={styles.card}>
              <div
                className={styles.avatar}
                style={{ background: d.avatarBg, color: d.avatarColor }}
              >
                {d.initials}
              </div>
              <div>
                <div className={styles.cardName}>{d.name}</div>
                <div className={styles.cardMeta}>
                  {d.prototypeCount === 0
                    ? 'No prototypes yet'
                    : `${d.prototypeCount} prototype${d.prototypeCount > 1 ? 's' : ''}`}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
