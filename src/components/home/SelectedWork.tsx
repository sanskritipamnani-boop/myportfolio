import Container from '@/components/layout/Container';
import ProjectPreview from './ProjectPreview';
import { projects } from '@/data/projects';
import styles from './SelectedWork.module.css';

export default function SelectedWork() {
  return (
    <section className={styles.section} id="work" aria-labelledby="work-heading">
      {/* Container header for single line label and caption */}
      <Container>
        <header className={styles.header}>
          <h2 id="work-heading" className={styles.sectionHeading}>
            <span className={`label ${styles.sectionLabel}`}>Selected Work</span>
            <span className={styles.introInline}> — A curated selection of case studies, design systems, and digital products.</span>
          </h2>
        </header>
      </Container>

      {/* Full screen project list without padding bounds */}
      <div className={styles.list} role="list">
        {projects.map((project, i) => (
          <div key={project.id} role="listitem" className={styles.listItem}>
            <ProjectPreview project={project} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
