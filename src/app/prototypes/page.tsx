import Link from 'next/link';
import styles from './page.module.css';

const playgrounds = [
  {
    href: '/prototypes/chethan',
    name: "Chethan's Playground",
    description: 'Experiments and interaction ideas.',
  },
  {
    href: '/prototypes/sarah',
    name: "Sarah's Playground",
    description: 'Prototype space for Sarah.',
  },
];

export default function PrototypesIndexPage() {
  return (
    <div className={styles.page}>
      <Link href="/docs" className={styles.back}>
        ← Back to docs
      </Link>
      <h1 className={styles.title}>Prototypes</h1>
      <p className={styles.subtitle}>Designer playgrounds — not part of the design system.</p>
      <div className={styles.grid}>
        {playgrounds.map((p) => (
          <Link key={p.href} href={p.href} className={styles.card}>
            <div className={styles.cardName}>{p.name}</div>
            <div className={styles.cardDesc}>{p.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
