'use client';

import dynamic from 'next/dynamic';

// 1. Import the button dynamically and turn off SSR for it
const AddToCalendarButtonClient = dynamic(
  () => import('add-to-calendar-button-react').then((mod) => mod.AddToCalendarButton),
  { ssr: false }
);

export default function CalendarButton({
  name,
  description,
  startDate,
  endDate,
  startTime = '07:00',
  endTime = '19:00',
  location = 'Your Polling Place, Laramie, WY',
  timeZone = 'America/Denver',
}) {
  return (
    <div style={{ marginTop: '1.25rem', display: 'block' }}>
      {/* 2. Use the dynamically loaded client-only button component */}
      <AddToCalendarButtonClient
        name={name}
        options={['Google', 'Apple', 'Outlook.com', 'Yahoo', 'Microsoft365', 'iCal']}
        location={location}
        startDate={startDate}
        endDate={endDate}
        startTime={startTime}
        endTime={endTime}
        timeZone={timeZone}
        description={description}
        buttonStyle="default" 
        lightMode="light"
        listStyle="dropdown"
        trigger="click"
        hideBackground={true} 
        size="s"
        hideBranding={true}
        forceOverlay={true}
        hideCheckmark={true}  
        styleLight="
          --font: inherit;
          --base-font-size-l: 1.1rem;
          --base-font-size-m: 1.1rem;
          --base-font-size-s: 0.95rem;
          --btn-font-weight: 700;
          --btn-border-radius: 8px;
          --btn-padding-x: 1.4rem;
          --btn-padding-y: 0.4rem;
          --btn-background: var(--brand-cream-light);
          --btn-text: var(--brand-olive);
          --btn-border: var(--brand-olive);
          --btn-shadow: none;
          --btn-hover-background: var(--brand-cream-light);
          --btn-hover-text: var(--brand-olive-dark);
          --btn-hover-border: var(--brand-olive-dark);
          --btn-hover-shadow: none;
          --btn-active-shadow: none;
        "
      />
    </div>
  );
}