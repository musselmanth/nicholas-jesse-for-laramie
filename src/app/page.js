// src/app/page.jsx
import Link from 'next/link';
import styles from './page.module.css';
import WardMap from '@/components/WardMap';

export default function Home() {
  return (
    <main className={styles.main}>

      {/* Platform Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Key Priorities</h2>
          <ul className={styles.platformList}>
            <li>
              <strong>Smart Infrastructure:</strong> Prioritizing sensible road repair schedules, 
              improving snow removal logistics, and maintaining city services.
            </li>
            <li>
              <strong>Housing & Zoning:</strong> Updating development codes to encourage 
              sustainable growth without sacrificing the character of our neighborhoods.
            </li>
            <li>
              <strong>Fiscal Responsibility:</strong> Ensuring the city budget is transparent, 
              efficient, and focused on long-term value for Laramie taxpayers.
            </li>
          </ul>
          <Link href="/platform" className={styles.textLink}>
            Read the full platform &rarr;
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className={`${styles.section} ${styles.altBackground}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>About Nicholas</h2>
          <p className={styles.sectionText}>
            Nicholas is a professional developer, problem-solver, and proud Laramie resident. 
            He believes that city government works best when it focuses on the mechanics of making 
            a city run smoothly. He is committed to bringing a logical, transparent approach to the City Council.
          </p>
          <Link href="/about" className={styles.textLink}>
            Get to know Nicholas &rarr;
          </Link>
        </div>
      </section>

      {/* Map & Election Info Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Ward 1 Map & Election Info</h2>
          <p className={styles.sectionText}>
            Are you a resident of Ward 1? Check the boundary map below and make sure you have 
            a plan to vote in the upcoming municipal election.
          </p>
          
          <div className={styles.mapContainer}>
            <WardMap />
          </div>
          <Link href="/election-info" className={styles.textLink}>
            Voter Information & Deadlines &rarr;
          </Link>
        </div>
      </section>

    </main>
  );
}