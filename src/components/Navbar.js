"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Replace with an <img /> or <Image /> tag later if you have a graphic logo */}
        <Link href="/" className={styles.logo}>
          Nicholas Jesse Ward 1
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