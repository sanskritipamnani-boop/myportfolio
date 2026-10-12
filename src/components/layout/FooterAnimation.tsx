'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './FooterAnimation.module.css';

const MESSAGE = "Hi, what are you waiting for? Let's talk and get on to building together!!";
const STANDING_FRAME = '/footer-animation/girl standing.png';
const WALK_SHEET = '/footer-animation/walk sheet.png';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function FooterAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sittingRef = useRef<HTMLImageElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);
  const walkImgRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const [scale, setScale] = useState(0.85);
  const isRunningRef = useRef(false);
  const hasTriggeredOnScrollRef = useRef(false);

  // Responsive scale to fit screen prominently (0.85 base dimensions)
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      const calculatedScale = Math.min(0.85, Math.max(0.32, ((width - 24) / 736) * 0.85));
      setScale(calculatedScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const typeText = useCallback(async (str: string, speed = 40) => {
    if (!textRef.current) return;
    textRef.current.textContent = '';
    for (const ch of str) {
      if (!isRunningRef.current) break;
      if (textRef.current) {
        textRef.current.textContent += ch;
      }
      await sleep(speed);
    }
  }, []);

  const resetState = useCallback(() => {
    if (sittingRef.current) {
      sittingRef.current.style.opacity = '1';
      sittingRef.current.style.transform = 'translateY(0)';
    }
    if (walkerRef.current) {
      walkerRef.current.getAnimations().forEach((a) => a.cancel());
      walkerRef.current.style.opacity = '0';
      walkerRef.current.style.left = '160px';
      walkerRef.current.style.top = '215px';
      walkerRef.current.style.width = '480px';
      walkerRef.current.style.height = '488px';
    }
    if (walkImgRef.current) {
      walkImgRef.current.classList.remove(styles.walking);
      walkImgRef.current.style.animation = '';
      walkImgRef.current.style.width = '480px';
      walkImgRef.current.style.height = '488px';
      walkImgRef.current.style.backgroundImage = `url('${WALK_SHEET}')`;
      walkImgRef.current.style.backgroundPosition = '0px 0px';
      walkImgRef.current.style.backgroundSize = '1920px 488px';
      walkImgRef.current.style.backgroundRepeat = 'no-repeat';
    }
    if (bubbleRef.current) {
      bubbleRef.current.getAnimations().forEach((a) => a.cancel());
      bubbleRef.current.style.opacity = '0';
      bubbleRef.current.style.transform = 'scale(0.6)';
    }
    if (textRef.current) {
      textRef.current.textContent = '';
    }
  }, []);

  const runAnimation = useCallback(async () => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    resetState();

    const sittingEl = sittingRef.current;
    const walkerEl = walkerRef.current;
    const walkImgEl = walkImgRef.current;
    const bubbleEl = bubbleRef.current;

    if (!sittingEl || !walkerEl || !walkImgEl || !bubbleEl) {
      isRunningRef.current = false;
      return;
    }

    try {
      // 1. Sitting gentle idle bob
      await sleep(600);
      if (!isRunningRef.current) return;

      const bobAnim = sittingEl.animate(
        [
          { transform: 'translateY(0)' },
          { transform: 'translateY(-4px)' },
          { transform: 'translateY(0)' },
        ],
        { duration: 400, easing: 'ease-in-out' }
      );
      await bobAnim.finished;
      if (!isRunningRef.current) return;

      // 2. Stand up: transition to walk frame
      sittingEl.style.opacity = '0';
      walkerEl.style.opacity = '1';
      walkImgEl.classList.add(styles.walking);
      await sleep(200);
      if (!isRunningRef.current) return;

      // 3. Walk to the right side
      const walkAnim = walkerEl.animate(
        [{ left: '160px' }, { left: '340px' }],
        { duration: 2400, easing: 'linear', fill: 'forwards' }
      );
      await walkAnim.finished;
      if (!isRunningRef.current) return;

      // 4. Turn to face viewer with standing frame
      walkerEl.getAnimations().forEach((a) => a.cancel());
      walkerEl.style.left = '333px';
      walkerEl.style.top = '231px';
      walkerEl.style.width = '476px';
      walkerEl.style.height = '476px';
      walkImgEl.classList.remove(styles.walking);
      walkImgEl.style.animation = 'none';
      walkImgEl.style.width = '100%';
      walkImgEl.style.height = '100%';
      walkImgEl.style.backgroundImage = `url('${STANDING_FRAME}')`;
      walkImgEl.style.backgroundPosition = 'center';
      walkImgEl.style.backgroundSize = 'contain';
      walkImgEl.style.backgroundRepeat = 'no-repeat';

      await sleep(400);
      if (!isRunningRef.current) return;

      // 5. Pop in speech bubble & type text
      const bubbleAnim = bubbleEl.animate(
        [
          { opacity: '0', transform: 'scale(0.6)' },
          { opacity: '1', transform: 'scale(1)' },
        ],
        { duration: 220, fill: 'forwards', easing: 'ease-out' }
      );
      await bubbleAnim.finished;
      bubbleEl.style.opacity = '1';
      bubbleEl.style.transform = 'scale(1)';

      await typeText(MESSAGE, 42);
    } catch {
      // Ignored if cancelled
    } finally {
      isRunningRef.current = false;
    }
  }, [resetState, typeText]);

  // Trigger when scrolled into view
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggeredOnScrollRef.current) {
          hasTriggeredOnScrollRef.current = true;
          runAnimation();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [runAnimation]);

  const handleClick = () => {
    isRunningRef.current = false;
    setTimeout(() => {
      runAnimation();
    }, 50);
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <div
        className={styles.stageWrapper}
        style={{
          width: `${736 * scale}px`,
          height: `${680 * scale}px`,
        }}
      >
        <div
          ref={stageRef}
          id="stage"
          className={styles.stage}
          onClick={handleClick}
          style={{
            transform: `scale(${scale})`,
          }}
          title="Click to replay animation"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick();
            }
          }}
        >
          {/* Layer 1: Desk */}
          <img
            id="table"
            className={`${styles.table} ${styles.pixel}`}
            src="/footer-animation/study table without chair.png"
            alt="Study table"
            draggable={false}
          />

          {/* Layer 2: Sitting pose */}
          <img
            ref={sittingRef}
            id="sitting"
            className={`${styles.sitting} ${styles.pixel}`}
            src="/footer-animation/girl sitting.png"
            alt="Girl sitting"
            draggable={false}
          />

          {/* Layer 2b: Chair */}
          <img
            id="chair"
            className={`${styles.chair} ${styles.pixel}`}
            src="/footer-animation/only chair.png"
            alt="Chair"
            draggable={false}
          />

          {/* Layer 3: Walker & speech bubble */}
          <div ref={walkerRef} id="walker" className={styles.walker}>
            <div
              ref={walkImgRef}
              id="walkimg"
              className={`${styles.walkImg} ${styles.pixel}`}
              role="img"
              aria-label="Girl walking"
            />
            <div ref={bubbleRef} id="bubble" className={styles.bubble}>
              <span ref={textRef} id="text" />
              <span id="cursor" className={styles.cursor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
