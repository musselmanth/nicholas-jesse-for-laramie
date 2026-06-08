// src/app/page.jsx
import Link from 'next/link';
import styles from './page.module.css';
import WardMap from '@/components/WardMap';
import Hero from '@/components/Hero';
import UpcomingEvents from '@/components/UpcomingEvents';

export default function Home() {
  return (

    <main className={styles.main}>
      <Hero />
      
      {/* About Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>About Nicholas</h2>
          <p className={styles.sectionText}>
            Born and raised in Laramie, Nicholas is deeply passionate about serving his hometown. Grounded by a Wyoming work ethic and a genuine love for his community, he is ready to bring an honest, hardworking, and collaborative approach to the City Council.
          </p>
          <Link href="/about" className={styles.textLink}>
            Get to know Nicholas &rarr;
          </Link>
        </div>
      </section>

      {/* Platform Section */}
      <section className={`${styles.section} ${styles.altBackground}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Key Priorities</h2>
          <ul className={styles.platformList}>
            <li>
              <strong>Housing Expansion:</strong> Supporting practical solutions, mixed-use zoning, and robust partnerships that encourage affordability and intentional growth in Laramie.
            </li>
            <li>
              <strong>Economic Development:</strong> Championing young professionals, supporting local businesses, and building economic pipelines for sustainable, long-term success.
            </li>
            <li>
              <strong>Public Resource Protection:</strong> Defending the Casper aquifer, the Green Belt, and our public lands by making conservation decisions based on long-term community needs.
            </li>
            <li>
              <strong>Supporting City Staff:</strong> Cultivating trust in local government and advocating for the hardworking staff across all departments who keep Laramie running safely.
            </li>
          </ul>
          <Link href="/platform" className={styles.textLink}>
            Read the full platform &rarr;
          </Link>
        </div>
      </section>

      {/* Upcoming Events Section (Using your global page classes) */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Upcoming Events</h2>
          
          {/* The new horizontal carousel loads right here */}
          <UpcomingEvents />
          
        </div>
      </section>

      {/* Map & Election Info Section */}
      <section className={`${styles.section} ${styles.altBackground}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Ward Map & Election Info</h2>
          <p className={styles.sectionText}>
            Are you a resident of Ward 1? Check the map below and make sure you have 
            a plan to vote in the upcoming municipal election.
          </p>
          
          <div className={styles.mapContainer}>
            <WardMap />
          </div>
          <Link href="/election" className={styles.textLink} style={{ display: 'inline-block',marginTop: '1.5em' }}>
            Voter Information & Deadlines &rarr;
          </Link>
        </div>
      </section>

            {/* About Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>I want to hear from you!</h2>
          <p className={styles.sectionText}>
            As neighbors, we're in this together—and I want to hear your voice. 
            Drop a message to let me know what you hope Laramie can achieve, 
            what makes our town completely unique, and what local challenges we need to tackle next.
          </p>
          <Link href="/contact" className={styles.textLink}>
            Let's Connect! &rarr;
          </Link>
        </div>
      </section>

    </main>
  );
}