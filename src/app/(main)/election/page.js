import styles from './Election.module.css';
import dynamic from 'next/dynamic';
const WardMap = dynamic(() => import('@/components/WardMap'), { ssr: false });
import CalendarButton from '@/components/CalendarButton';

export const metadata = {
  title: 'Voter Information',
  description: 'Everything you need to know about voting in Laramie Ward 1. Find key election dates, voter registration links, and a map of Ward 1',
};



export default function ElectionPage() {

  const primaryElection = {
    name: 'Primary Election Day',
    description: 'Primary Election Day in Laramie. Vote for Nicholas Jesse to make sure he makes it to the top two spots and advances to the General Election!',
    startDate: '2026-08-18',
    endDate: '2026-08-18',
    startTime: '07:00',
    endTime: '19:00',
    location: 'Your Polling Place, Laramie, WY',
    timeZone: 'America/Denver'
  };

  const generalElection = {
    name: 'General Election Day',
    description: 'General Election Day in Laramie! This is the final decision for City Council representatives. Don\'t forget to vote for Nicholas Jesse!',
    startDate: '2026-11-03',
    endDate: '2026-11-03',
    startTime: '07:00',
    endTime: '19:00',
    location: 'Your Polling Place, Laramie, WY',
    timeZone: 'America/Denver'
  };

  return (
    <main className={styles.pageWrapper}>
      
      {/* Header Layout */}
      <header className={styles.pageHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.headerTextSide}>
            <h1 className={styles.pageTitle}>Voter Info</h1>
          </div>
          <div className={styles.headerImageSide}>
            <img 
              src="/paintbrushes.svg" 
              alt="Wyoming Indian Paintbrush Illustration" 
              className={styles.paintbrushIllustration}
            />
          </div>
        </div>
      </header>

      {/* Section 01: How the Election Works & Key Dates */}
      <section className={`${styles.infoSection} ${styles.themeLight}`} id='plan'>
        <div className={styles.container}>
          <div className={styles.titleColumn}>
            <span className={styles.bigNumber}>01</span>
            <h2 className={styles.sectionTitle}>The 2026 Election</h2>
          </div>
          <div className={styles.contentColumn}>
            <p className={styles.introText}>
              City Council races in Laramie are non-partisan. That means all candidates, regardless of party affiliation, will appear on the same ballot during the Primary Election. <strong>Only the top two candidates with the most votes in the Primary will advance to the General Election in November.</strong>
            </p>

            <h3 className={styles.subHeading}>Key Dates to Remember</h3>
            <div className={styles.datesGrid}>
              
              {/* Primary Election Card */}
              <div className={styles.dateCard}>
                <span className={styles.dateLabel}>Primary Election</span>
                <span className={styles.dateValue}>August 18, 2026</span>
                <p className={styles.dateDetails}>Polls are open from 7:00 AM to 7:00 PM. The top two candidates advance.</p>
                {/* Embedded Primary Reminder */}
                <CalendarButton {...primaryElection} />
              </div>

              {/* General Election Card */}
              <div className={styles.dateCard}>
                <span className={styles.dateLabel}>General Election</span>
                <span className={styles.dateValue}>November 3, 2026</span>
                <p className={styles.dateDetails}>Polls are open from 7:00 AM to 7:00 PM. The final decision for Ward 1.</p>
                {/* Embedded General Reminder */}
                <CalendarButton {...generalElection}/>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Section 02: Voter Resources */}
      <section className={`${styles.infoSection} ${styles.themeOlive}`}>
        <div className={styles.container}>
          <div className={styles.titleColumn}>
            <span className={styles.bigNumber}>02</span>
            <h2 className={styles.sectionTitle}>Voter Resources</h2>
          </div>
          <div className={styles.contentColumn}>
            <p className={styles.introText}>
              Whether you are a long-time resident or a newly registered voter, the Albany County Clerk provides everything you need to cast your ballot securely and easily. Wyoming also allows same-day voter registration at your polling place on election day.
            </p>

            <h3 className={styles.subHeading}>Helpful Links</h3>
            <ul className={styles.resourceList}>
              <li>
                <a href="https://www.albanycountywy.gov/164/Elections" target="_blank" rel="noopener noreferrer">
                  Albany County Elections Office 
                </a>
                <span className={styles.resourceNote}>Official hub for local election information.</span>
              </li>
              <li>
                <a href="https://www.albanycountywy.gov/1696/Registering-to-Vote" target="_blank" rel="noopener noreferrer">
                  Voter Registration Information
                </a>
                <span className={styles.resourceNote}>Check your registration status or learn what ID to bring.</span>
              </li>
              <li>
                <a href="https://www.albanycountywy.gov/166/Absentee-Ballot-Information-and-Requests" target="_blank" rel="noopener noreferrer">
                  Request an Absentee Ballot
                </a>
                <span className={styles.resourceNote}>Vote early by mail. Any registered Wyoming voter can request an absentee ballot. You can also reqeust an absentee ballot in-person and vote early at the election building on the east side of the Albany County Courthouse. This is <strong>not</strong> available on election day.</span>
              </li>
              <li>
                <a href="https://sos.wyo.gov/Elections/" target="_blank" rel="noopener noreferrer">
                  Wyoming Secretary of State
                </a>
                <span className={styles.resourceNote}>Statewide election rules, forms, and voter ID requirements.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 03: Ward 1 Map */}
      <section className={`${styles.infoSection} ${styles.themeLight}`}>
        <div className={styles.container}>
          <div className={styles.titleColumn}>
            <span className={styles.bigNumber}>03</span>
            <h2 className={styles.sectionTitle}>Are you in Ward 1?</h2>
          </div>
          <div className={styles.contentColumn}>
            <p className={styles.introText}>
              City Council representatives are elected by the residents of their specific wards. Nicholas Jesse is running to represent Laramie's Ward 1. Use the interactive map below to confirm your ward based on your current residence.
            </p>
            
            <div className={styles.mapContainer}>
              <WardMap />
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}