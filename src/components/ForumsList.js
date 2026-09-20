'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import MediaTile from './MediaTile';
import styles from './MediaTile.module.css';

const FORUMS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS_dAfLY27rJtx-uNYiJ9oNZl3PBocF6DnfVpE5qi28KW--9Rw6Ty-7pD0gcskAYl6dYx8Nn-2If-SF/pub?gid=1031605854&single=true&output=csv';

function normalizeUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

// Google Drive "share" links (drive.google.com/file/d/<id>/view) aren't
// directly loadable as an <img src>. If someone pastes one into the Logo
// column, rewrite it to the direct-view format instead of showing nothing.
function toDirectImageUrl(url) {
  const normalized = normalizeUrl(url);
  if (!normalized) return null;
  const driveMatch = normalized.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }
  return normalized;
}

/**
 * Renders the published "Questionnaires and Forums" sheet as a simple list
 * (each row shows its Logo, if provided, to the left of the entry).
 */
export default function ForumsList() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    async function fetchForums() {
      try {
        const res = await fetch(FORUMS_CSV_URL);
        if (!res.ok) throw new Error('Failed to fetch');
        const csvText = await res.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const parsed = result.data
              .map((row) => ({
                title: (row.Organization || '').trim(),
                link: normalizeUrl(row.Link),
                logo: toDirectImageUrl(row.Logo),
              }))
              .filter((row) => row.title && row.link);
            setItems(parsed);
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
    fetchForums();
  }, []);

  if (isLoading) return <p className={styles.diagnosticState}>Loading questionnaires &amp; forums...</p>;
  if (fetchError) return <p className={styles.diagnosticState}>Unable to load this content. Please try again later.</p>;
  if (!items.length) return <p className={styles.diagnosticState}>Coming soon!</p>;

  return (
    <div className={styles.listGrid}>
      {items.map((item, i) => (
        <MediaTile
          key={i}
          title={item.title}
          href={item.link}
          logo={item.logo}
          variant="list"
        />
      ))}
    </div>
  );
}
