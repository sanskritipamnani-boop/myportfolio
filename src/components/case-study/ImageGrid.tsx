import Media from '@/components/shared/Media';
import type { MediaType } from '@/data/projects';
import styles from './ImageGrid.module.css';

type ImageGridProps = {
  images: MediaType[];
};

export default function ImageGrid({ images }: ImageGridProps) {
  return (
    <div className={styles.grid}>
      {images.map((image, i) => (
        <div key={i} className={styles.item} style={{ gridColumn: `span ${i === 0 ? 2 : 1}` }}>
          <Media {...image} sizes="(max-width: 768px) 90vw, 60vw" />
        </div>
      ))}
    </div>
  );
}
