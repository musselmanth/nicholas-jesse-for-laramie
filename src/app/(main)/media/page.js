import styles from './Media.module.css';
import NewsList from '@/components/NewsList';
import ForumsList from '@/components/ForumsList';

export const metadata = {
  title: 'In the Media',
  description: 'News coverage, questionnaires, and candidate forums featuring Nicholas Jesse for Laramie City Council Ward 1.',
};

export default function MediaPage() {
  return (
    <main className={styles.pageWrapper}>

      <header className={styles.pageHeader}>
        <div className={styles.headerContainer}>
          <img
            src="/nj-paintbrush.svg"
            alt="Campaign Logo"
            className={styles.paintbrushIllustration}
          />
          <h1 className={styles.pageTitle}>In the Media</h1>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.columns}>
          <div className={`${styles.column} ${styles.newsColumn}`}>
            <h2 className={styles.columnTitle}>News Coverage</h2>
            <NewsList mosaic />
          </div>
          <div className={styles.column}>
            <h2 className={styles.columnTitle}>Questionnaires &amp; Forums</h2>
            <ForumsList />
          </div>
        </div>
      </section>

    </main>
  );
}
