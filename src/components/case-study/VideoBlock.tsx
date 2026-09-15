import Media from '@/components/shared/Media';
import type { MediaType } from '@/data/projects';
import styles from './VideoBlock.module.css';

type VideoBlockProps = {
  media: MediaType;
  caption?: string;
};

export default function VideoBlock({ media, caption }: VideoBlockProps) {
  return (
    <figure className={styles.figure}>
      <div className={styles.videoWrapper}>
        <Media
          {...media}
          type="video"
          autoplay
          muted
          loop
          playsInline
          controls={false}
          sizes="90vw"
        />
      </div>
      {caption && (
        <figcaption className={styles.caption}>{caption}</figcaption>
      )}
    </figure>
  );
}
