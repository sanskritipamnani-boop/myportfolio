'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Media from '@/components/shared/Media';
import type { Project } from '@/data/projects';
import styles from './NextProject.module.css';

type NextProjectProps = {
  project: Project;
};

export default function NextProject({ project }: NextProjectProps) {
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleClick = () => {
    const dialogs = document.querySelectorAll('[role="dialog"], .sheet, .panel');
    dialogs.forEach((d) => (d.scrollTop = 0));
    window.scrollTo(0, 0);
    const event = new CustomEvent('open-project-sheet', { detail: project.slug });
    window.dispatchEvent(event);
  };

  return (
    <section className={styles.section} aria-label="Next project">
      <div className={styles.inner}>
        <span className={`label ${styles.label}`}>Next Project</span>

        <button
          className={styles.card}
          onClick={handleClick}
          onPointerMove={handlePointerMove}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          aria-label={`Open ${project.title}`}
        >
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

          {isHovered && (
            <div
              className={styles.cursorBubble}
              style={{
                left: `${mousePos.x}px`,
                top: `${mousePos.y}px`,
              }}
            >
              See project ↗
            </div>
          )}
        </button>
      </div>
    </section>
  );
}
