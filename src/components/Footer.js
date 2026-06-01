// src/components/Footer.jsx
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Left Column: Disclaimers */}
        <div className={styles.column}>
          <p className={styles.disclaimerText}>
            Paid for by the Committee to Elect Nicholas Jesse.
          </p>
          <p className={styles.finePrint}>
            &copy; {currentYear} Nicholas Jesse for Laramie City Council. All rights reserved.
            Not authorized by any other candidate or committee.
            <br />
            123 Campaign HQ Street, Laramie, WY 82070.
          </p>
        </div>

        {/* Middle Column: Quick Links */}
        <div className={styles.column}>
          <h3 className={styles.heading}>Site Map</h3>
          <ul className={styles.linkList}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Nicholas</Link></li>
            <li><Link href="/platform">Platform</Link></li>
            <li><Link href="/election-info">Election Info</Link></li>
            <li><Link href="/volunteer">Volunteer</Link></li>
          </ul>
        </div>

        {/* Right Column: Connect */}
        <div className={styles.column}>
          <h3 className={styles.heading}>Connect</h3>
          <p className={styles.sectionText}>
            Stay updated with Nicholas on social media.
          </p>
          <div className={styles.socialGroup}>
            {/* Standard <a> tags for external links */}
            <a href="https://www.facebook.com/profile.php?id=61590168326305" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              Facebook
            </a>
            <a href="https://www.instagram.com/nicholasjesse4laramie/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              Instagram
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}