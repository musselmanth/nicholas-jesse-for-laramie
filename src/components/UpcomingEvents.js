'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import CalendarButton from './CalendarButton';
import styles from './UpcomingEvents.module.css';

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRamfKDIEDgulyoRNE646czTRqz1AhxkneUauGsVnLEjJTpWSXp0kRj6qliZOMxdQ2ukRGoWceaEXc3/pub?gid=0&single=true&output=csv";

// Normalizes host-provided links: trims, ignores blanks, adds https:// if missing
function normalizeUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

// Helper utility to convert human strings like "Friday June 1st" and "7PM" to ISO standards
function transformEventDateTime(rawDate, rawTime) {
  const months = {
    january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
    july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
  };

  // 1. Parse Date String (e.g., "Friday June 1st")
  let startDateIso = '2026-11-03'; // Resilient fallback
  const cleanDateStr = rawDate.toLowerCase().replace(/(st|nd|rd|th)/g, '');
  const dateMatch = cleanDateStr.match(/(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d+)/);
  
  if (dateMatch) {
    const monthNum = months[dateMatch[1]];
    const dayNum = dateMatch[2].padStart(2, '0');
    startDateIso = `2026-${monthNum}-${dayNum}`; // Assuming the 2026 cycle
  }

  // 2. Parse Time String (e.g., "7PM", "8:30PM-9:30PM")
  let startTimeIso = '19:00';
  let endTimeIso = '20:00';
  let crossMidnight = false;

  const timeParts = rawTime.split('-');
  const startRaw = timeParts[0].trim();
  const endRaw = timeParts[1] ? timeParts[1].trim() : null;

  function convertTo24Hour(timeStr) {
    const match = timeStr.toUpperCase().match(/(\d+)(?::(\d+))?\s*(AM|PM)/);
    if (!match) return null;
    
    let hours = parseInt(match[1], 10);
    const minutes = match[2] ? match[2].padStart(2, '0') : '00';
    const ampm = match[3];

    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    return { hours, minutes, formatted: `${String(hours).padStart(2, '0')}:${minutes}` };
  }

  const startParsed = convertTo24Hour(startRaw);
  if (startParsed) {
    startTimeIso = startParsed.formatted;

    if (endRaw) {
      // If the end time string lacks AM/PM (e.g., "8-9:30PM"), inherit it from the start string
      let normalizedEnd = endRaw;
      if (!normalizedEnd.includes('AM') && !normalizedEnd.includes('PM')) {
        const trailingAmpm = startRaw.toUpperCase().match(/(AM|PM)/);
        if (trailingAmpm) normalizedEnd += trailingAmpm[1];
      }
      const endParsed = convertTo24Hour(normalizedEnd);
      if (endParsed) {
        endTimeIso = endParsed.formatted;
      }
    } else {
      // Default fallback: Increment by exactly 1 hour if no end time exists
      let endHours = startParsed.hours + 1;
      if (endHours >= 24) {
        endHours -= 24;
        crossMidnight = true;
      }
      endTimeIso = `${String(endHours).padStart(2, '0')}:${startParsed.minutes}`;
    }
  }

  // Calculate clean end date strings if an event crosses the midnight hour line
  let endDateIso = startDateIso;
  if (crossMidnight) {
    const nextDate = new Date(`${startDateIso}T00:00:00`);
    nextDate.setDate(nextDate.getDate() + 1);
    endDateIso = nextDate.toISOString().split('T')[0];
  }

  return { startDateIso, endDateIso, startTimeIso, endTimeIso };
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);

  // Fetch and Process Data
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
            // Map over elements dynamically to pre-calculate standard calendar configurations
            const processedEvents = result.data.map(event => {
              const timing = transformEventDateTime(event.Date, event.Time);
              return {
                ...event,
                eventLinkUrl: normalizeUrl(event.EventLinkURL),
                eventLinkText: (event.EventLinkText || '').trim(),
                calendarProps: {
                  name: "Nicholas Jesse Campaign Event: " + event.Title,
                  description: event.Description || '',
                  location: event.Location || 'Laramie, WY',
                  startDate: timing.startDateIso,
                  endDate: timing.endDateIso,
                  startTime: timing.startTimeIso,
                  endTime: timing.endTimeIso,
                  timeZone: 'America/Denver'
                }
              };
            });

            setEvents(processedEvents);
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

  // Track screen size changes for responsive sliding tracks
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1150) {
        setCardsPerPage(1);
      } else {
        setCardsPerPage(2);
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const maxIndex = Math.max(0, events.length - cardsPerPage);
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [cardsPerPage, events.length, currentIndex]);

  if (isLoading) return <div className={styles.diagnosticState}>Loading campaign events...</div>;
  if (fetchError) return <div className={styles.diagnosticState}>Error connecting to the event calendar. Try again later.</div>;
  if (!events || events.length === 0) return <div className={styles.diagnosticState}>No upcoming events at this time. Check back soon!</div>;

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
                    <a href={event.LocationLink} target="_blank" rel="noopener noreferrer" className={styles.eventLocation}>
                      <strong>📍 {event.Location}</strong>
                    </a>
                    <p className={styles.eventDescription}>{event.Description}</p>

                    {/* Optional host website link — sits just below the description */}
                    {event.eventLinkUrl && (
                      <a
                        href={event.eventLinkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.eventLink}
                      >
                        {event.eventLinkText || 'Event Website'}
                        <svg
                          viewBox="0 0 24 24" width="15" height="15" fill="none"
                          stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </a>
                    )}

                    {/* Add-to-calendar button, pinned to the bottom of the card */}
                    <div className={styles.calendarButtonContainer}>
                      <CalendarButton {...event.calendarProps} />
                    </div>
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