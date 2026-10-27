'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/home/Hero';
import SelectedWork from '@/components/home/SelectedWork';
import Playground from '@/components/home/Playground';
import AboutPreview from '@/components/home/AboutPreview';
import WorkPlayToggle from '@/components/shared/WorkPlayToggle';
import Container from '@/components/layout/Container';
import ProjectSheet from '@/components/project/ProjectSheet';
import { getProjectBySlug, projects } from '@/data/projects';
import styles from './page.module.css';

type HomePageProps = {
  initialSlug?: string;
};

export default function HomePage({ initialSlug }: HomePageProps) {
  const [activeTab, setActiveTab] = useState<'work' | 'play'>('work');
  const [isToggleVisible, setIsToggleVisible] = useState(false);
  const [activeProjectSlug, setActiveProjectSlug] = useState<string | null>(initialSlug || null);

  // Listen to custom open-project-sheet events & browser popstate (back/forward navigation)
  useEffect(() => {
    const handleOpenProject = (e: CustomEvent<string>) => {
      const slug = e.detail;
      setActiveProjectSlug(slug);
      window.history.pushState({ slug }, '', `/work/${slug}`);
    };

    const handlePopState = (e: PopStateEvent) => {
      const path = window.location.pathname;
      if (path.startsWith('/work/')) {
        const slug = path.replace('/work/', '');
        setActiveProjectSlug(slug);
      } else {
        setActiveProjectSlug(null);
      }
    };

    const handleCloseEvent = () => {
      setActiveProjectSlug(null);
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('open-project-sheet' as any, handleOpenProject);
    window.addEventListener('close-project-sheet', handleCloseEvent);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('open-project-sheet' as any, handleOpenProject);
      window.removeEventListener('close-project-sheet', handleCloseEvent);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleCloseProject = () => {
    setActiveProjectSlug(null);
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
  };

  // Listen to hash change to switch tabs automatically or scroll to contact
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#playground' || hash === '#play') {
        setActiveTab('play');
      } else if (hash === '#work') {
        setActiveTab('work');
      } else if (hash === '#contact') {
        setTimeout(() => {
          const footer = document.getElementById('contact');
          if (footer) {
            footer.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }
        }, 150);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Listen to scroll position to show/hide the floating switcher dynamically
  useEffect(() => {
    const handleScroll = () => {
      // Show toggle only when scrolled down into the projects section (scrollY > 300)
      if (window.scrollY > 300) {
        setIsToggleVisible(true);
      } else {
        setIsToggleVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeProject = activeProjectSlug ? getProjectBySlug(activeProjectSlug) || null : null;

  return (
    <>
      {/* Main homepage container wrapper that receives subtle scale depth effect when sheet opens */}
      <div id="main-homepage-wrapper">
        <Hero />
        
        {/* Solid scrollable container wrapper that overlays and covers the fixed hero background */}
        <div className={styles.scrollableContent}>
          <section id="work-play-section" className={styles.contentSection}>
            <Container>
              <div className={`${styles.toggleWrapper} ${isToggleVisible ? styles.toggleVisible : ''}`}>
                <WorkPlayToggle activeTab={activeTab} onChange={setActiveTab} />
              </div>
            </Container>

            {activeTab === 'work' ? (
              <div id="work-tabpanel" role="tabpanel" aria-labelledby="work-tab">
                <SelectedWork />
              </div>
            ) : (
              <div id="play-tabpanel" role="tabpanel" aria-labelledby="play-tab">
                <Playground />
              </div>
            )}
          </section>

          {activeTab === 'work' && <AboutPreview />}
        </div>
      </div>

      {/* Yambo Studio Inspired Bottom-to-Top Project Sheet Panel */}
      <ProjectSheet
        project={activeProject}
        totalProjects={projects.length}
        isOpen={Boolean(activeProjectSlug)}
        onClose={handleCloseProject}
      />
    </>
  );
}
