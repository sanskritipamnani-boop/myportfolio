'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Container from '@/components/layout/Container';
import styles from './MoreProjects.module.css';

interface MoreProjectItem {
  id: string;
  title: string;
  category: string;
  image: string;
  mediaType?: 'image' | 'video';
  link?: string;
  slug?: string;
  isInternal?: boolean;
}

const MORE_PROJECTS: MoreProjectItem[] = [
  {
    id: 'hackathon',
    title: 'Hackathon, Dubstech',
    category: 'Presentation & Concept',
    image: '/images/hacathon.png',
    mediaType: 'image',
    link: 'https://www.figma.com/deck/qX0GeJAHVDYWxizhBUrBNB/Presentation?node-id=1-259&viewport=-133%2C-85%2C0.62&t=hmmWYhTfgMdQ9Jc0-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1',
  },
  {
    id: 'pinterest',
    title: 'Concept for Pinterest Boards',
    category: 'Interactive Concept & Prototype',
    image: '/images/pinterestcover.mp4',
    mediaType: 'video',
    link: 'https://pinterestproject123.netlify.app/',
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp Feature Concept',
    category: 'Product Design & Mobile App',
    image: '/images/Group 1.png',
    mediaType: 'image',
    slug: 'whatsapp',
    isInternal: true,
  },
];

interface ProjectCardProps {
  project: MoreProjectItem;
  instanceKey: string;
}

function ProjectCard({ project, instanceKey }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (bubbleRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      bubbleRef.current.style.transform = `translate3d(${x + 14}px, ${y + 14}px, 0)`;
    }
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLAnchorElement>) => {
    setIsHovered(true);
    if (bubbleRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      bubbleRef.current.style.transform = `translate3d(${x + 14}px, ${y + 14}px, 0)`;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (project.isInternal && project.slug) {
      e.preventDefault();
      const event = new CustomEvent('open-project-sheet', { detail: project.slug });
      window.dispatchEvent(event);
    }
  };

  return (
    <a
      key={instanceKey}
      href={project.isInternal ? `/work/${project.slug}` : project.link}
      target={project.isInternal ? undefined : '_blank'}
      rel={project.isInternal ? undefined : 'noopener noreferrer'}
      className={styles.card}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={() => setIsHovered(false)}
      aria-label={`${project.title} - Open project`}
    >
      <div className={styles.imageWrapper}>
        {project.mediaType === 'video' ? (
          <video
            src={project.image}
            autoPlay
            muted
            loop
            playsInline
            className={styles.projectImage}
          />
        ) : (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.projectImage}
            priority={false}
          />
        )}
        <div className={styles.imageOverlay} />
      </div>

      <div className={styles.cardInfo}>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        <p className={styles.cardCategory}>{project.category}</p>
      </div>

      {isHovered && (
        <div ref={bubbleRef} className={styles.cursorBubble}>
          Open project ↗
        </div>
      )}
    </a>
  );
}

export default function MoreProjects() {
  return (
    <section className={styles.section} id="more-projects" aria-labelledby="more-projects-title">
      <header className={styles.header}>
        <h2 id="more-projects-title" className={styles.heading}>
          <span className={`label ${styles.sectionLabel}`}>Some more projects, ideas and solutions</span>
        </h2>
      </header>

      {/* 3-Column track with interactive persona-style hover-expand */}
      <div className={styles.grid}>
        {MORE_PROJECTS.map((project, index) => (
          <ProjectCard
            key={`${project.id}-${index}`}
            project={project}
            instanceKey={`${project.id}-${index}`}
          />
        ))}
      </div>
    </section>
  );
}
