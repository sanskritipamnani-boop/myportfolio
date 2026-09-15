'use client';

import { useRouter } from 'next/navigation';
import Media from '@/components/shared/Media';
import type { Project } from '@/data/projects';
import styles from './NextProject.module.css';

type NextProjectProps = {
  project: Project;
};

export default function NextProject({ project }: NextProjectProps) {
  const router = useRouter();

  const handleClick = () => {
    const event = new CustomEvent('open-project-sheet', { detail: project.slug });
    window.dispatchEvent(event);
  };

  return (
    <section className={styles.section} aria-label="Next project">
      <div className={styles.inner}>
        <span className={`label ${styles.label}`}>Next Project</span>

        <button className={styles.card} onClick={handleClick} aria-label={`Open ${project.title}`}>
          <div className={styles.cardMeta}>
            <span className={`label ${styles.number}`}>{project.number}</span>
            <h2 className={styles.title}>{project.title}</h2>
            <p className={styles.categories}>{project.categories.join(' · ')}</p>
          </div>

          <div className={styles.mediaWrapper}>
            <Media
              {...project.thumbnail}
              className={styles.media}
              sizes="(max-width: 768px) 80vw, 40vw"
            />
          </div>
        </button>
      </div>
    </section>
  );
}
