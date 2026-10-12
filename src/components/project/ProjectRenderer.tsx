'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Project, SectionType } from '@/data/projects';
import Media from '@/components/shared/Media';
import TextSection from '@/components/case-study/TextSection';
import FullWidthMedia from '@/components/case-study/FullWidthMedia';
import TextMediaSplit from '@/components/case-study/TextMediaSplit';
import VideoBlock from '@/components/case-study/VideoBlock';
import Gallery from '@/components/case-study/Gallery';
import ImageGrid from '@/components/case-study/ImageGrid';
import InsightBlock from '@/components/case-study/InsightBlock';
import QuoteBlock from '@/components/case-study/QuoteBlock';
import ProcessSection from '@/components/case-study/ProcessSection';
import NextProject from '@/components/case-study/NextProject';
import { getNextProject, projects } from '@/data/projects';
import styles from './ProjectRenderer.module.css';

type ProjectRendererProps = {
  project: Project;
};

export default function ProjectRenderer({ project }: ProjectRendererProps) {
  const nextProject = getNextProject(project.slug);
  const isPlanefold = project.slug.includes('planefold') || project.id === 'project-01';
  const hasEmbed = project.sections.some((s) => s.type === 'embed');
  const isFullWidth = isPlanefold || hasEmbed;

  return (
    <div className={`${styles.renderer} ${isFullWidth ? styles.planefoldRenderer : ''}`}>
      {/* Case study sections */}
      <div className={styles.sections}>
        {project.sections.map((section, i) => (
          <SectionRenderer key={i} section={section} />
        ))}
      </div>

      {/* Next project */}
      {nextProject && (
        <NextProject project={nextProject} />
      )}
    </div>
  );
}

function SectionRenderer({ section }: { section: SectionType }) {
  switch (section.type) {
    case 'text':
      return <TextSection heading={section.heading} body={section.body} />;

    case 'full-media':
      return <FullWidthMedia media={section.media} caption={section.caption} />;

    case 'text-media':
      return (
        <TextMediaSplit
          heading={section.heading}
          body={section.body}
          media={section.media}
          mediaPosition={section.mediaPosition}
        />
      );

    case 'video':
      return <VideoBlock media={section.media} caption={section.caption} />;

    case 'gallery':
      return <Gallery images={section.images} columns={section.columns} />;

    case 'image-grid':
      return <ImageGrid images={section.images} />;

    case 'insight':
      return <InsightBlock label={section.label} text={section.text} />;

    case 'quote':
      return <QuoteBlock text={section.text} attribution={section.attribution} />;

    case 'process':
      return <ProcessSection steps={section.steps} />;

    case 'embed':
      return <AutoResizingEmbed src={section.src} title={section.title} />;

    default:
      return null;
  }
}

function AutoResizingEmbed({ src, title }: { src: string; title?: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState('2400px');

  const updateHeight = useCallback(() => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      try {
        const doc = iframe.contentWindow.document;
        if (doc && doc.body) {
          const pageEl = (doc.querySelector('.page') || doc.body.firstElementChild || doc.body) as HTMLElement | null;
          let calculatedHeight = 0;
          if (pageEl) {
            const rect = pageEl.getBoundingClientRect();
            calculatedHeight = Math.ceil(Math.max(rect.height, pageEl.offsetHeight));
          } else {
            calculatedHeight = doc.body.scrollHeight;
          }

          if (calculatedHeight > 300) {
            setIframeHeight(`${calculatedHeight}px`);
          }
        }
      } catch (e) {
        // Fallback for cross-origin
      }
    }
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      updateHeight();
      try {
        if (iframe.contentWindow) {
          const doc = iframe.contentWindow.document;
          const observer = new ResizeObserver(() => updateHeight());
          if (doc.body) observer.observe(doc.body);
          if (doc.documentElement) observer.observe(doc.documentElement);

          const mediaEls = doc.querySelectorAll('img, video');
          mediaEls.forEach((el) => {
            el.addEventListener('load', updateHeight);
            el.addEventListener('loadedmetadata', updateHeight);
          });
        }
      } catch (e) {}
    };

    iframe.addEventListener('load', handleLoad);

    if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
      handleLoad();
    }

    const interval = setInterval(updateHeight, 300);
    const timeout = setTimeout(() => clearInterval(interval), 6000);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [src, updateHeight]);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
        margin: '0',
        padding: '0',
        overflow: 'hidden',
      }}
    >
      <iframe
        ref={iframeRef}
        src={src}
        title={title || 'Interactive Embed'}
        scrolling="no"
        style={{
          width: '100%',
          minWidth: '100%',
          maxWidth: '100%',
          height: iframeHeight,
          border: 'none',
          backgroundColor: 'transparent',
          overflow: 'hidden',
          display: 'block',
        }}
      />
    </div>
  );
}
