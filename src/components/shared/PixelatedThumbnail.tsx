'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './PixelatedThumbnail.module.css';

type PixelatedThumbnailProps = {
  src: string;
  alt?: string;
  priority?: boolean;
  className?: string;
};

export default function PixelatedThumbnail({
  src,
  alt = '',
  priority = false,
  className = '',
}: PixelatedThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Preload image
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      imageRef.current = img;
      setIsLoaded(true);
    };
  }, [src]);

  // Canvas nearest-neighbor pixelation renderer
  const renderFrame = (progress: number) => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const w = Math.floor(rect.width || canvas.width || 600);
    const h = Math.floor(rect.height || canvas.height || 338);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;
    const imgRatio = imgW / imgH;
    const canvasRatio = w / h;

    let sx = 0;
    let sy = 0;
    let sw = imgW;
    let sh = imgH;

    if (imgRatio > canvasRatio) {
      sw = imgH * canvasRatio;
      sx = (imgW - sw) / 2;
    } else {
      sh = imgW / canvasRatio;
      sy = (imgH - sh) / 2;
    }

    // Codrops ImagePixelLoading stepped pixel sequence
    const startPixel = w < 768 ? 24 : 40;

    let pixelSize = 1;
    if (progress <= 0) {
      pixelSize = startPixel;
    } else if (progress >= 1) {
      pixelSize = 1;
    } else if (progress < 0.20) {
      pixelSize = startPixel;
    } else if (progress < 0.40) {
      pixelSize = Math.round(startPixel * 0.60);
    } else if (progress < 0.60) {
      pixelSize = Math.round(startPixel * 0.30);
    } else if (progress < 0.78) {
      pixelSize = Math.round(startPixel * 0.15);
    } else if (progress < 0.90) {
      pixelSize = 2;
    } else {
      pixelSize = 1;
    }

    if (pixelSize === 1) {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      return;
    }

    const scaledW = Math.max(1, Math.floor(w / pixelSize));
    const scaledH = Math.max(1, Math.floor(h / pixelSize));

    ctx.clearRect(0, 0, w, h);

    if (!offscreenRef.current) {
      offscreenRef.current = document.createElement('canvas');
    }
    const offscreen = offscreenRef.current;
    offscreen.width = scaledW;
    offscreen.height = scaledH;

    const oCtx = offscreen.getContext('2d');
    if (oCtx) {
      // Disable smoothing for sharp, unblurred nearest-neighbor 8-bit blocky pixels
      oCtx.imageSmoothingEnabled = false;
      // @ts-ignore
      oCtx.mozImageSmoothingEnabled = false;
      // @ts-ignore
      oCtx.webkitImageSmoothingEnabled = false;

      ctx.imageSmoothingEnabled = false;
      // @ts-ignore
      ctx.mozImageSmoothingEnabled = false;
      // @ts-ignore
      ctx.webkitImageSmoothingEnabled = false;

      // 1. Draw downscaled image into tiny offscreen buffer
      oCtx.drawImage(img, sx, sy, sw, sh, 0, 0, scaledW, scaledH);
      // 2. Upscale tiny buffer to canvas with zero smoothing for crisp square pixels
      ctx.drawImage(offscreen, 0, 0, scaledW, scaledH, 0, 0, w, h);
    }
  };

  // Render initial heavily pixelated state as soon as image is loaded
  useEffect(() => {
    if (isLoaded && !hasTriggered) {
      renderFrame(0);
    }
  }, [isLoaded, hasTriggered]);

  // Scroll trigger: IntersectionObserver triggers unpixelation animation as soon as card lands in viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isLoaded || hasTriggered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasTriggered(true);

            // Respect prefers-reduced-motion
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            if (mediaQuery.matches) {
              setIsDone(true);
              return;
            }

            const startTime = Date.now();
            const duration = 800; // Exact Codrops 800ms ImagePixelLoading duration
            let rAFId: number;

            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(1, elapsed / duration);

              renderFrame(progress);

              if (progress < 1) {
                rAFId = requestAnimationFrame(animate);
              } else {
                setIsDone(true);
              }
            };

            rAFId = requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [isLoaded, hasTriggered]);

  return (
    <div ref={containerRef} className={`${styles.container} ${className}`}>
      {/* Crisp Canvas Overlay that renders nearest-neighbor pixel unpixelation */}
      <canvas
        ref={canvasRef}
        className={`${styles.canvas} ${isDone ? styles.canvasDone : ''}`}
      />

      {/* Sharp native image underneath */}
      <img
        src={src}
        alt={alt}
        className={styles.media}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}
