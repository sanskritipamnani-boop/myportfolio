import styles from './TextSection.module.css';

type TextSectionProps = {
  heading?: string;
  body: string;
};

export default function TextSection({ heading, body }: TextSectionProps) {
  return (
    <section className={styles.section}>
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      <p className={styles.body}>{body}</p>
    </section>
  );
}
