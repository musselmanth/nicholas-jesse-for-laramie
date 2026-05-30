import styles from './Platform.module.css';

export const metadata = {
  title: 'Platform | Nicholas Jesse for Laramie',
  description: 'Read about Nicholas Jesse’s priorities for housing, economic development, public resources, and city staff in Laramie Ward 1.',
};

export default function PlatformPage() {
  return (
    <main className={styles.pageWrapper}>
      
      {/* Page Header (Clean & Bold) */}
      <header className={styles.pageHeader}>
        <div className={styles.headerContent}>
          
          {/* Custom Civic Compass/Star SVG */}
          <svg viewBox="0 0 100 100" className={styles.headerIcon} xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--brand-orange)" strokeWidth="2" strokeDasharray="6 6"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="var(--brand-cream-light)" strokeWidth="1" opacity="0.4"/>
            <path d="M50 15 L55 42 L82 50 L55 58 L50 85 L45 58 L18 50 L45 42 Z" fill="var(--brand-cream-light)"/>
            <circle cx="50" cy="50" r="6" fill="var(--brand-orange)"/>
          </svg>

          <h1 className={styles.pageTitle}>Vision for Laramie</h1>
          
        </div>
      </header>

      {/* Issue 01: Housing (Light Theme) */}
      <section className={`${styles.issueSection} ${styles.themeLight}`}>
        <div className={styles.container}>
          <div className={styles.titleColumn}>
            <span className={styles.bigNumber}>01</span>
            <h2 className={styles.issueTitle}>Housing Expansion</h2>
          </div>
          <div className={styles.contentColumn}>
            <p className={styles.issueIntro}>
              Laramie is hurting for real housing solutions across a variety of demographics. I support practical housing expansion that utilizes the limited land we have wisely, encourages and increases affordability, strengthens partnerships in development, and contributes to Laramie’s growth with intention.
            </p>
            <h3 className={styles.prioritiesHeading}>Key Priorities</h3>
            <ul className={styles.prioritiesGrid}>
              <li>Unlock and Expand mixed-use zoning where appropriate.</li>
              <li>Support housing initiatives that serve our working families, young professionals, seniors, and unhoused and low-income populations.</li>
              <li>Cultivating robust development partnerships that create truly affordable and attainable housing solutions.</li>
              <li>Increasing Density where density makes sense.</li>
              <li>Engage with community members to identify development opportunities for thoughtful city expansion.</li>
              <li>Support housing initiatives that reduce pressure on existing neighborhoods and keep Laramie livable in the 21st century.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Issue 02: Economy (Olive Theme) */}
      <section className={`${styles.issueSection} ${styles.themeOlive}`}>
        <div className={styles.container}>
          <div className={styles.titleColumn}>
            <span className={styles.bigNumber}>02</span>
            <h2 className={styles.issueTitle}>Economic Development</h2>
          </div>
          <div className={styles.contentColumn}>
            <p className={styles.issueIntro}>
              Laramie is not unaccustomed to budget shortfalls and limited resources. Over the last 30 years I have witnessed the incredible growth of this city and can attest to the local government’s fiscal responsibility. I support economic growth that fights to provide opportunity for our young professionals and contributes to their long-term success in Laramie.
            </p>
            <h3 className={styles.prioritiesHeading}>Key Priorities</h3>
            <ul className={styles.prioritiesGrid}>
              <li>Champion young entrepreneurs and professionals who want to put roots down in Laramie.</li>
              <li>Support local businesses and nonprofits that work together to fill community gaps that city government can’t.</li>
              <li>Explore city-wide beautification, public infrastructure improvements, and engage in thoughtful planning for parking in the downtown corridor.</li>
              <li>Invest in sustainability projects and local circular-economy opportunities that drive entrepreneurship and innovation.</li>
              <li>Strengthening city relationships with the University of Wyoming, WyoTech, and our regional airport to build economic pipelines for long-term and sustainable growth.</li>
              <li>Support the development of more third spaces where all can gather, connect, and build community.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Issue 03: Resources (Light Theme) */}
      <section className={`${styles.issueSection} ${styles.themeLight}`}>
        <div className={styles.container}>
          <div className={styles.titleColumn}>
            <span className={styles.bigNumber}>03</span>
            <h2 className={styles.issueTitle}>Public Resource Protection</h2>
          </div>
          <div className={styles.contentColumn}>
            <p className={styles.issueIntro}>
              The Laramie valley is home to a variety of public resources including the Casper aquifer, Pilot Hill Open Space, the Laramie River and Green Belt Trail, the breathtaking Snowy Range and many more treasures. I support the protection of your public access to public resources.
            </p>
            <h3 className={styles.prioritiesHeading}>Key Priorities</h3>
            <ul className={styles.prioritiesGrid}>
              <li>Scrutinize water-intensive development proposals, including billionaire-backed AI data centers that could drain Laramie’s aquifer and harm Laramie’s long-term water security.</li>
              <li>Support expansion of public education on water conservation practices and encourage native and drought-tolerant landscaping partnerships.</li>
              <li>Make water decisions based on long-term community needs, not short-term outside pressure.</li>
              <li>Bolster city relationships with organizations like the University Extension Office, Laramie River Conservation District, and other entities that work to protect your water and public lands.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Issue 04: City Staff (Olive Theme) */}
      <section className={`${styles.issueSection} ${styles.themeOlive}`}>
        <div className={styles.container}>
          <div className={styles.titleColumn}>
            <span className={styles.bigNumber}>04</span>
            <h2 className={styles.issueTitle}>Trusting & Supporting City Staff</h2>
          </div>
          <div className={styles.contentColumn}>
            <p className={styles.issueIntro}>
              A city government works well when the staff who are charged with operating said city are trusted and supported. City staff work hard to ensure that our city departments are functioning, our financial prospects are healthy, and your government services are operating. I support cultivating trust in city government and advocating for our city staff across all departments who do the behind-the-scenes work to keep our city not only running, but happy, healthy, and safe.
            </p>
            <h3 className={styles.prioritiesHeading}>Key Priorities</h3>
            <ul className={styles.prioritiesGrid}>
              <li>Support cost of living adjustments and merit-based pay increases where appropriate.</li>
              <li>Expansion of professional development opportunities.</li>
              <li>Introduction of youth in government programs that get youth acquainted with city processes, departments, roles in public service, and advisory committees at an earlier age.</li>
              <li>Improving communication and creating meaningful collaboration between the greater Laramie community and the city government through committees, invitations, and structured engagement.</li>
            </ul>
          </div>
        </div>
      </section>

    </main>
  );
}