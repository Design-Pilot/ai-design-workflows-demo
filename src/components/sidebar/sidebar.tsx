'use client';

import { UserProfile } from '../user-profile/user-profile';
import { NavMenuItem } from '../nav-menu-item/nav-menu-item';
import styles from './sidebar.module.css';

export interface NavItem {
  id: string;
  label: string;
  count?: number;
  href?: string;
}

export interface NavSection {
  id: string;
  title?: string;
  items: NavItem[];
}

export interface SidebarProfile {
  name: string;
  email: string;
}

interface SidebarProps {
  profile: SidebarProfile;
  sections: NavSection[];
  activeNavId: string;
  onNavChange: (id: string) => void;
}

export function Sidebar({ profile, sections, activeNavId, onNavChange }: SidebarProps) {
  return (
    <aside className={styles.root}>
      <UserProfile name={profile.name} email={profile.email} />
      {sections.map(section => (
        <div key={section.id} className={styles.section}>
          {section.title && (
            <div className={styles.subheader}>
              <span className={styles.subheaderLabel}>{section.title}</span>
            </div>
          )}
          {section.items.map(item => (
            <NavMenuItem
              key={item.id}
              label={item.label}
              count={item.count}
              isActive={item.id === activeNavId}
              href={item.href}
              onClick={() => onNavChange(item.id)}
            />
          ))}
        </div>
      ))}
    </aside>
  );
}
