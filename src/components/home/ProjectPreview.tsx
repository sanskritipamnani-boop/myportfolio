'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PixelatedThumbnail from '@/components/shared/PixelatedThumbnail';
import type { Project } from '@/data/projects';
import styles from './ProjectPreview.module.css';

type ProjectPreviewProps = {
  project: Project;
  index: number;
};

export default function ProjectPreview({ project, index }: ProjectPreviewProps) {
  const isProject01 = index === 0 || project.id === 'project-01' || project.slug.includes('planefold');
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
      className={styles.project} 
      id={`project-preview-${project.slug}`}
    >
      {/* 1. Image Visual Column Wrapper (Left) */}
      <div className={styles.mediaColumnWrapper}>
        {isProject01 && (
          <motion.div
            className={styles.peekingBeaverWrapper}
            initial={{ x: -35, opacity: 0, scale: 0.85, rotate: 10 }}
            whileInView={{ x: 26, opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: false, margin: '-40px' }}
            transition={{
              type: 'spring',
              stiffness: 180,
              damping: 17,
              delay: 0.15,
            }}
          >
            <img
              src="/beaver-side.svg"
              alt="Peeking Beaver"
              className={styles.peekingBeaverImg}
            />
          </motion.div>
        )}

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
              objectPosition={project.thumbnail.objectPosition}
              transform={project.thumbnail.transform}
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
              View case study ↗
            </div>
          )}
        </Link>
      </div>

      {/* 2. Text Content Column (Right) */}
      <div className={styles.content}>
        <h3 className={styles.statement}>
          <Link href={`/work/${project.slug}`} onClick={handleProjectClick} className={styles.statementLink}>
            {project.description}
          </Link>
        </h3>
        
        <div className={styles.meta}>
          <span className={styles.categories}>{project.categories.join(', ')}</span>
        </div>

        <Link href={`/work/${project.slug}`} onClick={handleProjectClick} className={styles.viewLink}>
          View Case Study <span className={styles.arrow}>→</span>
        </Link>
      </div>
    </article>
  );
}
