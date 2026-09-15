import Container from '@/components/layout/Container';
import Media from '@/components/shared/Media';
import { playgroundItems } from '@/data/projects';
import styles from './Playground.module.css';

export default function Playground() {
  return (
    <section className={styles.section} id="playground" aria-labelledby="playground-heading">
      <Container>
        <header className={styles.header}>
          <h2 id="playground-heading" className={`label ${styles.sectionLabel}`}>
            Playground
          </h2>
          <p className={styles.intro}>
            Experiments, explorations, and things made for the joy of making.
          </p>
        </header>

        <div className={styles.grid}>
          {playgroundItems.map((item, i) => (
            <article
              key={item.id}
              className={`${styles.item} ${styles[`item${i + 1}`]}`}
            >
              {item.link ? (
                <a
                  href={item.link}
                  className={styles.itemLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.title} (opens in new tab)`}
                >
                  <PlaygroundCard item={item} />
                </a>
              ) : (
                <div className={styles.itemLink}>
                  <PlaygroundCard item={item} />
                </div>
              )}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function PlaygroundCard({ item }: { item: (typeof playgroundItems)[0] }) {
  return (
    <>
      <div className={styles.cardMedia}>
        <Media {...item.media} />
      </div>
      <footer className={styles.cardMeta}>
        <span className={`label ${styles.category}`}>{item.category}</span>
        <h3 className={styles.title}>{item.title}</h3>
        {item.description && (
          <p className={styles.description}>{item.description}</p>
        )}
      </footer>
    </>
  );
}
