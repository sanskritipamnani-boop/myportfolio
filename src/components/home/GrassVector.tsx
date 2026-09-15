'use client';

import { useState, useEffect } from 'react';
import styles from './GrassVector.module.css';

export default function GrassVector() {
  const [isLeft, setIsLeft] = useState(false);
  const [isPopped, setIsPopped] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    // Pop the beaver up and show the speech bubble almost instantly on load
    const popTimer = setTimeout(() => {
      setIsPopped(true);
      setShowBubble(true);
    }, 100);

    // Auto-dismiss the bubble and pop the beaver back down after 8 seconds
    const dismissTimer = setTimeout(() => {
      setIsPopped(false);
      setShowBubble(false);
    }, 8000);

    return () => {
      clearTimeout(popTimer);
      clearTimeout(dismissTimer);
    };
  }, []);

  const handleBeaverClick = () => {
    setIsLeft((prev) => !prev);
    // Dismiss the speech bubble and pop down if clicked
    setIsPopped(false);
    setShowBubble(false);
  };

  const handleDismiss = () => {
    setIsPopped(false);
    setShowBubble(false);
  };

  return (
    <div className={styles.grassContainer}>
      {/* Speech bubble */}
      {showBubble && (
        <div
          className={styles.speechBubble}
          style={{ marginLeft: isLeft ? '-150px' : '150px' }}
          onClick={handleDismiss}
        >
          click click
          <div className={styles.speechPointer} />
        </div>
      )}

      {/* Invisible click target overlay that sits in front of the grass to intercept clicks */}
      <div
        className={`${styles.beaverClickTarget} ${isPopped ? styles.popped : ''}`}
        style={{ marginLeft: isLeft ? '-150px' : '150px' }}
        onClick={handleBeaverClick}
      />

      {/* Beaver popup wrapper sitting behind the grass paths with toggled left/right offset on click */}
      <div
        className={`${styles.beaverWrapper} ${isPopped ? styles.popped : ''}`}
        style={{ marginLeft: isLeft ? '-150px' : '150px' }}
      >
        <img
          src="/BEAVER.svg"
          alt="Friendly Beaver"
          className={styles.beaver}
        />
      </div>

      {/* Render pixelgrass.svg statically as a clean illustration image tag */}
      <img
        src="/pixelgrass.svg"
        alt=""
        className={styles.grassSvg}
      />
    </div>
  );
}

