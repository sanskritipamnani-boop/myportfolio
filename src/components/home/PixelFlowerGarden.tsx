'use client';

import { useState, useEffect, useRef } from 'react';
import './PixelFlowerGarden.css';

type Flower = {
  id: string;
  x: number;
  y: number;
  height: number;
  variant: number;
  rotation: number;
};

export default function PixelFlowerGarden() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  // Monitor screen size to check for mobile breakpoint
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hook into the parent hero section container to capture pointer events
  useEffect(() => {
    const parent = containerRef.current?.parentNode as HTMLElement;
    if (!parent) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Ignore clicks on links, buttons, inputs, toggles, beaver, navigation, or title banner elements
      if (
        target.closest('a, button, input, textarea, select, [data-no-flower]') ||
        target.closest('[class*="beaver"]') ||
        target.closest('[class*="logo"]') ||
        target.closest('[class*="nav"]') ||
        target.closest('[class*="infoWidget"]') ||
        target.closest('[class*="heroSvg"]') ||
        target.closest('[class*="typewriterHeading"]')
      ) {
        return;
      }

      // Calculate coordinates relative to the parent hero section container
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Slightly vary height: random between 35px and 70px
      const minHeight = 35;
      const maxHeight = 70;
      const height = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

      // Choose random variant (0 to 4)
      const variant = Math.floor(Math.random() * 5);

      // Slightly vary rotation: random between -12deg and 12deg
      const rotation = Math.floor(Math.random() * 25) - 12;

      const newFlower: Flower = {
        id: `flower-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x,
        y,
        height,
        variant,
        rotation,
      };

      setFlowers((prev) => {
        const next = [...prev, newFlower];
        const maxLimit = isMobile ? 10 : 25; // Reduce flower node limit on mobile for performance safety
        if (next.length > maxLimit) {
          return next.slice(next.length - maxLimit); // Remove oldest flower (first item)
        }
        return next;
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isMobile) return;

      const target = e.target as HTMLElement;
      if (!target) {
        setShowTooltip(false);
        return;
      }

      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const isInteractive = target.closest('a, button, input, textarea, select, [data-no-flower]') ||
        target.closest('[class*="beaver"]') ||
        target.closest('[class*="logo"]') ||
        target.closest('[class*="nav"]') ||
        target.closest('[class*="infoWidget"]');

      const inZone = y >= rect.height * 0.5 && y <= rect.height;

      if (inZone && !isInteractive) {
        setMousePos({ x, y });
        setShowTooltip(true);
      } else {
        setShowTooltip(false);
      }
    };

    const handlePointerLeave = () => {
      setShowTooltip(false);
    };

    parent.addEventListener('pointerdown', handlePointerDown);
    parent.addEventListener('pointermove', handlePointerMove);
    parent.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      parent.removeEventListener('pointerdown', handlePointerDown);
      parent.removeEventListener('pointermove', handlePointerMove);
      parent.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [isMobile]);

  return (
    <div 
      ref={containerRef} 
      className="pixel-flower-garden" 
      aria-hidden="true"
    >
      {showTooltip && !isMobile && (
        <div 
          className="pixel-flower-tooltip"
          style={{ 
            left: `${mousePos.x}px`, 
            top: `${mousePos.y}px` 
          }}
        >
          add flower
        </div>
      )}

      {flowers.map((flower) => (
        <div
          key={flower.id}
          className="pixel-flower"
          style={{
            left: `${flower.x}px`,
            top: `${flower.y}px`,
            height: `${flower.height}px`,
            transform: `translate(-50%, -100%) rotate(${flower.rotation}deg)`,
          }}
        >
          {/* Stem growing animation */}
          <div className="pixel-flower-stem">
            {/* Symmetrical pixel leaves */}
            <div className="pixel-flower-leaf-left" />
            <div className="pixel-flower-leaf-right" />
          </div>

          {/* Symmetrical pixelated head clusters */}
          <div className={`pixel-flower-head pixel-flower-head-v${flower.variant}`} />
        </div>
      ))}
    </div>
  );
}
