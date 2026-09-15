import Media from '@/components/shared/Media';
import type { MediaType } from '@/data/projects';
import styles from './Gallery.module.css';

type GalleryProps = {
  images: MediaType[];
  columns?: 2 | 3 | 4;
};

export default function Gallery({ images, columns = 3 }: GalleryProps) {
  return (
    <div className={`${styles.gallery} ${styles[`cols${columns}`]}`}>
      {images.map((image, i) => (
        <div key={i} className={styles.item}>
          <Media {...image} sizes={`(max-width: 768px) 90vw, ${Math.round(90 / columns)}vw`} />
        </div>
      ))}
    </div>
  );
}
