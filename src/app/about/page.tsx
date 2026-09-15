import type { Metadata } from 'next';
import Container from '@/components/layout/Container';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Your Name — product designer focused on interaction and systems.',
};

export default function AboutPage() {
  return (
    <article className={styles.page} aria-labelledby="about-heading">
      <Container>
        <div className={styles.inner}>
          <header className={styles.header}>
            <span className={`label ${styles.eyebrow}`}>About</span>
            <h1 id="about-heading" className={styles.heading}>
              Placeholder headline about who you are and what you care about.
            </h1>
          </header>

          <div className={styles.body}>
            <div className={styles.text}>
              <p>
                Placeholder bio paragraph one. Describe your background, how you got into design,
                and what drives your practice. This should feel personal and specific, not generic.
              </p>
              <p>
                Placeholder bio paragraph two. Talk about your approach to design —
                how you think, what you value, and the kind of problems you find most interesting.
              </p>
              <p>
                Placeholder bio paragraph three. Mention what you are currently working on,
                available for, or looking for in your next role.
              </p>
            </div>

            <aside className={styles.sidebar}>
              {/* Portrait placeholder */}
              <div className={styles.portrait} aria-hidden="true">
                <span className={styles.portraitLabel}>[ Portrait ]</span>
              </div>

              <div className={styles.details}>
                <div className={styles.detailGroup}>
                  <span className={`label ${styles.detailLabel}`}>Discipline</span>
                  <p className={styles.detailValue}>Product Design · UX · Systems</p>
                </div>
                <div className={styles.detailGroup}>
                  <span className={`label ${styles.detailLabel}`}>Based</span>
                  <p className={styles.detailValue}>[City, Country]</p>
                </div>
                <div className={styles.detailGroup}>
                  <span className={`label ${styles.detailLabel}`}>Available</span>
                  <p className={styles.detailValue}>Open to new work</p>
                </div>
              </div>
            </aside>
          </div>

          {/* Contact */}
          <footer className={styles.contact}>
            <span className={`label ${styles.contactLabel}`}>Get in touch</span>
            <a href="mailto:your@email.com" className={styles.email}>
              your@email.com
            </a>
          </footer>
        </div>
      </Container>
    </article>
  );
}
