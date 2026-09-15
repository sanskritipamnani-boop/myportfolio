'use client';

import { useRouter } from 'next/navigation';
import type { Project } from '@/data/projects';
import ProjectHeader from './ProjectHeader';
import ProjectRenderer from './ProjectRenderer';
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
        <ProjectHeader
          project={project}
          totalProjects={totalProjects}
          onClose={handleClose}
        />

        <div className={styles.content}>
          <ProjectRenderer project={project} />
        </div>
      </div>
    </div>
  );
}
