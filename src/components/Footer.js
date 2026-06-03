import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Left Column: Disclaimers & Credits */}
        <div className={styles.column}>
          <p className={styles.disclaimerText}>
            Paid for by the Committee to Elect Nicholas Jesse.
          </p>
          <p className={styles.finePrint}>
            Not authorized by any other candidate or committee.
            <br /><br />
            Website designed and developed by Tom Musselman.
          </p>
        </div>

        {/* Middle Column: Quick Links */}
        <div className={styles.column}>
          <h3 className={styles.heading}>Site Map</h3>
          <ul className={styles.linkList}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Me</Link></li>
            <li><Link href="/platform">Platform</Link></li>
            <li><Link href="/election">Election Info</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Right Column: Connect */}
        <div className={styles.column}>
          <h3 className={styles.heading}>Connect</h3>
          
          <div className={styles.contactInfo}>
            <a href="mailto:contact@nicholasjesseforlaramie.com">contact@nicholasjesseforlaramie.com</a>
            <a href="tel:3072232161">307-223-2161</a>
          </div>

          <div className={styles.socialGroup}>
            <a href="https://www.facebook.com/profile.php?id=61590168326305" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.socialLink}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a href="https://www.instagram.com/nicholasjesse4laramie/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialLink}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.169a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}