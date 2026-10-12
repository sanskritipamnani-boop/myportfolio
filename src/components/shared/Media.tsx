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
  objectPosition?: string;
  transform?: string;
  transformOrigin?: string;
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
  autoplay = true,
  muted = true,
  loop = true,
  playsInline = true,
  controls = false,
  sizes = '100vw',
  objectPosition,
  transform,
  transformOrigin,
}: MediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null);

  const isLottie = type === 'lottie' || (typeof src === 'string' && src.endsWith('.json'));

  const mediaTransform = transform || (src.includes('planefold') ? 'none' : undefined);
  const mediaObjectPosition = objectPosition || (src.includes('planefold') ? 'center 75%' : undefined);
  const mediaTransformOrigin = transformOrigin || undefined;
  const videoObjectFit = 'cover';

  // Pause video when out of viewport (performance & scroll-triggered play)
  useEffect(() => {
    if (type !== 'video' || !videoRef.current || !autoplay) return;
    const el = videoRef.current;
    
    // Explicitly pause video until scrolled into viewport
    el.pause();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [type, autoplay]);

  // Lottie animation handling
  useEffect(() => {
    if (!isLottie || !lottieContainerRef.current) return;
    let anim: import('lottie-web').AnimationItem | null = null;
    let isCancelled = false;

    import('lottie-web').then((lottieModule) => {
      if (isCancelled || !lottieContainerRef.current) return;
      const lottie = lottieModule.default || lottieModule;
      anim = lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: 'svg',
        loop: loop,
        autoplay: autoplay,
        path: src,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      });
    });

    return () => {
      isCancelled = true;
      if (anim) {
        anim.destroy();
      }
    };
  }, [isLottie, src, loop, autoplay]);

  const paddingTop = aspectRatio === 'full' ? undefined : ASPECT_RATIO_MAP[aspectRatio] || '56.25%';
  const isFull = aspectRatio === 'full';

  return (
    <div
      className={`${styles.wrapper} ${isFull ? styles.full : ''} ${className}`}
      style={paddingTop ? { paddingTop } : undefined}
    >
      {isLottie ? (
        <div
          ref={lottieContainerRef}
          aria-label={alt}
          role="img"
          className={styles.media}
          style={{
            transform: mediaTransform || undefined,
            transformOrigin: mediaTransformOrigin || undefined,
            overflow: 'hidden',
          }}
        />
      ) : type === 'image' ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={styles.media}
          style={{
            objectPosition: mediaObjectPosition || 'center center',
            transform: mediaTransform || undefined,
            transformOrigin: mediaTransformOrigin || undefined,
          }}
        />
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          controls={controls}
          className={styles.media}
          style={{
            objectFit: videoObjectFit,
            objectPosition: mediaObjectPosition || 'center center',
            transform: mediaTransform || 'none',
            transformOrigin: mediaTransformOrigin || undefined,
          }}
          preload={autoplay ? 'auto' : 'none'}
        />
      )}
    </div>
  );
}
