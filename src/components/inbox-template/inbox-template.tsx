'use client';

import type { ReactNode } from 'react';
import { Sidebar, type NavSection, type SidebarProfile } from '../sidebar/sidebar';
import { PageHeader } from '../page-header/page-header';
import { Filter } from '../filter/filter';
import styles from './inbox-template.module.css';

export interface FilterConfig {
  id: string;
  label: string;
}

interface InboxTemplateProps {
  profile: SidebarProfile;
  sections: NavSection[];
  pageTitle: string;
  filters: FilterConfig[];
  activeNavId: string;
  onNavChange: (id: string) => void;
  onFilterClick?: (id: string) => void;
  children?: ReactNode;
}

export function InboxTemplate({
  profile,
  sections,
  pageTitle,
  filters,
  activeNavId,
  onNavChange,
  onFilterClick,
  children,
}: InboxTemplateProps) {
  return (
    <div className={styles.root}>
      <Sidebar
        profile={profile}
        sections={sections}
        activeNavId={activeNavId}
        onNavChange={onNavChange}
      />
      <div className={styles.main}>
        <div className={styles.topSection}>
          <PageHeader title={pageTitle} />
          <div className={styles.filterBar}>
            {filters.map(filter => (
              <Filter
                key={filter.id}
                label={filter.label}
                onClick={() => onFilterClick?.(filter.id)}
              />
            ))}
          </div>
        </div>
        <div className={styles.slot}>{children}</div>
      </div>
    </div>
  );
}
