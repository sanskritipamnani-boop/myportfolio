'use client';

import { useState } from 'react';
import FooterAnimation from './FooterAnimation';
import Container from './Container';
import styles from './Footer.module.css';

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const year = new Date().getFullYear();
  const email = 'sanskriti28052005@gmail.com';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
                href={`mailto:${email}`}
                className={styles.contactLink}
                aria-label="Send an email"
              >
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/sanskriti-pamnani-b2b12a217/"
                className={styles.contactLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile (opens in new tab)"
              >
                LinkedIn ↗
              </a>
              <a
                href="https://drive.google.com/file/d/1Q-QMa_miUBoO3LrVxOyMptMGHGh9_yl0/view?usp=sharing"
                className={styles.contactLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Resume (opens in new tab)"
              >
                Resume ↗
              </a>
            </div>

            <div className={styles.emailBox}>
              <span className={styles.emailText}>
                reach out to me at : <span className={styles.emailAddress}>{email}</span>
              </span>
              <button
                type="button"
                className={styles.copyButton}
                onClick={handleCopy}
                aria-label="Copy email address"
                title={copied ? 'Copied!' : 'Copy to clipboard'}
              >
                {copied ? (
                  <span className={styles.copiedState}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className={styles.copiedTooltip}>Copied!</span>
                  </span>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className={styles.meta}>
            <span className={styles.name}>Sanskriti Pamnani</span>
            <span className={styles.year}>© {year}</span>
          </div>
        </div>

        <div className={styles.animationContainer}>
          <FooterAnimation />
        </div>
      </Container>
    </footer>
  );
}
