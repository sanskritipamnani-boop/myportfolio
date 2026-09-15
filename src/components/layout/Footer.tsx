import Container from './Container';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <Container>
        <div className={styles.inner}>
          <div className={styles.cta}>
            <p className={styles.statement}>
              Open to new opportunities and interesting collaborations.
            </p>
            <div className={styles.contactLinks}>
              <a
                href="mailto:your@email.com"
                className={styles.contactLink}
                aria-label="Send an email"
              >
                Email
              </a>
              <a
                href="https://linkedin.com"
                className={styles.contactLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile (opens in new tab)"
              >
                LinkedIn ↗
              </a>
              <a
                href="#"
                className={styles.contactLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Resume (opens in new tab)"
              >
                Resume ↗
              </a>
            </div>
          </div>

          <div className={styles.meta}>
            <span className={styles.name}>Your Name</span>
            <span className={styles.year}>© {year}</span>
          </div>
        </div>
      </Container>

      {/* Group 17 SVG landscape footer graphic — placed at the very bottom, full wide spread horizontal */}
      <div className={styles.footerGraphicContainer}>
        <img
          src="/Group 17.svg"
          alt="Pixel landscape footer graphic"
          className={styles.footerGraphic}
        />
      </div>
    </footer>
  );
}
