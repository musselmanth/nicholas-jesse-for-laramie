import styles from './About.module.css';

export const metadata = {
  title: 'Meet Nicholas',
  description: 'Nicholas is a proud, lifelong Laramie resident with a passion for serving his hometown. Grounded by a Wyoming work ethic and a genuine love for his community, he is ready to bring an honest, hardworking, and collaborative approach to the City Council.',
};

export default function AboutPage() {
  return (
    <main className={styles.pageWrapper}>
      
      {/* Simplified Header */}
      <header className={styles.pageHeader}>
        <div className={styles.headerContainer}>
          <img 
            src="/nj-paintbrush.svg" 
            alt="Wyoming Indian Paintbrush Illustration" 
            className={styles.paintbrushIllustration}
          />
          <h1 className={styles.pageTitle}>Meet Nicholas</h1>
        </div>
      </header>

      {/* Single Continuous Content Section */}
      <section className={styles.aboutSection}>
        <div className={styles.sectionContainer}>
          
          {/* Top Block: Text Left, 3 Images Right */}
          <div className={styles.dynamicGrid}>
            <div className={styles.textContent}>

            {/* NEW: Mobile-only image that appears before the heading */}
              <div className={styles.mobileTopImage}>
                <div className={styles.imageBox}>
                  <img 
                    src="/nick-downtown.jpg" 
                    alt="Nicholas with the Downtown Laramie sign" 
                    className={styles.fluidImg}
                  />
                  <span className={styles.caption}>Downtown Laramie</span>
                </div>
              </div>

              <h2 className={styles.sectionHeading}>Rooted in Laramie</h2>
              <p>
                Hello! My name is Nicholas Jesse, and I am running to be your next Ward 1 City Councilor. I was born and raised right here in the Gem City. I graduated from Laramie High School in 2011, the University of Wyoming in 2015, and am currently pursuing a Master&apos;s in Public Administration. 
              </p>
              <p>
                I&apos;m an employee at the University of Wyoming College of Business, where, as a career services manager, I work every day to connect students with opportunities that build their future in Laramie and beyond. I am the son of two hardworking parents who moved here from the Nebraska panhandle seeking a future through higher education. My sister is a single mom who moved back to Laramie to pursue growth through education while raising two kids in a very unaffordable world. I am the product of a Laramie public education with a Wyoming grit-oriented work ethic.
              </p>
              <p>
                I&apos;m running for City Council because I want Laramie to be a place where folks actively want to live, thrive, and build their futures. We have to navigate a delicate balance right now—fostering the smart, sustainable economic growth our city needs while expanding affordability and protecting our public resources for the people who already call Laramie home. I&apos;m stepping up to offer proactive, grounded leadership, so we can build a stronger, more vibrant community together.
              </p>
              <p>
                After renting for a number of years my partner, Tom and I, were fortunate enough to take the plunge into homeownership, with a goal to put down permanent roots. Another reason why I am running is that I hope to expand access to this same opportunity to others in our community. 
              </p>
              <p>
                In my spare time, I enjoy a variety of hobbies, including hiking the Laramie valley&apos;s unmatched trails, socializing with our friends and family at a local mom and pop, shopping in our vibrant downtown corridor, walking our dogs on the Green Belt, volunteering for a local nonprofit, or just relaxing in our quaint and cozy home.
              </p>
              <p>
                I&apos;m an honest, hardworking Wyomingite. I love where I live, and I love Laramie enough to be honest about what needs work. I&apos;m dedicated to our community, and I&apos;m ready to do the work.
              </p>
            </div>
            
            {/* 3 Vertically Stacked Images */}
            <div className={styles.verticalMediaStack}>
              <div className={`${styles.imageBox} ${styles.hideOnMobile}`}>
                <img 
                  src="/nick-downtown.jpg" 
                  alt="Nicholas with the Downtown Laramie sign" 
                  className={styles.fluidImg}
                />
                <span className={styles.caption}>Downtown Laramie</span>
              </div>
              <div className={styles.imageBox}>
                <img 
                  src="/square-top.jpg" 
                  alt="Nicholas hiking at squaretop mountain" 
                  className={styles.fluidImg}
                />
                <span className={styles.caption}>Hiking at Squaretop Mountain</span>
              </div>
              <div className={styles.imageBox}>
                <img 
                  src="/nick-and-tom.jpg" 
                  alt="Nicholas Jesse with his partner Tom" 
                  className={styles.fluidImg}
                />
                <span className={styles.caption}>Nicholas with his partner Tom</span>
              </div>
            </div>
          </div>

{/* Bottom Block: 1 Image Left, Text Right (Reversed) */}
          <div className={`${styles.dynamicGrid} ${styles.dynamicGridReverse}`}>
            <div className={styles.textContent}>
              <h2 className={styles.sectionHeading}>Cultivating Community</h2>
              <p>
                At an early age I was taught how important it is to be engaged in my community, build meaningful relationships, and work to find solutions that move us forward. I have regularly led and participated in activities and events that have fostered a sense of community and belonging. Connect with my community engagement and involvement portfolio below:
              </p>
              
              <div className={styles.portfolioSection}>
                <h3 className={styles.portfolioHeading}>Community Involvement</h3>
                <ul className={styles.portfolioList}>
                  <li>
                    <strong>Laramie PrideFest</strong>
                    <span>Board Member, Chair, Advisory Board</span>
                  </li>
                  <li>
                    <strong>Laramie Main Street Alliance</strong>
                    <span>Organization Committee Member</span>
                  </li>
                  <li>
                    <strong>DaVita Village Pride</strong>
                    <span>Co-Chair and Community Involvement Lead</span>
                  </li>
                  <li>
                    <strong>Shepard Symposium on Social Justice</strong>
                    <span>Slay Day (formerly GSA Day) Founder and Coordinator</span>
                  </li>
                  <li>
                    <strong>University of Wyoming</strong>
                    <span>Spectrum Board Member</span>
                    <span>Martin Luther King Days of Dialogue Liaison</span>
                  </li>
                  <li>
                    <strong>Laramie High School</strong>
                    <span>Gay Straight Alliance President</span>
                    <span>Student Council Senior Class Representative</span>
                  </li>
                </ul>

                <h3 className={styles.portfolioHeading}>Engagement Awards</h3>
                <ul className={styles.awardList}>
                  <li><strong>2025</strong> Laramie Young Professionals 20 Under 40 Award</li>
                  <li><strong>2024</strong> Laramigo Award for Community Engagement</li>
                  <li><strong>2024</strong> True Grit Award</li>
                  <li><strong>2022</strong> Outstanding Contributions Toward Improving the Climate of the College</li>
                  <li><strong>2021</strong> Service Excellence Award</li>
                  <li><strong>2019</strong> Continuous Improvement Award</li>
                  <li><strong>2016</strong> Excellence In Service and Commitment Award</li>
                </ul>
              </div>
            </div>

            {/* Single Image Box */}
            <div className={styles.singleMediaBox}>
              <div className={styles.imageBox}>
                <img 
                  src="/city-hall.jpg" 
                  alt="Pride Proclamation at City Hall" 
                  className={styles.fluidImg}
                />
                <span className={styles.caption}>Pride Proclamation at City Hall</span>
              </div>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}