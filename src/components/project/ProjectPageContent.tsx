'use client';

import { useRouter } from 'next/navigation';
import type { Project } from '@/data/projects';
import ProjectCaseStudy from './ProjectCaseStudy';
import styles from './ProjectPageContent.module.css';

type ProjectPageContentProps = {
  project: Project;
  totalProjects: number;
};

export default function ProjectPageContent({ project, totalProjects }: ProjectPageContentProps) {
  const router = useRouter();

  const handleClose = () => {
    // Navigate back to the homepage
    router.push('/');
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <ProjectCaseStudy
          project={project}
          totalProjects={totalProjects}
          onClose={handleClose}
        />
      </div>
    </div>
  );
}
