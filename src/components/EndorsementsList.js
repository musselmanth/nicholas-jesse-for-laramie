'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import styles from '@/app/(main)/endorsements/Endorsements.module.css';

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSoitHJ31CAvtUhWnEP530DtYQcH9AKHO-nkw2gMDMMGQhibL0OgV_57MPHPUIeF-Xu789QjlRGEIle/pub?gid=0&single=true&output=csv';

function normalizeUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export default function EndorsementsList() {
  const [endorsements, setEndorsements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    async function fetchEndorsements() {
      try {
        const res = await fetch(SHEET_CSV_URL);
        if (!res.ok) throw new Error('Failed to fetch');
        const csvText = await res.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setEndorsements(result.data);
            setIsLoading(false);
          },
          error: () => {
            setFetchError(true);
            setIsLoading(false);
          },
        });
      } catch {
        setFetchError(true);
        setIsLoading(false);
      }
    }
    fetchEndorsements();
  }, []);

  if (isLoading) return <p className={styles.diagnosticState}>Loading endorsements...</p>;
  if (fetchError) return <p className={styles.diagnosticState}>Unable to load endorsements. Please try again later.</p>;
  if (!endorsements.length) return <p className={styles.diagnosticState}>Endorsements coming soon!</p>;

  return (
    <div className={styles.grid}>
      {endorsements.map((e, i) => {
        const link = normalizeUrl(e.Link);
        return (
          <div key={i} className={styles.card}>
            <p className={styles.endorserName}>{e.Name}</p>
            {e.Title && <p className={styles.endorserTitle}>{e.Title}</p>}
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.endorserLink}
              >
                Learn more
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
