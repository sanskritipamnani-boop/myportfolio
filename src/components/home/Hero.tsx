'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { DM_Mono } from 'next/font/google';
import { useTheme } from '@/context/ThemeContext';
import PixelFlowerGarden from './PixelFlowerGarden';
import GrassVector from './GrassVector';
import HeroBannerSvg from './HeroBannerSvg';
import styles from './Hero.module.css';

const dmMono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
});

export default function Hero() {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // Typewriter effect state for "hello welcome to"
  const fullText = "hello welcome to";
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let index = 0;
    setTypedText("");
    const interval = setInterval(() => {
      if (index < fullText.length) {
        index++;
        setTypedText(fullText.slice(0, index));
      } else {
        clearInterval(interval);
      }
    }, 75); // 75ms per character for real-time typing

    return () => clearInterval(interval);
  }, []);

  // Mouse move tilt physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 1. FRONT LAYER: Typewriter Heading ("hello welcome to") — Amplified 3D float & rotation
  const textRotateX = useSpring(useTransform(mouseY, [-200, 200], [24, -24]), {
    stiffness: 220,
    damping: 20,
  });
  const textRotateY = useSpring(useTransform(mouseX, [-300, 300], [-26, 26]), {
    stiffness: 220,
    damping: 20,
  });
  const textTiltX = useSpring(useTransform(mouseX, [-300, 300], [-48, 48]), {
    stiffness: 200,
    damping: 20,
  });
  const textTiltY = useSpring(useTransform(mouseY, [-200, 200], [-35, 35]), {
    stiffness: 200,
    damping: 20,
  });

  // 2. MIDDLE LAYER: Group 16 SVG Banner Title — Amplified 3D rotation & tilt
  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [18, -18]), {
    stiffness: 200,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-20, 20]), {
    stiffness: 200,
    damping: 22,
  });
  const tiltX = useSpring(useTransform(mouseX, [-300, 300], [-28, 28]), {
    stiffness: 200,
    damping: 22,
  });
  const tiltY = useSpring(useTransform(mouseY, [-200, 200], [-20, 20]), {
    stiffness: 200,
    damping: 22,
  });

  // 3. BACK LAYER: Clouds SVG — Moves OPPOSITE to mouse for deep 3D camera depth
  const cloudRotateX = useSpring(useTransform(mouseY, [-200, 200], [-14, 14]), {
    stiffness: 150,
    damping: 24,
  });
  const cloudRotateY = useSpring(useTransform(mouseX, [-300, 300], [18, -18]), {
    stiffness: 150,
    damping: 24,
  });
  const cloudTiltX = useSpring(useTransform(mouseX, [-300, 300], [60, -60]), {
    stiffness: 140,
    damping: 23,
  });
  const cloudTiltY = useSpring(useTransform(mouseY, [-200, 200], [40, -40]), {
    stiffness: 140,
    damping: 23,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Scroll tracking for parallax zoom out
  const { scrollY } = useScroll();
  
  // Smooth scroll scale for main banner
  const baseScale = useTransform(scrollY, [0, 500], [1.0, 0.92]);
  const springScale = useSpring(baseScale, { stiffness: 180, damping: 24, mass: 0.5 });
  const finalScale = useTransform(springScale, (s) => (isHovered ? s + 0.04 : s));

  const cloudBaseScale = useTransform(scrollY, [0, 500], [1.0, 0.88]);
  const cloudSpring = useSpring(cloudBaseScale, { stiffness: 140, damping: 22, mass: 0.6 });
  const cloudScale = useTransform(cloudSpring, (s) => (isHovered ? s + 0.04 : s));

  // Hide fixed hero when scrolled down past viewport fold so background grass never bleeds through
  const heroVisibility = useTransform(scrollY, [0, 600, 750], ['visible', 'visible', 'hidden']);
  const heroOpacity = useTransform(scrollY, [0, 600, 750], [1, 1, 0]);

  // Scroll arrow opacity: fades out smoothly as user scrolls down
  const scrollArrowOpacity = useTransform(scrollY, [0, 70], [1, 0]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const scrollToContent = () => {
    const target = document.getElementById('work-play-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: window.innerHeight - 60,
        behavior: 'smooth',
      });
    }
  };

  return (
    <motion.section 
      className={styles.hero} 
      aria-label="Hero"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        opacity: heroOpacity,
        visibility: heroVisibility,
      }}
    >
      {/* Pixel clouds — positioned behind title with reverse 3D parallax tilt */}
      <motion.img
        src={theme === 'dark' ? '/nightclouds.svg' : '/cloudsnew.svg'}
        alt="Pixel Clouds"
        className={styles.cloudsSvg}
        style={{ 
          x: isHovered ? cloudTiltX : 0,
          y: isHovered ? cloudTiltY : 0,
          rotateX: isHovered ? cloudRotateX : 0,
          rotateY: isHovered ? cloudRotateY : 0,
          scale: cloudScale,
          transformPerspective: 1000,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      />

      <div className={styles.heroGraphicContainer}>
        <motion.div
          className={styles.mainGroupWrapper}
          style={{ 
            scale: finalScale,
          }}
        >
          {/* DM Mono Typewriter text above Group 16 */}
          <motion.div 
            className={`${styles.typewriterHeading} ${dmMono.className}`}
            style={{
              x: isHovered ? textTiltX : 0,
              y: isHovered ? textTiltY : 0,
              rotateX: isHovered ? textRotateX : 0,
              rotateY: isHovered ? textRotateY : 0,
              transformPerspective: 600,
            }}
          >
            <span>{typedText}</span>
            <span className={styles.typewriterCursor}>|</span>
          </motion.div>

          {/* Group 16 SVG Banner Title */}
          <motion.div
            className={styles.heroSvg}
            style={{
              x: isHovered ? tiltX : 0,
              y: isHovered ? tiltY : 0,
              rotateX: isHovered ? rotateX : 0,
              rotateY: isHovered ? rotateY : 0,
              transformPerspective: 800,
            }}
            aria-label="Sanskriti's Space of Products, Interfaces, Experiments"
          >
            <HeroBannerSvg style={{ width: '100%', height: 'auto', display: 'block' }} />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Absolute overlay that manages interactive pixel-flowers on click */}
      <PixelFlowerGarden />

      {/* Positioned absolutely at the bottom of the entire full-width homescreen viewport */}
      <GrassVector />

      {/* Small bouncing 'v' scroll indicator */}
      <motion.div
        className={styles.scrollIndicatorWrapper}
        style={{
          opacity: scrollArrowOpacity,
          pointerEvents: isScrolled ? 'none' : 'auto',
        }}
      >
        <button
          type="button"
          className={styles.scrollIndicatorButton}
          onClick={scrollToContent}
          aria-label="Scroll to content"
        >
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.scrollArrowIcon}
            aria-hidden="true"
          >
            <path
              d="M1.5 1.5L7 6.5L12.5 1.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </motion.div>
    </motion.section>
  );
}
