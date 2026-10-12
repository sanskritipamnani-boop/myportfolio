'use client';

import type { ProjectMetaType } from '@/data/projects';
import styles from './ProjectMeta.module.css';

type ProjectMetaProps = {
  meta?: ProjectMetaType;
};

export default function ProjectMeta({ meta }: ProjectMetaProps) {
  if (!meta) return null;

  const items = [
    { label: 'ROLE', value: meta.role },
    { label: 'CLIENT', value: meta.client },
    { label: 'TIMELINE', value: meta.timeline },
    { label: 'SCOPE', value: meta.scope },
    { label: 'TEAM', value: meta.team },
  ].filter((item) => Boolean(item.value));

  if (items.length === 0) return null;

  return (
    <div className={styles.metaRow}>
      {items.map((item, index) => (
        <div key={index} className={styles.metaField}>
          <span className={styles.label}>{item.label}</span>
          <span className={styles.value}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}
