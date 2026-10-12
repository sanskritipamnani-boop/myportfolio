'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './PixelatedMedia.module.css';

type PixelatedMediaProps = {
  src: string;
  alt?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '4/5' | 'full';
  className?: string;
  priority?: boolean;
};

const ASPECT_RATIO_MAP: Record<string, string> = {
  '16/9': '56.25%',
  '4/3': '75%',
  '1/1': '100%',
  '4/5': '125%',
  'full': '0',
};

export default function PixelatedMedia({
  src,
  alt = '',
  aspectRatio = '16/9',
  className = '',
  priority = false,
}: PixelatedMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const paddingTop = aspectRatio === 'full' ? undefined : ASPECT_RATIO_MAP[aspectRatio] || '56.25%';
  const isFull = aspectRatio === 'full';

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
  }, [src]);

  const renderFrame = (pixelSize: number) => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const displayW = canvas.clientWidth || 600;
    const displayH = canvas.clientHeight || 338;
    const w = displayW * dpr;
    const h = displayH * dpr;

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

    ctx.imageSmoothingEnabled = false;
    // @ts-ignore
    ctx.mozImageSmoothingEnabled = false;
    // @ts-ignore
    ctx.webkitImageSmoothingEnabled = false;

    if (pixelSize <= 1) {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      return;
    }

    const scaledW = Math.max(1, Math.floor(w / pixelSize));
    const scaledH = Math.max(1, Math.floor(h / pixelSize));

    ctx.clearRect(0, 0, w, h);

    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
    }
    const offscreen = offscreenCanvasRef.current;
    offscreen.width = scaledW;
    offscreen.height = scaledH;
    const oCtx = offscreen.getContext('2d');

    if (oCtx) {
      oCtx.imageSmoothingEnabled = false;
      // @ts-ignore
      oCtx.mozImageSmoothingEnabled = false;
      // @ts-ignore
      oCtx.webkitImageSmoothingEnabled = false;

      oCtx.drawImage(img, sx, sy, sw, sh, 0, 0, scaledW, scaledH);
      ctx.drawImage(offscreen, 0, 0, scaledW, scaledH, 0, 0, w, h);
    }
  };

  const currentPixelSizeRef = useRef(1);
  const rAFRef = useRef<number | null>(null);

  useEffect(() => {
    if (!imageLoaded) return;

    const dpr = window.devicePixelRatio || 1;
    const containerW = containerRef.current?.clientWidth || 600;
    const maxPixelSize = (containerW < 640 ? 28 : 36) * dpr;
    const targetPixelSize = isHovered ? maxPixelSize : 1;

    const startTime = performance.now();
    const startPixelSize = currentPixelSizeRef.current;
    const duration = 280;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = progress * (2 - progress);

      const current = startPixelSize + (targetPixelSize - startPixelSize) * ease;
      currentPixelSizeRef.current = current;

      renderFrame(current);

      if (progress < 1) {
        rAFRef.current = requestAnimationFrame(animate);
      }
    };

    if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    rAFRef.current = requestAnimationFrame(animate);

    return () => {
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
  }, [isHovered, imageLoaded]);

  return (
    <div
      ref={containerRef}
      className={`${styles.wrapper} ${isFull ? styles.full : ''} ${className}`}
      style={paddingTop ? { paddingTop } : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        className={`${styles.canvas} ${!isHovered && currentPixelSizeRef.current <= 1.05 ? styles.canvasFadeOut : ''}`}
      />

      {imageLoaded && (
        <img
          src={src}
          alt={alt}
          className={`${styles.img} ${styles.imgVisible}`}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
    </div>
  );
}
