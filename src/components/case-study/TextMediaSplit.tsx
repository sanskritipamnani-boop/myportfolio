import Media from '@/components/shared/Media';
import type { MediaType } from '@/data/projects';
import styles from './TextMediaSplit.module.css';

type TextMediaSplitProps = {
  heading?: string;
  body: string;
  media: MediaType;
  mediaPosition?: 'left' | 'right';
};

export default function TextMediaSplit({
  heading,
  body,
  media,
  mediaPosition = 'right',
}: TextMediaSplitProps) {
  return (
    <section className={`${styles.section} ${mediaPosition === 'left' ? styles.mediaLeft : ''}`}>
      <div className={styles.text}>
        {heading && <h2 className={styles.heading}>{heading}</h2>}
        <p className={styles.body}>{body}</p>
      </div>
      <div className={styles.media}>
        <Media {...media} sizes="(max-width: 768px) 90vw, 45vw" />
      </div>
    </section>
  );
}
