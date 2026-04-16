'use client';

import { useState } from 'react';
import { InboxTemplate } from '../../components/inbox-template/inbox-template';
import { EmailRow } from '../../components/email-row/email-row';
import { profile, sidebarSections, filters, promotionEmails } from './promotions-data';
import { useThemeShortcut } from '../inbox/use-theme-shortcut';
import styles from './promotions.module.css';

export default function PromotionsPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeNavId, setActiveNavId] = useState<string>('promotion');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  useThemeShortcut(setTheme);

  const toggleSelected = (index: number) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div data-theme={theme} className={styles.themeWrapper}>
      <InboxTemplate
        profile={profile}
        sections={sidebarSections}
        pageTitle="Promotions"
        filters={filters}
        activeNavId={activeNavId}
        onNavChange={setActiveNavId}
      >
        <div className={styles.emailList}>
          {promotionEmails.map((email, i) => (
            <EmailRow
              key={i}
              {...email}
              isSelected={selectedRows.has(i)}
              onSelect={() => toggleSelected(i)}
            />
          ))}
        </div>
      </InboxTemplate>
    </div>
  );
}
