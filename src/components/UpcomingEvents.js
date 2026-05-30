'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import styles from './UpcomingEvents.module.css';

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRamfKDIEDgulyoRNE646czTRqz1AhxkneUauGsVnLEjJTpWSXp0kRj6qliZOMxdQ2ukRGoWceaEXc3/pub?gid=0&single=true&output=csv";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);

  // 1. Fetch Data
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(GOOGLE_SHEET_CSV_URL);
        if (!res.ok) throw new Error("Failed to fetch");
        
        const csvText = await res.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setEvents(result.data);
            setIsLoading(false);
          },
          error: () => {
            setFetchError(true);
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error("Error fetching events:", error);
        setFetchError(true);
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // 2. Track screen size to know exactly how many cards fit
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsPerPage(1);
      } else if (window.innerWidth < 992) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(3);
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3. NEW MATH: Adjust index if resizing the window breaks the sliding window
  useEffect(() => {
    const maxIndex = Math.max(0, events.length - cardsPerPage);
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [cardsPerPage, events.length, currentIndex]);

  if (isLoading) return <div className={styles.diagnosticState}>Loading campaign events...</div>;
  if (fetchError) return <div className={styles.diagnosticState}>Error connecting to the event calendar. Please check the Google Sheet link.</div>;
  if (!events || events.length === 0) return <div className={styles.diagnosticState}>No upcoming events at this time. Check back soon!</div>;

  // NEW MATH: Maximum allowed clicks is Total Events minus Visible Cards
  const maxIndex = Math.max(0, events.length - cardsPerPage);
  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < maxIndex;

  const nextSlide = () => { if (canScrollRight) setCurrentIndex(prev => prev + 1); };
  const prevSlide = () => { if (canScrollLeft) setCurrentIndex(prev => prev - 1); };

  return (
    <div className={styles.eventsContainer}>
      
      <div className={styles.carouselWrapper}>
        
        <button 
          className={styles.navButton} 
          onClick={prevSlide} 
          disabled={!canScrollLeft}
          aria-label="Previous event"
        >
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div className={styles.viewport}>
          
          {/* NEW MATH: Translates by exactly the width of ONE card per click */}
          <div 
            className={styles.track} 
            style={{ transform: `translateX(-${currentIndex * (100 / cardsPerPage)}%)` }}
          >
            {events.map((event, index) => (
              <div key={index} className={styles.cardWrapper}>
                <div className={styles.eventCard}>
                  <div className={styles.dateBlock}>
                    <span className={styles.dateText}>{event.Date}</span>
                    <span className={styles.timeText}>{event.Time}</span>
                  </div>
                  <div className={styles.eventDetails}>
                    <h3 className={styles.eventTitle}>{event.Title}</h3>
                    <p className={styles.eventLocation}><strong>📍 {event.Location}</strong></p>
                    <p className={styles.eventDescription}>{event.Description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        <button 
          className={styles.navButton} 
          onClick={nextSlide} 
          disabled={!canScrollRight}
          aria-label="Next event"
        >
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

      </div>
    </div>
  );
}