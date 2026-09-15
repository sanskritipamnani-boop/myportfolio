import styles from './ProcessSection.module.css';

type Step = {
  label: string;
  description: string;
};

type ProcessSectionProps = {
  steps: Step[];
};

export default function ProcessSection({ steps }: ProcessSectionProps) {
  return (
    <section className={styles.section} aria-label="Process">
      <h2 className={`label ${styles.heading}`}>Process</h2>
      <ol className={styles.steps}>
        {steps.map((step, i) => (
          <li key={i} className={styles.step}>
            <span className={`label ${styles.stepNumber}`}>{String(i + 1).padStart(2, '0')}</span>
            <div className={styles.stepContent}>
              <h3 className={styles.stepLabel}>{step.label}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
