import type { Metadata } from 'next';
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
            <div className={styles.contentRow}>
              <div className={styles.text}>
                <p>
                  Hello!<br />
                  My <span className={styles.popTrigger}><mark className={`${styles.highlight} ${styles.highlightPink} ${styles.delay0}`}>name is Sanskriti.</mark><span className={styles.popIconWrapper}><img src="/images/icons/sanskriti.svg" alt="Sanskriti" className={`${styles.popIcon} ${styles.sanskritiPopIcon}`} /></span></span> I’m currently studying <span className={styles.popTrigger}><mark className={`${styles.highlight} ${styles.highlightYellow} ${styles.delay1}`}>Product Experience Design</mark><span className={styles.popIconWrapper}><img src="/images/icons/computer.svg" alt="Computer" className={styles.popIcon} style={{ height: '38px' }} /></span></span> at NIFT, Gandhinagar. I work <span className={styles.popTrigger}><mark className={`${styles.highlight} ${styles.highlightGreen} ${styles.delay2}`}>across research, product and UX thinking, visual design, and prototyping</mark><span className={styles.popIconWrapperRight}><img src="/images/icons/folder.svg" alt="Folder" className={styles.popIcon} style={{ height: '38px' }} /></span></span>, and I also enjoy experimenting with code and AI as tools <span className={styles.popTrigger}><mark className={`${styles.highlight} ${styles.highlightPeach} ${styles.delay3}`}>to explore ideas and bring them to life.</mark><span className={styles.popIconWrapper}><img src="/images/icons/engage.svg" alt="Engage" className={styles.popIcon} style={{ height: '36px' }} /></span></span> In my last internship, I gained experience in product strategy, visual &amp; art direction, and website design.
                </p>
                <p>
                  I’m drawn to work that explores how physical and digital experiences come together <span className={styles.popTrigger}><mark className={`${styles.highlight} ${styles.highlightGreen} ${styles.delay4}`}>through interaction, understanding, and technology.</mark><span className={styles.popIconWrapper}><img src="/images/icons/interaction.svg" alt="Interaction" className={styles.popIcon} style={{ height: '38px' }} /></span></span> I’ve always been curious about the little things people do, the choices they make, and the problems they work around. Design gives me a way to turn that curiosity into something tangible, whether it’s a digital product, a physical object, or an experience.
                </p>
                <p>
                  I’m now looking for opportunities where I can learn from real-world projects, contribute to a design team, and continue developing my approach as a product designer.
                </p>
                <p>
                  Other than that, I like making toys, playing games, reading, and travelling!
                </p>
              </div>

              <div className={styles.sideGraphicWrapper}>
                <img
                  src="/images/meee.svg"
                  alt="Sanskriti illustration"
                  className={styles.sideGraphic}
                />
              </div>
            </div>
          </div>

        </div>
      </Container>
    </article>
  );
}
