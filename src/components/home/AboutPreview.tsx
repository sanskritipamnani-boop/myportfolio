import Link from 'next/link';
import Container from '@/components/layout/Container';
import styles from './AboutPreview.module.css';

export default function AboutPreview() {
  return (
    <section className={styles.section} aria-labelledby="about-preview-heading">
      <Container>
        <div className={styles.inner}>
          <div className={styles.content}>
            <h2 id="about-preview-heading" className={`label ${styles.sectionLabel}`}>
              About
            </h2>
            <p className={styles.intro}>
              Product Experience Design student at NIFT Gandhinagar exploring how physical and digital worlds come together through interaction, understanding, and technology.
            </p>
            <p className={styles.role}>
              Product Experience Designer · Based in Gandhinagar, India
            </p>
            <Link href="/about" className={styles.moreLink} aria-label="More about me">
              <span>More About Me</span>
              <span className={styles.arrow} aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
