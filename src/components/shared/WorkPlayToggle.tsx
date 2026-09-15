'use client';

import { motion } from 'framer-motion';
import styles from './WorkPlayToggle.module.css';

type WorkPlayToggleProps = {
  activeTab: 'work' | 'play';
  onChange: (tab: 'work' | 'play') => void;
};

export default function WorkPlayToggle({ activeTab, onChange }: WorkPlayToggleProps) {
  return (
    <div 
      className={styles.toggleContainer} 
      role="tablist" 
      aria-label="Content selection"
    >
      {/* Work Tab Button */}
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'work'}
        aria-controls="work-tabpanel"
        id="work-tab"
        className={`${styles.tabButton} ${activeTab === 'work' ? styles.activeText : ''}`}
        onClick={() => onChange('work')}
      >
        {activeTab === 'work' && (
          <motion.div
            layoutId="activeIndicator"
            className={styles.activeBg}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
        <span className={styles.buttonText}>Work</span>
      </button>

      {/* Play Tab Button */}
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'play'}
        aria-controls="play-tabpanel"
        id="play-tab"
        className={`${styles.tabButton} ${activeTab === 'play' ? styles.activeText : ''}`}
        onClick={() => onChange('play')}
      >
        {activeTab === 'play' && (
          <motion.div
            layoutId="activeIndicator"
            className={styles.activeBg}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
        <span className={styles.buttonText}>Play</span>
      </button>
    </div>
  );
}
