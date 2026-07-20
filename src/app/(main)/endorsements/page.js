import styles from './Endorsements.module.css';
import EndorsementsList from '@/components/EndorsementsList';

export const metadata = {
  title: 'Endorsements',
  description: 'See who is endorsing Nicholas Jesse for Laramie City Council Ward 1.',
};

export default function EndorsementsPage() {
  return (
    <main className={styles.pageWrapper}>

      <header className={styles.pageHeader}>
        <div className={styles.headerContainer}>
          <img
            src="/nj-paintbrush.svg"
            alt="Campaign Logo"
            className={styles.paintbrushIllustration}
          />
          <h1 className={styles.pageTitle}>Endorsements</h1>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.titleColumn}>
            <h2 className={styles.sectionTitle}>Community Support</h2>
          </div>
          <div className={styles.contentColumn}>
            <p className={styles.introText}>
              Nicholas is proud to have the support of community members, local leaders, and organizations who share a vision for a more livable, equitable, and thriving Laramie.
            </p>
            <EndorsementsList />
          </div>
        </div>
      </section>

    </main>
  );
}
