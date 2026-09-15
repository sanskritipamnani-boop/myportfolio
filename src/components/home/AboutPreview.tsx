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
              Placeholder introduction about your background, approach, and the kind of work you care about.
              Replace this with your actual bio when ready.
            </p>
            <p className={styles.role}>
              Product Designer · Based in [City]
            </p>
            <Link href="/about" className={styles.moreLink} aria-label="More about me">
              <span>More About Me</span>
              <span className={styles.arrow} aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Portrait / visual placeholder */}
          <div className={styles.portrait} aria-hidden="true">
            <span className={styles.portraitLabel}>[ Portrait ]</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
