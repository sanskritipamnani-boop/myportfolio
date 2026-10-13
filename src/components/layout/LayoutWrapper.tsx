'use client';

import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/context/ThemeContext';
import Navigation from './Navigation';
import Footer from './Footer';
import styles from './LayoutWrapper.module.css';

type LayoutWrapperProps = {
  children: React.ReactNode;
};

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAboutPage = pathname === '/about';

  return (
    <ThemeProvider>
      <div className={styles.viewport}>
        {/* The main screen layer containing navigation, homepage content, and footer */}
        <div className={styles.mainScreen}>
          <Navigation />
          <main id="main-content">
            {children}
          </main>
          {!isAboutPage && <Footer />}
        </div>
      </div>
    </ThemeProvider>
  );
}
