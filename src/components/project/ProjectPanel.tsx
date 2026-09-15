'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '@/data/projects';
import ProjectHeader from './ProjectHeader';
import ProjectRenderer from './ProjectRenderer';
import styles from './ProjectPanel.module.css';

type ProjectPanelProps = {
  project: Project;
  totalProjects: number;
  savedScrollY?: number;
};

// Scroll position store — persists across panel opens/closes
let _savedScrollY = 0;

export function saveScrollY(y: number) { _savedScrollY = y; }
export function getSavedScrollY() { return _savedScrollY; }

export default function ProjectPanel({ project, totalProjects }: ProjectPanelProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Lock body scroll on mount, restore on unmount
  useEffect(() => {
    // Save current scroll position
    _savedScrollY = window.scrollY;

    // Lock body
    document.body.style.overflow = 'hidden';
    document.body.style.top = `-${_savedScrollY}px`;
    document.body.classList.add('panel-open');

    // Store previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus the panel
    panelRef.current?.focus();

    return () => {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.top = '';
      document.body.classList.remove('panel-open');
      window.scrollTo({ top: _savedScrollY, behavior: 'instant' as ScrollBehavior });

      // Restore focus to the element that opened the panel
      if (previousFocusRef.current) {
        previousFocusRef.current.focus({ preventScroll: true });
      }
    };
  }, []);

  // Scroll panel to top when project changes
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [project.slug]);

  // Keyboard handler — Escape closes
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      router.back();
    }
  }, [router]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Focus trap inside panel
  const handleTabKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      handleClose();
    }
  }, [handleClose]);

  return (
    <AnimatePresence>
      {/* Backdrop overlay */}
      <motion.div
        key="overlay"
        className={styles.overlay}
        ref={overlayRef}
        onClick={handleOverlayClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        aria-hidden="true"
      />

      {/* Panel */}
      <motion.div
        key={`panel-${project.slug}`}
        className={styles.panel}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} — Project case study`}
        tabIndex={-1}
        onKeyDown={handleTabKey}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{
          duration: 0.56,
          ease: [0.32, 0.72, 0, 1],
        }}
      >
        <ProjectHeader
          project={project}
          totalProjects={totalProjects}
          onClose={handleClose}
        />

        <div className={styles.content}>
          <ProjectRenderer project={project} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
