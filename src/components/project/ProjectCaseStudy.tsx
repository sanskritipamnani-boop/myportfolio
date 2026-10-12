'use client';

import { useEffect, useRef, useState } from 'react';
import type { Project } from '@/data/projects';
import Media from '@/components/shared/Media';
import CaseStudyHeader from './CaseStudyHeader';
import ProjectMeta from './ProjectMeta';
import CaseStudyNavigation, { type NavItem } from './CaseStudyNavigation';
import ProjectRenderer from './ProjectRenderer';
import styles from './ProjectCaseStudy.module.css';

type ProjectCaseStudyProps = {
  project: Project;
  totalProjects: number;
  onClose: () => void;
};

function formatNavLabel(rawText: string): string {
  const text = rawText.trim();
  const lower = text.toLowerCase();

  if (lower.includes('internship') || lower.includes('industry')) return 'Intro';
  if (lower.includes('origin')) return 'Origin';
  if (lower.includes('the facts') || lower.includes('facts')) return 'The Facts';
  if (lower.includes('initial question')) return 'Initial Question';
  if (lower.includes('synthesis')) return 'Synthesis';
  if (lower.includes('the gap')) return 'The Gap';
  if (lower.includes('the response')) return 'The Response';
  if (lower.includes('key decision')) return 'Key Decision';
  if (lower.includes('trust & safety') || lower.includes('trust and safety')) return 'Trust & Safety';
  if (lower.includes('big question')) return 'Next Question';
  if (lower.includes('overview')) return 'Overview';
  if (lower.includes('challenge') || lower.includes('real challenge')) return 'Challenge';
  if (lower.includes('research') && !lower.includes('process')) return 'Research';
  if (lower.includes('insights') || lower.includes('major insights')) return 'Major Insights';
  if (lower.includes('reframe')) return 'The Reframe';
  if (lower.includes('website') && lower.includes('constraint')) return 'Website & Constraints';
  if (
    lower.includes('journey') ||
    lower.includes('strategy') ||
    lower.includes('decision')
  ) {
    return 'Design Decisions';
  }
  if (lower.includes('competitor analysis') || lower.includes('competitive analysis') || lower.includes('competitive research') || lower.includes('teardown')) return 'Competitor Analysis';
  if (lower.includes('problem statement')) return 'Problem Statement';
  if (lower.includes('hmw') || lower.includes('ideation')) return "HMW's & Ideation";
  if (lower.includes('pain point') || lower.includes('problem')) return 'Pain Points';
  if (lower.includes('solution') || lower.includes('solved')) return 'Solutions';
  if (lower.includes('scope & priority') || lower.includes('scope & priorities') || lower.includes('priorities')) return 'Scope & Priorities';
  if (lower.includes('dashboard') || lower.includes('came to be') || lower.includes('screens walkthrough')) return 'Dashboard Iterations';
  if (lower.includes('checklist')) return 'Checklists';
  if (lower.includes('properties') || lower.includes('property')) return 'Properties Tab';
  if (lower.includes('visual guide') || lower.includes('component') || lower.includes('design system')) return 'Design System';
  if (lower.includes('next')) return "What's Next";
  if (lower.includes('scope') && !lower.includes('priorities')) return 'Scope';
  if (lower.includes('outcome') || lower.includes('result') || lower.includes('current product')) return 'Outcome';
  if (lower.includes('other things explored') || lower.includes('other things') || lower.includes('exploration')) return 'Other things explored';
  if (lower.includes('reflection') || lower.includes('what changed')) return 'Reflection';

  const words = text.split(/\s+/);
  let result = words.length > 3 ? words.slice(0, 2).join(' ') : text;

  // If text was in ALL CAPS (from CSS text-transform: uppercase read via innerText), convert to Title/Sentence Case
  if (result === result.toUpperCase() && result !== result.toLowerCase()) {
    result = result
      .toLowerCase()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  return result;
}

export default function ProjectCaseStudy({
  project,
  totalProjects,
  onClose,
}: ProjectCaseStudyProps) {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);

  // Dynamically extract <section> elements from rendered content (including iframe embeds)
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const updateHeadings = () => {
      let docOrContainer: Document | HTMLElement = container;

      // Check if iframe is present
      const iframe = container.querySelector<HTMLIFrameElement>('iframe');
      if (iframe) {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          if (doc && doc.body && doc.body.children.length > 0) {
            docOrContainer = doc;
          }
        } catch (e) {}
      }

      // Query section containers
      const sections = Array.from(docOrContainer.querySelectorAll<HTMLElement>('section'));
      const items: NavItem[] = [];
      const seenLabels = new Set<string>();

      if (sections.length > 0) {
        sections.forEach((sec, index) => {
          const eyebrow = sec.querySelector<HTMLElement>('.eyebrow, .section-eyebrow');
          const kicker = sec.querySelector<HTMLElement>('.kicker');
          const h2 = sec.querySelector<HTMLElement>('h2');
          const rawText = eyebrow?.innerText?.trim() || eyebrow?.textContent?.trim() || kicker?.innerText?.trim() || kicker?.textContent?.trim() || h2?.innerText?.trim() || h2?.textContent?.trim() || '';

          if (!rawText) return;

          const label = formatNavLabel(rawText);
          if (seenLabels.has(label)) return;
          seenLabels.add(label);

          let id = sec.id;
          if (!id) {
            id = label
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-');
            if (!id) id = `section-${index}`;
            sec.id = id;
          }

          items.push({ id, label });
        });
      } else {
        // Fallback for custom rendered non-<section> elements
        const headings = Array.from(docOrContainer.querySelectorAll<HTMLElement>('.eyebrow, .kicker, h2'));
        headings.forEach((el, index) => {
          const text = el.innerText?.trim() || el.textContent?.trim();
          if (!text) return;
          const label = formatNavLabel(text);
          if (seenLabels.has(label)) return;
          seenLabels.add(label);

          const parentSection = el.closest('section') || el;
          let id = parentSection.id || el.id;
          if (!id) {
            id = label.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            if (!id) id = `sec-${index}`;
            parentSection.id = id;
          }
          items.push({ id, label });
        });
      }

      setNavItems(items);
      if (items.length > 0 && !activeId) {
        setActiveId(items[0].id);
      }
    };

    updateHeadings();
    const timer = setTimeout(updateHeadings, 200);
    const timer2 = setTimeout(updateHeadings, 600);

    const iframe = container.querySelector<HTMLIFrameElement>('iframe');
    if (iframe) {
      iframe.addEventListener('load', updateHeadings);
    }

    const observer = new MutationObserver(updateHeadings);
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      if (iframe) {
        iframe.removeEventListener('load', updateHeadings);
      }
      observer.disconnect();
    };
  }, [project.slug]);

  // Scroll to top whenever project slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
    const container = contentRef.current;
    if (container) {
      const scrollable =
        container.closest<HTMLElement>('[role="dialog"]') ||
        container.closest<HTMLElement>('.sheet') ||
        container.closest<HTMLElement>('.panel');
      if (scrollable) {
        scrollable.scrollTop = 0;
      }
    }
  }, [project.slug]);

  // Scroll listener to update active nav item as user scrolls
  useEffect(() => {
    const container = contentRef.current;
    if (!container || navItems.length === 0) return;

    const iframe = container.querySelector<HTMLIFrameElement>('iframe');
    let doc: Document | HTMLElement = container;
    if (iframe) {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) doc = iframeDoc;
      } catch (e) {}
    }

    const targets = navItems
      .map((item) => {
        try {
          return (doc ? doc.querySelector<HTMLElement>(`[id="${item.id}"]`) : null) || document.getElementById(item.id);
        } catch (e) {
          return document.getElementById(item.id);
        }
      })
      .filter((el): el is HTMLElement => Boolean(el));

    if (targets.length === 0) return;

    const scrollContainer = container.closest('[role="dialog"]') || document.querySelector('[role="dialog"]') || window;

    const handleScroll = () => {
      let currentActiveId = targets[0].id;
      let minDistance = Infinity;

      targets.forEach((target) => {
        const rect = target.getBoundingClientRect();
        let top = rect.top;
        if (iframe && iframe.contentDocument?.contains(target)) {
          const iframeRect = iframe.getBoundingClientRect();
          top = iframeRect.top + rect.top;
        }

        const distance = Math.abs(top - 120);
        if (top <= 300 && distance < minDistance) {
          minDistance = distance;
          currentActiveId = target.id;
        }
      });

      setActiveId(currentActiveId);
    };

    handleScroll();
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [navItems]);

  const handleSelectSection = (id: string) => {
    setActiveId(id);

    const container = contentRef.current;
    let target: HTMLElement | null = document.getElementById(id);
    const iframe = container?.querySelector<HTMLIFrameElement>('iframe');

    if (!target && iframe) {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          target = doc.getElementById(id);
        }
      } catch (e) {}
    }

    if (target) {
      const modalDialog = container?.closest('[role="dialog"]') || document.querySelector('[role="dialog"]');
      if (modalDialog) {
        const targetRect = target.getBoundingClientRect();
        const dialogRect = modalDialog.getBoundingClientRect();
        const scrollTop = modalDialog.scrollTop;

        let targetTopInDialog = scrollTop + (targetRect.top - dialogRect.top);
        if (iframe && iframe.contentDocument?.contains(target)) {
          const iframeRect = iframe.getBoundingClientRect();
          targetTopInDialog = scrollTop + (iframeRect.top - dialogRect.top) + targetRect.top;
        }

        modalDialog.scrollTo({ top: Math.max(0, targetTopInDialog - 80), behavior: 'smooth' });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };



  return (
    <article className={styles.caseStudy}>
      {/* 1. TOP HEADER */}
      <div className={styles.headerArea}>
        <CaseStudyHeader
          project={project}
          totalProjects={totalProjects}
          onClose={onClose}
        />
      </div>

      {/* 2. MAIN LAYOUT: STICKY LEFT NAV + RIGHT CONTENT (HERO + META + SECTIONS) */}
      <div className={`${styles.mainLayout} ${navItems.length === 0 ? styles.singleColumnLayout : ''}`}>
        {navItems.length > 0 && (
          <aside className={styles.sidebar}>
            <CaseStudyNavigation
              items={navItems}
              activeId={activeId}
              onSelectSection={handleSelectSection}
            />
          </aside>
        )}

        <main ref={contentRef} className={styles.contentArea}>
          {/* HERO VISUAL (Positioned in right column alongside sticky sidebar) */}
          {project.heroMedia && (
            <div className={styles.heroArea}>
              <div className={styles.heroInner}>
                <Media
                  {...project.heroMedia}
                  priority
                  sizes="(max-width: 1024px) 90vw, 980px"
                />
              </div>
            </div>
          )}

          {/* PROJECT INFORMATION / META */}
          {project.meta && (
            <div className={styles.metaArea}>
              <ProjectMeta meta={project.meta} />
            </div>
          )}

          {/* CASE STUDY CONTENT SECTIONS */}
          <ProjectRenderer project={project} />
        </main>
      </div>
    </article>
  );
}
