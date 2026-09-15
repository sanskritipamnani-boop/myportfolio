'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Container from './Container';
import styles from './Navigation.module.css';

export default function Navigation() {
  const pathname = usePathname();

  // Time & Weather state
  const [time, setTime] = useState('');
  const [weather, setWeather] = useState({ temp: 29, code: 3 }); // Fallback defaults

  // Live India Time (IST) Clock
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      const formatted = formatter.format(new Date());
      // Strip leading zero for a cleaner display (e.g. 04:30 PM -> 4:30 PM)
      setTime(formatted.replace(/^0/, ''));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch real-time weather from Open-Meteo for Gandhinagar (Lat: 23.2156, Lon: 72.6369)
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=23.2156&longitude=72.6369&current_weather=true')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.current_weather) {
          setWeather({
            temp: Math.round(data.current_weather.temperature),
            code: data.current_weather.weathercode,
          });
        }
      })
      .catch((err) => console.log('Weather fetch failed, using fallbacks', err));
  }, []);

  // Render vector weather icons (light blue for clouds/rain, amber for sun)
  const renderWeatherIcon = (code: number) => {
    if (code === 0) {
      // Sun (Clear)
      return (
        <svg
          viewBox="0 0 24 24"
          width="15"
          height="15"
          fill="none"
          stroke="#E2A627"
          strokeWidth="2"
          strokeLinecap="round"
          className={styles.weatherSvg}
        >
          <circle cx="12" cy="12" r="5" fill="#E2A627" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      );
    }
    
    // Cloud icon (Mainly clear, partly cloudy, overcast, fog) styled with a premium light blue fill
    if ([1, 2, 3, 45, 48].includes(code)) {
      return (
        <svg
          viewBox="0 0 24 24"
          width="15"
          height="15"
          fill="#92B5F7" /* Custom Light Blue cloud color */
          className={styles.weatherSvg}
        >
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
        </svg>
      );
    }

    // Rain or Storm (Light Blue cloud and rain droplets)
    return (
      <svg
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="none"
        stroke="#92B5F7"
        strokeWidth="2"
        strokeLinecap="round"
        className={styles.weatherSvg}
      >
        <path
          d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
          fill="#92B5F7"
          stroke="none"
        />
        <line x1="8" y1="21" x2="7.5" y2="23" stroke="#92B5F7" strokeWidth="1.5" />
        <line x1="12" y1="21" x2="11.5" y2="23" stroke="#92B5F7" strokeWidth="1.5" />
        <line x1="16" y1="21" x2="15.5" y2="23" stroke="#92B5F7" strokeWidth="1.5" />
      </svg>
    );
  };

  const scrollToSection = useCallback((id: string) => {
    if (pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    window.location.hash = id;

    const el = document.getElementById('work-play-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [pathname]);

  // Split digits and AM/PM to style AM/PM as superscript
  const timeParts = time.match(/(\d+:\d+)\s*(AM|PM)/i);
  const timeStr = timeParts ? timeParts[1] : time;
  const amPmStr = timeParts ? timeParts[2] : '';

  return (
    <header className={styles.header} role="banner">
      <Container>
        <nav className={styles.nav} aria-label="Main navigation">
          {/* Logo / Name */}
          <Link href="/" className={styles.logo} aria-label="Home">
            Your Name
          </Link>

          {/* Real-time India Time & Gandhinagar Weather Widget */}
          {time && (
            <div className={styles.infoWidget} aria-label="Current time and weather in Gandhinagar, India">
              <span className={styles.timeText}>
                {timeStr}
                <sup className={styles.amPm}>{amPmStr}</sup>
              </span>
              <span className={styles.separator} aria-hidden="true">·</span>
              <span className={styles.location}>Gandhinagar</span>
              <span className={styles.temp}>{weather.temp}°</span>
              <span className={styles.weatherIcon} aria-hidden="true">
                {renderWeatherIcon(weather.code)}
              </span>
            </div>
          )}

          {/* Nav links */}
          <ul className={styles.links} role="list">
            <li>
              <button
                className={styles.navLink}
                onClick={() => scrollToSection('work')}
                aria-label="Scroll to Selected Work"
              >
                Work
              </button>
            </li>
            <li>
              <button
                className={styles.navLink}
                onClick={() => scrollToSection('playground')}
                aria-label="Scroll to Playground"
              >
                Playground
              </button>
            </li>
            <li>
              <Link href="/about" className={styles.navLink}>
                About
              </Link>
            </li>
            <li>
              <a
                href="#"
                className={`${styles.navLink} ${styles.resumeLink}`}
                aria-label="Resume (external link)"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume ↗
              </a>
            </li>
          </ul>

          {/* Mobile menu toggle */}
          <button
            className={styles.menuToggle}
            aria-label="Toggle navigation menu"
            aria-expanded="false"
            id="nav-toggle"
            onClick={(e) => {
              const btn = e.currentTarget;
              const isOpen = btn.getAttribute('aria-expanded') === 'true';
              btn.setAttribute('aria-expanded', String(!isOpen));
              const nav = document.querySelector(`.${styles.links}`);
              if (nav) nav.classList.toggle(styles.linksOpen);
            }}
          >
            <span className={styles.hamburger} aria-hidden="true" />
          </button>
        </nav>
      </Container>
    </header>
  );
}
