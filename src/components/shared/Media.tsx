'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { MediaType } from '@/data/projects';
import styles from './Media.module.css';

type MediaProps = MediaType & {
  className?: string;
  priority?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  sizes?: string;
};

const ASPECT_RATIO_MAP: Record<string, string> = {
  '16/9': '56.25%',  // 9/16
  '4/3': '75%',      // 3/4
  '1/1': '100%',
  '4/5': '125%',     // 5/4
  'full': '0',       // no padding, stretch
};

export default function Media({
  type,
  src,
  alt = '',
  poster,
  aspectRatio = '16/9',
  className = '',
  priority = false,
  autoplay = false,
  muted = true,
  loop = false,
  playsInline = true,
  controls = false,
  sizes = '100vw',
}: MediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pause video when out of viewport (performance)
  useEffect(() => {
    if (type !== 'video' || !videoRef.current || !autoplay) return;
    const el = videoRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [type, autoplay]);

  const paddingTop = aspectRatio === 'full' ? undefined : ASPECT_RATIO_MAP[aspectRatio] || '56.25%';
  const isFull = aspectRatio === 'full';

  return (
    <div
      className={`${styles.wrapper} ${isFull ? styles.full : ''} ${className}`}
      style={paddingTop ? { paddingTop } : undefined}
    >
      {type === 'image' ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={styles.media}
        />
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoplay}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          controls={controls}
          className={styles.media}
          preload={autoplay ? 'auto' : 'none'}
        />
      )}
    </div>
  );
}
