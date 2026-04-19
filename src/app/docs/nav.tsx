'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';

const NAV = [
  {
    section: 'Tokens',
    items: [
      { label: 'Colors', href: '/docs/tokens/colors', soon: true },
      { label: 'Typography', href: '/docs/tokens/typography', soon: true },
      { label: 'Spacing', href: '/docs/tokens/spacing', soon: true },
    ],
  },
  {
    section: 'Atoms',
    items: [
      { label: 'Tag Button', href: '/docs/atoms/tag-button', soon: false },
      { label: 'Icon Button', href: '/docs/atoms/icon-button', soon: true },
      { label: 'Checkbox', href: '/docs/atoms/checkbox', soon: true },
    ],
  },
  {
    section: 'Components',
    items: [
      { label: 'Email Row', href: '/docs/components/email-row', soon: false },
    ],
  },
  {
    section: 'Patterns',
    items: [
      { label: 'Inbox', href: '/docs/patterns/inbox', soon: true },
    ],
  },
];

export function DocsNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {NAV.map((group) => (
        <div key={group.section} className={styles.navGroup}>
          <span className={styles.navGroupLabel}>{group.section}</span>
          {group.items.map((item) => {
            const isActive = !item.soon && pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.soon ? '#' : item.href}
                className={[
                  styles.navItem,
                  item.soon ? styles.navItemSoon : '',
                  isActive ? styles.navItemActive : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-disabled={item.soon}
                tabIndex={item.soon ? -1 : undefined}
              >
                {item.label}
                {item.soon && <span className={styles.soonBadge}>Soon</span>}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
