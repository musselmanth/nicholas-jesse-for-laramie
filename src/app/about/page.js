import styles from './About.module.css';

export const metadata = {
  title: 'About | Nicholas Jesse for Laramie',
  description: 'Meet Nicholas Jesse and learn about his background, his roots in Laramie, and his vision for Ward 1.',
};

export default function AboutPage() {
  return (
    <main className={styles.pageWrapper}>
      
      {/* Simplified Header */}
      <header className={styles.pageHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.headerTextSide}>
            <h1 className={styles.pageTitle}>Meet Nicholas</h1>
          </div>
          <div className={styles.headerImageSide}>
            <img 
              src="/nicholas-jesse-for-laramie/paintbrushes.svg" 
              alt="Wyoming Indian Paintbrush Illustration" 
              className={styles.paintbrushIllustration}
            />
          </div>
        </div>
      </header>

      {/* Single Continuous Content Section */}
      <section className={styles.aboutSection}>
        <div className={styles.sectionContainer}>
          
          {/* Top Block: Text Left, Images Right */}
          <div className={styles.dynamicGrid}>
            <div className={styles.textContent}>
              <h2 className={styles.sectionHeading}>The Journey So Far</h2>
              <p>
                [Placeholder: Write your main introductory narrative here. Focus on your deep personal connection to Laramie, your background, and what makes living in Ward 1 special to you. Share a story or milestone that defines your dedication to this community.]
              </p>
              <p>
                [Placeholder: Expand on your professional experience or technical expertise. Use this area to connect your background skills directly with your capacity to analyze city budgets, evaluate zoning laws, and make practical, data-backed decisions on the council.]
              </p>
            </div>
            
            <div className={styles.mediaCluster}>
              <div className={styles.imageBoxPortrait}>
                <img 
                  src="/api/placeholder/400/533" 
                  alt="Nicholas Jesse Portrait" 
                  className={styles.fluidImg}
                />
                <span className={styles.caption}>[Placeholder: Main Portrait Photo]</span>
              </div>
              <div className={styles.imageBoxLandscape}>
                <img 
                  src="/api/placeholder/600/400" 
                  alt="Laramie landscape or community" 
                  className={styles.fluidImg}
                />
                <span className={styles.caption}>[Placeholder: Action/Community Landscape Photo]</span>
              </div>
            </div>
          </div>

          {/* Bottom Block: Images Left, Text Right (Reversed) */}
          <div className={`${styles.dynamicGrid} ${styles.dynamicGridReverse}`}>
            <div className={styles.textContent}>
              <h2 className={styles.sectionHeading}>Active in Laramie</h2>
              <p>
                [Placeholder: Highlight your current civic engagement, local volunteer roles, board memberships, or advocacy work. This grounds your campaign in actionable community service and shows voters you are already actively doing the work.]
              </p>
              
              <div className={styles.pressContainer}>
                <h3 className={styles.pressHeading}>Recent News Coverage</h3>
                <ul className={styles.newsList}>
                  <li>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Candidate Nicholas Jesse Announces Campaign for City Council
                    </a>
                    <span className={styles.pubName}>— Laramie Boomerang</span>
                  </li>
                  <li>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Zoning and Public Resources Forum Panels Headline Local Priorities
                    </a>
                    <span className={styles.pubName}>— WyoFile</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.mediaCluster}>
              <div className={styles.imageBoxLandscape}>
                <img 
                  src="/api/placeholder/600/400" 
                  alt="Nicholas at a local event" 
                  className={styles.fluidImg}
                />
                <span className={styles.caption}>[Placeholder: Local Engagement Landscape Photo]</span>
              </div>
              <div className={styles.imageBoxPortrait}>
                <img 
                  src="/api/placeholder/400/533" 
                  alt="Nicholas visiting a local spot" 
                  className={styles.fluidImg}
                />
                <span className={styles.caption}>[Placeholder: Casual/Working Portrait Photo]</span>
              </div>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}