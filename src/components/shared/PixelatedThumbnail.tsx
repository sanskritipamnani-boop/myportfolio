'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './PixelatedThumbnail.module.css';

type PixelatedThumbnailProps = {
  src: string;
  alt?: string;
  priority?: boolean;
  className?: string;
  objectPosition?: string;
  transform?: string;
};

function parseObjectPosition(pos?: string): { xPercent: number; yPercent: number } {
  if (!pos) return { xPercent: 50, yPercent: 50 };
  const parts = pos.trim().split(/\s+/);
  let x = 50;
  let y = 50;
  if (parts.length >= 1) {
    if (parts[0] === 'left') x = 0;
    else if (parts[0] === 'center') x = 50;
    else if (parts[0] === 'right') x = 100;
    else if (parts[0].endsWith('%')) {
      const parsed = parseFloat(parts[0]);
      if (!isNaN(parsed)) x = parsed;
    }
  }
  if (parts.length >= 2) {
    if (parts[1] === 'top') y = 0;
    else if (parts[1] === 'center') y = 50;
    else if (parts[1] === 'bottom') y = 100;
    else if (parts[1].endsWith('%')) {
      const parsed = parseFloat(parts[1]);
      if (!isNaN(parsed)) y = parsed;
    }
  }
  return { xPercent: x, yPercent: y };
}

function VideoThumbnail({
  src,
  className,
  objectPosition,
  transform,
  objectFit = 'cover',
}: {
  src: string;
  className: string;
  objectPosition?: string;
  transform?: string;
  objectFit?: 'cover' | 'contain';
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`${styles.container} ${className}`}>
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        preload="auto"
        className={styles.media}
        style={{
          objectFit: objectFit,
          objectPosition: objectPosition || 'center center',
          transform: transform || 'none',
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}

export default function PixelatedThumbnail({
  src,
  alt = '',
  priority = false,
  className = '',
  objectPosition,
  transform,
}: PixelatedThumbnailProps) {
  const isVideo = src.endsWith('.mp4') || src.endsWith('.webm');

  const effectiveObjectPosition = objectPosition || 'center center';

  if (isVideo) {
    return (
      <VideoThumbnail
        src={src}
        className={className}
        objectPosition={effectiveObjectPosition}
        transform={transform || 'none'}
        objectFit="cover"
      />
    );
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentPixelSizeRef = useRef(1);
  const rAFRef = useRef<number | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      imageRef.current = img;
      setIsLoaded(true);
    };
    if (img.complete) {
      imageRef.current = img;
      setIsLoaded(true);
    }
  }, [src]);

  // Render pixelated canvas frame
  const renderFrame = (pixelSize: number) => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const displayW = Math.max(1, Math.floor(rect.width || 600));
    const displayH = Math.max(1, Math.floor(rect.height || 338));

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

    const { xPercent, yPercent } = parseObjectPosition(effectiveObjectPosition);

    if (imgRatio > canvasRatio) {
      sw = imgH * canvasRatio;
      sx = (imgW - sw) * (xPercent / 100);
    } else {
      sh = imgW / canvasRatio;
      sy = (imgH - sh) * (yPercent / 100);
    }

    ctx.clearRect(0, 0, w, h);

    if (pixelSize <= 1) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      return;
    }

    const scaledW = Math.max(1, Math.floor(w / pixelSize));
    const scaledH = Math.max(1, Math.floor(h / pixelSize));

    if (!offscreenRef.current) {
      offscreenRef.current = document.createElement('canvas');
    }
    const offscreen = offscreenRef.current;
    offscreen.width = scaledW;
    offscreen.height = scaledH;

    const oCtx = offscreen.getContext('2d');
    if (oCtx) {
      // Use smooth downsampling to avoid aliasing artifacts
      oCtx.imageSmoothingEnabled = true;
      oCtx.imageSmoothingQuality = 'high';
      oCtx.drawImage(img, sx, sy, sw, sh, 0, 0, scaledW, scaledH);

      // Upscale without smoothing for clean, crisp retro pixel squares
      ctx.imageSmoothingEnabled = false;
      // @ts-ignore
      ctx.mozImageSmoothingEnabled = false;
      // @ts-ignore
      ctx.webkitImageSmoothingEnabled = false;
      ctx.drawImage(offscreen, 0, 0, scaledW, scaledH, 0, 0, w, h);
    }
  };

  // Hover animation loop: transitions between sharp and pixelated effect
  useEffect(() => {
    if (!isLoaded) return;

    const dpr = window.devicePixelRatio || 1;
    const containerW = containerRef.current?.clientWidth || 600;
    const maxPixelSize = (containerW < 640 ? 24 : 32) * dpr;
    const targetPixelSize = isHovered ? maxPixelSize : 1;

    setIsAnimating(true);

    const startTime = performance.now();
    const startPixelSize = currentPixelSizeRef.current;
    const duration = 240;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = progress * (2 - progress);

      const current = startPixelSize + (targetPixelSize - startPixelSize) * ease;
      currentPixelSizeRef.current = current;

      renderFrame(current);

      if (progress < 1) {
        rAFRef.current = requestAnimationFrame(animate);
      } else {
        if (!isHovered) {
          setIsAnimating(false);
        }
      }
    };

    if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    rAFRef.current = requestAnimationFrame(animate);

    return () => {
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
  }, [isHovered, isLoaded]);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      {/* High-fidelity native image rendered at crystal-clear resolution */}
      <img
        ref={(el) => {
          if (el && el.complete && el.naturalWidth && !isLoaded) {
            imageRef.current = el;
            setIsLoaded(true);
          }
        }}
        src={src}
        alt={alt}
        className={styles.baseImage}
        style={{
          objectPosition: effectiveObjectPosition,
          transform: transform || 'none',
        }}
        loading={priority ? 'eager' : 'lazy'}
      />

      {/* Interactive pixelation canvas overlay on hover */}
      <canvas
        ref={canvasRef}
        className={`${styles.canvas} ${(isHovered || isAnimating) ? styles.canvasActive : ''}`}
      />
    </div>
  );
}
