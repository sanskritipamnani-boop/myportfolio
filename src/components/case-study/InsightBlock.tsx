import styles from './InsightBlock.module.css';

type InsightBlockProps = {
  label?: string;
  text: string;
};

export default function InsightBlock({ label = 'Insight', text }: InsightBlockProps) {
  return (
    <aside className={styles.insight} aria-label={label}>
      <span className={`label ${styles.label}`}>{label}</span>
      <p className={styles.text}>{text}</p>
    </aside>
  );
}
