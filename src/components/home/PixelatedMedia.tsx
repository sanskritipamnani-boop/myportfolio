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
  const [isFullySharp, setIsFullySharp] = useState(false);
  const [inView, setInView] = useState(false);

  const paddingTop = aspectRatio === 'full' ? undefined : ASPECT_RATIO_MAP[aspectRatio] || '56.25%';
  const isFull = aspectRatio === 'full';

  // Load the image source in a background HTML Image preloader
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
      // Draw initial blocky state immediately
      drawFrameTime(0);
    };
  }, [src]);

  // Setup intersection observer to only trigger when user has scrolled the card in view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { 
        // Trigger only when at least 45% of the project card is visible.
        // This ensures the animation doesn't start while the image is still hidden below the fold.
        threshold: 0.45 
      }
    );
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  // Time-based progressive pixelation drawing logic
  const drawFrameTime = (timeProgress: number) => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sync canvas internal width/height to responsive display dimensions
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }

    const w = canvas.width;
    const h = canvas.height;

    // Calculate source cropping coordinates (object-fit: cover simulation)
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

    // Map the normalized time progress (0.0 to 1.0) to pixel block sizes (45px to 1px)
    let pixelSize = 1;
    if (timeProgress <= 0) {
      pixelSize = 45;
      setIsFullySharp(false);
    } else if (timeProgress >= 1) {
      pixelSize = 1;
      setIsFullySharp(true);
    } else {
      setIsFullySharp(false);
      // Quadratic ease-out for a smooth transition that speeds up pixel dissolution near the end
      const easeOutQuad = timeProgress * (2 - timeProgress);
      pixelSize = Math.max(1, Math.round(45 - easeOutQuad * 44));
    }

    // Draw final high-resolution sharp frame
    if (pixelSize === 1) {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      return;
    }

    // Downscale math
    const scaledW = Math.max(1, Math.floor(w / pixelSize));
    const scaledH = Math.max(1, Math.floor(h / pixelSize));

    // Clear main canvas
    ctx.clearRect(0, 0, w, h);

    // Disable antialiasing for blocky nearest-neighbor pixel rendering
    ctx.imageSmoothingEnabled = false;
    // @ts-ignore
    ctx.mozImageSmoothingEnabled = false;
    // @ts-ignore
    ctx.webkitImageSmoothingEnabled = false;

    // Use offscreen canvas to scale and sample pixel blocks
    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
    }
    const offscreen = offscreenCanvasRef.current;
    offscreen.width = scaledW;
    offscreen.height = scaledH;
    const oCtx = offscreen.getContext('2d');
    
    if (oCtx) {
      oCtx.drawImage(img, sx, sy, sw, sh, 0, 0, scaledW, scaledH);
      ctx.drawImage(offscreen, 0, 0, scaledW, scaledH, 0, 0, w, h);
    }
  };

  // Run the time-based progressive sharpening loop once the element is landed on
  useEffect(() => {
    if (!inView || !imageLoaded) {
      // If the project scrolls out of view, reset states so it pixelates again on next entry
      if (!inView) {
        setIsFullySharp(false);
        drawFrameTime(0);
      }
      return;
    }

    const startTime = Date.now();
    let rAFId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      const delay = 1000;          // 1 second stay-pixelated delay after landing
      const transitionTime = 1800; // 1.8 seconds progressive unpixelation time
      const totalDuration = delay + transitionTime; // 2.8 seconds total

      if (elapsed < delay) {
        // Still in the delay phase: keep fully pixelated
        drawFrameTime(0);
        rAFId = requestAnimationFrame(animate);
      } else if (elapsed >= totalDuration) {
        // Complete phase: show fully sharp high-res image
        drawFrameTime(1);
        setIsFullySharp(true);
      } else {
        // Easing transition phase
        const t = (elapsed - delay) / transitionTime;
        drawFrameTime(t);
        rAFId = requestAnimationFrame(animate);
      }
    };

    rAFId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rAFId);
    };
  }, [inView, imageLoaded]);

  return (
    <div
      ref={containerRef}
      className={`${styles.wrapper} ${isFull ? styles.full : ''} ${className}`}
      style={paddingTop ? { paddingTop } : undefined}
    >
      {/* HTML5 Canvas that renders the real-time pixelation transition */}
      <canvas 
        ref={canvasRef} 
        className={`${styles.canvas} ${isFullySharp ? styles.canvasFadeOut : ''}`}
      />

      {/* Actual image displayed once the pixelation completes for native subpixel text rendering */}
      {imageLoaded && (
        <img
          src={src}
          alt={alt}
          className={`${styles.img} ${isFullySharp ? styles.imgVisible : ''}`}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
    </div>
  );
}
