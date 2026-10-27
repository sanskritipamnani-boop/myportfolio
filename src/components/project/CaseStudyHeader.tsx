'use client';

import type { Project } from '@/data/projects';
import styles from './CaseStudyHeader.module.css';

type CaseStudyHeaderProps = {
  project: Project;
  totalProjects: number;
  onClose: () => void;
};

export default function CaseStudyHeader({
  project,
  totalProjects,
  onClose,
}: CaseStudyHeaderProps) {
  const categoryYearLabel = project.categories.join(' • ').toUpperCase();

  return (
    <header className={styles.header}>
      {/* Top Utility Row */}
      <div className={styles.topRow}>
        <button
          className={styles.backButton}
          onClick={onClose}
          aria-label="Back to portfolio"
        >
          <span className={styles.backArrow} aria-hidden="true">←</span>
          <span className={styles.backLabel}>BACK</span>
        </button>

        <span className={styles.counter} aria-label={`Project ${project.number} of ${totalProjects}`}>
          {project.number} / {String(totalProjects).padStart(2, '0')}
        </span>
      </div>

      {/* Main Editorial Header Info */}
      <div className={styles.titleWrap}>
        <div className={styles.categoryMeta}>{categoryYearLabel}</div>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.description}>{project.description}</p>
      </div>
    </header>
  );
}
