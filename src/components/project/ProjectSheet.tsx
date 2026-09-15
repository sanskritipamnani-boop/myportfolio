'use client';

import { useEffect, useState, useRef } from 'react';
import type { Project } from '@/data/projects';
import ProjectHeader from './ProjectHeader';
import ProjectRenderer from './ProjectRenderer';
import styles from './ProjectSheet.module.css';

type ProjectSheetProps = {
  project: Project | null;
  totalProjects: number;
  isOpen: boolean;
  onClose: () => void;
};

export default function ProjectSheet({
  project,
  totalProjects,
  isOpen,
  onClose,
}: ProjectSheetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [renderedProject, setRenderedProject] = useState<Project | null>(project);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Keep renderedProject active during close transition
  useEffect(() => {
    if (project) {
      setRenderedProject(project);
    }
  }, [project]);

  // Manage open/close state animation, scroll lock, and homepage depth scale effect
  useEffect(() => {
    const mainContent = document.getElementById('main-homepage-wrapper') || document.querySelector('main');

    if (isOpen && renderedProject) {
      setIsVisible(true);
      // Lock body scroll so homepage behind does not scroll
      document.body.style.overflow = 'hidden';

      // Subtle scale-down depth effect on homepage
      if (mainContent) {
        mainContent.style.transition = 'transform 800ms cubic-bezier(0.22, 1, 0.36, 1), opacity 800ms cubic-bezier(0.22, 1, 0.36, 1)';
        mainContent.style.transform = 'scale(0.978)';
        mainContent.style.opacity = '0.92';
        mainContent.style.transformOrigin = 'center top';
      }
    } else {
      setIsVisible(false);
      // Unlock body scroll
      document.body.style.overflow = '';

      // Reset homepage scale
      if (mainContent) {
        mainContent.style.transform = '';
        mainContent.style.opacity = '';
        mainContent.style.transition = '';
      }
    }

    return () => {
      document.body.style.overflow = '';
      if (mainContent) {
        mainContent.style.transform = '';
        mainContent.style.opacity = '';
        mainContent.style.transition = '';
      }
    };
  }, [isOpen, renderedProject]);

  // Keyboard shortcut: Escape key closes active project sheet
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!renderedProject) return null;

  return (
    <>
      {/* Dimmed backdrop area above sheet padding */}
      <div
        className={`${styles.backdrop} ${isVisible ? styles.backdropVisible : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Large sheet panel rising smoothly from bottom of viewport */}
      <div
        ref={sheetRef}
        className={`${styles.sheet} ${isVisible ? styles.sheetOpen : styles.sheetClosed}`}
        role="dialog"
        aria-modal="true"
        aria-label={renderedProject.title}
      >
        <div className={styles.handleBar} />

        <div className={styles.sheetContent}>
          <ProjectHeader
            project={renderedProject}
            totalProjects={totalProjects}
            onClose={onClose}
          />

          <ProjectRenderer project={renderedProject} />
        </div>
      </div>
    </>
  );
}
