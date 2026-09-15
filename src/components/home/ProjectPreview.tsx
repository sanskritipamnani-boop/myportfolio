'use client';

import { useState } from 'react';
import Link from 'next/link';
import PixelatedThumbnail from '@/components/shared/PixelatedThumbnail';
import type { Project } from '@/data/projects';
import styles from './ProjectPreview.module.css';

type ProjectPreviewProps = {
  project: Project;
  index: number;
};

export default function ProjectPreview({ project, index }: ProjectPreviewProps) {
  const isEven = index % 2 === 0;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showCursorTip, setShowCursorTip] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleProjectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const event = new CustomEvent('open-project-sheet', { detail: project.slug });
    window.dispatchEvent(event);
  };

  return (
    <article 
      className={`${styles.project} ${isEven ? styles.even : styles.odd}`} 
      id={`project-preview-${project.slug}`}
    >
      {/* 1. Text Content Column */}
      <div className={styles.content}>
        <h3 className={styles.statement}>
          <Link href={`/work/${project.slug}`} onClick={handleProjectClick} className={styles.statementLink}>
            {project.description}
          </Link>
        </h3>
        
        <div className={styles.meta}>
          <span className={styles.year}>{project.year}</span>
          <span className={styles.pipe}>|</span>
          <span className={styles.categories}>{project.categories.join(', ')}</span>
        </div>

        <Link href={`/work/${project.slug}`} onClick={handleProjectClick} className={styles.viewLink}>
          View Case Study <span className={styles.arrow}>→</span>
        </Link>
      </div>

      {/* 2. Image Visual Column */}
      <Link
        href={`/work/${project.slug}`}
        onClick={handleProjectClick}
        className={styles.mediaLink}
        aria-label={`Open ${project.title}`}
        scroll={false}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setShowCursorTip(true)}
        onPointerLeave={() => setShowCursorTip(false)}
      >
        <div className={styles.mediaWrapper}>
          <PixelatedThumbnail
            src={project.thumbnail.src}
            alt={project.thumbnail.alt || project.title}
            priority={index === 0}
            className={styles.media}
          />
        </div>

        {showCursorTip && (
          <div
            className={styles.cursorTip}
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
            }}
          >
            view case study
          </div>
        )}
      </Link>
    </article>
  );
}
