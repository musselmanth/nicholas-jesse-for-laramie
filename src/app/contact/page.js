'use client';

import { useState } from 'react';
import styles from './Contact.module.css';
import GeneralContactForm from '@/components/GeneralContactForm';
import GetInvolvedForm from '@/components/GetInvolvedForm';

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState('message'); // 'message' or 'involved'

  return (
    <main className={styles.pageWrapper}>
      
      {/* Fixed Header Layout matching your brand setup */}
      <header className={styles.pageHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.headerTextSide}>
            <h1 className={styles.pageTitle}>Connect</h1>
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

      {/* Main Single Form Content Section */}
      <section className={styles.contactSection}>
        <div className={styles.sectionContainer}>
          
          <div className={styles.introBlock}>
            <h2 className={styles.sectionHeading}>Get In Touch</h2>
            <p className={styles.introLeadin}>
              Have a question about the platform, want to share your thoughts on Ward 1 priorities, or ready to help build a stronger community? Choose an option below to connect directly with the campaign.
            </p>
          </div>

          {/* Tab Selection Navigation Wrapper */}
          <div className={styles.tabWrapper}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'message' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('message')}
            >
              Send a Message
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'involved' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('involved')}
            >
              Get Involved / Volunteer
            </button>
          </div>

          {/* Dynamic Component Rendering */}
          <div className={styles.formWrapper}>
            {activeTab === 'message' ? <GeneralContactForm /> : <GetInvolvedForm />}
          </div>

        </div>
      </section>

    </main>
  );
}