'use client';

import { useState } from 'react';
import Container from '@/components/layout/Container';
import Media from '@/components/shared/Media';
import { playgroundItems, PlaygroundItem } from '@/data/projects';
import styles from './Playground.module.css';

export default function Playground() {
  const leftItems = playgroundItems
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ originalIndex }) => originalIndex % 4 === 0 || originalIndex % 4 === 3);

  const rightItems = playgroundItems
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ originalIndex }) => originalIndex % 4 === 1 || originalIndex % 4 === 2);

  return (
    <section className={styles.section} id="playground" aria-labelledby="playground-heading">
      <Container>
        <header className={styles.header}>
          <h2 id="playground-heading" className={`label ${styles.sectionLabel}`}>
            Playground
          </h2>
          <p className={styles.intro}>
            Experiments, explorations, and things made for the joy of making.
          </p>
        </header>

        <div className={styles.grid}>
          {/* Left Column: Wider boxes (Experiment 1, Experiment 4, etc.) */}
          <div className={styles.columnLeft}>
            {leftItems.map(({ item, originalIndex }) => (
              <PlaygroundItemArticle key={item.id} item={item} index={originalIndex + 1} />
            ))}
          </div>

          {/* Right Column: Narrower boxes (Experiment 2, Experiment 3 below it, etc.) */}
          <div className={styles.columnRight}>
            {rightItems.map(({ item, originalIndex }) => (
              <PlaygroundItemArticle key={item.id} item={item} index={originalIndex + 1} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function PlaygroundItemArticle({ item, index }: { item: PlaygroundItem; index: number }) {
  return (
    <article className={`${styles.item} ${styles[`item${index}`]}`}>
      {item.embedUrl ? (
        <div className={styles.frameContainer}>
          <PlaygroundCard item={item} />
        </div>
      ) : item.link ? (
        <a
          href={item.link}
          className={`${styles.frameContainer} ${styles.frameLink}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${item.title} (opens in new tab)`}
        >
          <PlaygroundCard item={item} />
        </a>
      ) : (
        <div className={styles.frameContainer}>
          <PlaygroundCard item={item} />
        </div>
      )}
    </article>
  );
}

function PlaygroundCard({ item }: { item: (typeof playgroundItems)[0] }) {
  const [isInteractive, setIsInteractive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className={styles.visualFrame}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsInteractive(false);
      }}
      onMouseMove={handleMouseMove}
    >
      <div className={styles.cardMedia}>
        {item.embedUrl ? (
          <div
            className={styles.iframeWrapper}
            style={item.aspectRatio ? { aspectRatio: item.aspectRatio } : undefined}
          >
            {isInteractive ? (
              <iframe
                src={item.embedUrl}
                title={item.title}
                className={styles.iframe}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <div
                className={styles.iframePlaceholder}
                onClick={(e) => {
                  e.preventDefault();
                  setIsInteractive(true);
                }}
                role="button"
                tabIndex={0}
                aria-label={`Click to interact with ${item.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsInteractive(true);
                  }
                }}
              >
                {item.media ? (
                  <div className={styles.videoPreviewWrapper}>
                    <Media {...item.media} />
                  </div>
                ) : (
                  <div className={styles.placeholderWatermark}>
                    <span className={styles.placeholderTitle}>{item.title}</span>
                  </div>
                )}
                <div className={styles.iframeOverlay}>
                  <span className={styles.interactPill}>
                    <span className={styles.interactDot}>●</span> Click to interact
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          item.media && <Media {...item.media} />
        )}
      </div>

      {/* Top-Right Open Link Corner Button */}
      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cornerLinkBtn}
          title={`Open ${item.title} (new tab)`}
          aria-label={`Open ${item.title} (new tab)`}
          onClick={(e) => e.stopPropagation()}
        >
          <span className={styles.cornerLinkText}>Open Site</span>
          <span className={styles.cornerLinkIcon}>↗</span>
        </a>
      )}

      {/* Floating Cursor-Follow Dialogue Box / Tooltip */}
      {isHovered && !isInteractive && (
        <div
          className={styles.tooltipDialogue}
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
          role="tooltip"
          aria-hidden="true"
        >
          <div className={styles.tooltipHeader}>
            <span className={styles.tooltipCategory}>{item.category}</span>
          </div>
          <h4 className={styles.tooltipTitle}>{item.title}</h4>
          {item.description && (
            <p className={styles.tooltipDescription}>{item.description}</p>
          )}
        </div>
      )}
    </div>
  );
}
