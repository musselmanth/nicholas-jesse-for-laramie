"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

    // We set a fallback estimate for the server-side render
  const [dynamicHeight, setDynamicHeight] = useState('calc(100svh - 75px)');

  useEffect(() => {
    const calculateHeight = () => {
      // Find the navbar in the DOM (looks for a <nav> tag or any class containing "navbar")
      const navbar = document.querySelector('nav') || document.querySelector('[class*="navbar"]');
      
      if (navbar) {
        // Grab the exact current pixel height of the navbar and update our CSS variable
        const navHeight = navbar.offsetHeight;
        setDynamicHeight(`calc(100svh - ${navHeight}px)`);
      }
    };

    // Calculate immediately on mount
    calculateHeight();

    // Recalculate if the user rotates their phone or resizes the browser window
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  return (
    <nav className={styles.navbar} style={{ '--exact-hero-height': dynamicHeight }}>
      <div className={styles.navContainer}>
        {/* Replace with an <img /> or <Image /> tag later if you have a graphic logo */}
        <Link href="/" className={styles.logoContainer}>
          {/* Replace this src with your actual icon file */}
          
          
          <div className={styles.logoTextStack}>
            <span className={styles.logoName}><span className={styles.logoFirstName}>Nicholas</span><span className={styles.logoLastName}>Jesse</span></span>
            <span className={styles.logoOffice}>Laramie City Council Ward 1</span>
          </div>
          <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/nj-paintbrush.svg`} alt="Campaign Logo" className={styles.logoImage} />
        </Link>

        {/* Mobile Hamburger Button */}
        <button 
          className={styles.mobileMenuBtn} 
          onClick={toggleMenu} 
          aria-label="Toggle navigation"
        >
          <span className={`${styles.bar} ${isOpen ? styles.barOpen1 : ''}`}></span>
          <span className={`${styles.bar} ${isOpen ? styles.barOpen2 : ''}`}></span>
          <span className={`${styles.bar} ${isOpen ? styles.barOpen3 : ''}`}></span>
        </button>

        {/* Menu Links */}
        <ul className={`${styles.navMenu} ${isOpen ? styles.active : ''}`}>
          <li className={styles.navItem}>
            <Link href="/about" className={styles.navLink} onClick={toggleMenu}>
              About Me
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/platform" className={styles.navLink} onClick={toggleMenu}>
              Platform
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/election-info" className={styles.navLink} onClick={toggleMenu}>
              Election Info
            </Link>
          </li>
                    <li className={styles.navItem}>
            <Link href="/contact" className={styles.navLink} onClick={toggleMenu}>
              Contact
            </Link>
          </li>
          <li className={styles.navItem}>
            {/* Standard <a> tag for external links, not Next.js <Link> */}
            <a 
              href="https://secure.actblue.com/donate/..." 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.donateBtn}
            >
              Donate
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}