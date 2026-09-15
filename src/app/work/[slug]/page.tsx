// Direct URL — /work/[slug]
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProjectPageContent from '@/components/project/ProjectPageContent';
import { getProjectBySlug, projects } from '@/data/projects';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <ProjectPageContent
      project={project}
      totalProjects={projects.length}
    />
  );
}
