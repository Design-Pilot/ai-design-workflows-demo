import Link from 'next/link';
import styles from './page.module.css';

const prototypes = [
  {
    slug: 'hover-experiment',
    name: 'Random Hover Colors',
    description: 'Sidebar nav links cycle through 6 pastel colors on every hover — exploring delight through randomness.',
    tag: 'Interaction',
  },
];

export default function ChethanPrototypes() {
  return (
    <div className={styles.page}>
      <Link href="/" className={styles.back}>← Back</Link>
      <div className={styles.header}>
        <div className={styles.avatar}>CK</div>
        <h1 className={styles.title}>Chethan's Playground</h1>
      </div>
      <p className={styles.subtitle}>{prototypes.length} prototype{prototypes.length !== 1 ? 's' : ''}</p>
      <div className={styles.grid}>
        {prototypes.map((p) => (
          <Link key={p.slug} href={`/prototypes/chethan/${p.slug}`} className={styles.card}>
            <span className={styles.cardLabel}>{p.tag}</span>
            <div className={styles.cardName}>{p.name}</div>
            <div className={styles.cardDesc}>{p.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
