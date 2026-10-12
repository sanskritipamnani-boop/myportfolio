'use client';

import styles from './CaseStudyNavigation.module.css';

export type NavItem = {
  id: string;
  label: string;
};

type CaseStudyNavigationProps = {
  items: NavItem[];
  activeId: string;
  onSelectSection: (id: string) => void;
};

export default function CaseStudyNavigation({
  items,
  activeId,
  onSelectSection,
}: CaseStudyNavigationProps) {
  if (items.length === 0) return null;

  return (
    <nav className={styles.navContainer} aria-label="Case study sections">
      <div className={styles.navList}>
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              onClick={() => onSelectSection(item.id)}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
