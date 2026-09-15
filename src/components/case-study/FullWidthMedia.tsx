import Media from '@/components/shared/Media';
import type { MediaType } from '@/data/projects';
import styles from './FullWidthMedia.module.css';

type FullWidthMediaProps = {
  media: MediaType;
  caption?: string;
};

export default function FullWidthMedia({ media, caption }: FullWidthMediaProps) {
  return (
    <figure className={styles.figure}>
      <Media {...media} sizes="90vw" />
      {caption && (
        <figcaption className={styles.caption}>{caption}</figcaption>
      )}
    </figure>
  );
}
