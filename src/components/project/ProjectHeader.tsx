'use client';

import type { Project } from '@/data/projects';
import styles from './ProjectHeader.module.css';

type ProjectHeaderProps = {
  project: Project;
  totalProjects: number;
  onClose: () => void;
};

export default function ProjectHeader({ project, totalProjects, onClose }: ProjectHeaderProps) {
  const isPlanefold = project.slug.includes('planefold') || project.id === 'project-01';

  return (
    <header className={`${styles.header} ${isPlanefold ? styles.planefoldHeader : ''}`}>
      <div className={styles.headerInner}>
        <div className={styles.topRow}>
          {/* Close button */}
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close project"
            id="panel-close-button"
          >
            <span className={styles.closeIcon} aria-hidden="true">✕</span>
            <span className={styles.closeLabel}>Close</span>
          </button>

          {/* Project counter */}
          <span className={`label ${styles.counter}`} aria-label={`Project ${project.number} of ${totalProjects}`}>
            {project.number} / {String(totalProjects).padStart(2, '0')}
          </span>
        </div>

        <div className={styles.projectInfo}>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.description}>{project.description}</p>

          <div className={styles.meta}>
            <span className={`label ${styles.categories}`}>
              {project.categories.join(' · ')}
            </span>
            <span className={`label ${styles.year}`}>{project.year}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
