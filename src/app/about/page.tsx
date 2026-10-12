import type { Metadata } from 'next';
import Image from 'next/image';
import Container from '@/components/layout/Container';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'About | Sanskriti Pamnani',
  description: 'About Sanskriti Pamnani — Product Experience Designer studying at NIFT Gandhinagar.',
};

export default function AboutPage() {
  return (
    <article className={styles.page} aria-labelledby="about-heading">
      <Container>
        <div className={styles.inner}>
          <header className={styles.header}>
            <h1 id="about-heading" className={`label ${styles.eyebrow}`}>About</h1>
          </header>

          <div className={styles.body}>
            <div className={styles.text}>
              <p>
                Hello! My name is Sanskriti, and I’m currently studying Product Experience Design at NIFT, Gandhinagar. I work <mark className={styles.highlight}>across research, product and UX thinking, visual design, and prototyping</mark>, and I also enjoy <mark className={styles.highlight}>experimenting with code and AI</mark> as tools to explore ideas and bring them to life. In my last internship, I gained experience in <mark className={styles.highlight}>product strategy, visual &amp; art direction, and website design.</mark>
              </p>
              <p>
                I’m drawn to work that explores how physical and digital experiences come together <mark className={styles.highlight}>through interaction, understanding, and technology.</mark> I’ve always been curious about the little things people do, the choices they make, and the problems they work around. Design gives me a way to turn that curiosity into something tangible, whether it’s a digital product, a physical object, or an experience.
              </p>
              <p>
                I’m now looking for opportunities where I can learn from real-world projects, contribute to a design team, and continue developing my approach as a product designer.
              </p>
              <p>
                Other than that, I like making toys, playing games, reading, and travelling!
              </p>
            </div>

            <aside className={styles.sidebar}>
              {/* Portrait */}
              <div className={styles.portrait}>
                <Image
                  src="/images/passport.png"
                  alt="Sanskriti Pamnani"
                  width={380}
                  height={380}
                  className={styles.portraitImg}
                  priority
                />
              </div>
            </aside>
          </div>

          {/* Contact */}
          <footer className={styles.contact}>
            <span className={`label ${styles.contactLabel}`}>Get in touch</span>
            <a href="mailto:sanskriti28052005@gmail.com" className={styles.email}>
              sanskriti28052005@gmail.com
            </a>
          </footer>
        </div>
      </Container>
    </article>
  );
}
