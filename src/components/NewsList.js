'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import MediaTile from './MediaTile';
import styles from './MediaTile.module.css';

const NEWS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS_dAfLY27rJtx-uNYiJ9oNZl3PBocF6DnfVpE5qi28KW--9Rw6Ty-7pD0gcskAYl6dYx8Nn-2If-SF/pub?gid=0&single=true&output=csv';

function normalizeUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

// Google Drive "share" links (drive.google.com/file/d/<id>/view) aren't
// directly loadable as an <img src>. If someone pastes one into the Image
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

// Dates in the sheet show up as either MM/DD/YYYY or MM/DD/YY - parse both
// so newest-first sorting works regardless of which format was typed in.
function parseUsDate(str) {
  if (!str) return null;
  const match = str.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!match) return null;
  const [, month, day, yearRaw] = match;
  const year = yearRaw.length === 2 ? `20${yearRaw}` : yearRaw;
  const date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Renders news coverage pulled from the published "News" sheet.
 *
 * @param {boolean} featuredOnly - only show rows where Featured === "Yes" (used for the homepage teaser)
 * @param {number} [limit] - cap the number of items shown
 * @param {boolean} [mosaic] - use the denser two-column mosaic layout (full media page) instead of the 3-across teaser row
 */
export default function NewsList({ featuredOnly = false, limit, mosaic = false }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(NEWS_CSV_URL);
        if (!res.ok) throw new Error('Failed to fetch');
        const csvText = await res.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const parsed = result.data
              .map((row) => ({
                title: (row.Title || '').trim(),
                link: normalizeUrl(row.Link),
                image: toDirectImageUrl(row.Image),
                date: (row.Date || '').trim(),
                featured: (row.Featured || '').trim().toLowerCase() === 'yes',
                sortDate: parseUsDate(row.Date),
              }))
              .filter((row) => row.title && row.link)
              .sort((a, b) => (b.sortDate?.getTime() || 0) - (a.sortDate?.getTime() || 0));
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
    fetchNews();
  }, []);

  if (isLoading) return <p className={styles.diagnosticState}>Loading news coverage...</p>;
  if (fetchError) return <p className={styles.diagnosticState}>Unable to load news coverage. Please try again later.</p>;

  let visible = featuredOnly ? items.filter((item) => item.featured) : items;
  if (limit) visible = visible.slice(0, limit);

  if (!visible.length) return <p className={styles.diagnosticState}>Media coverage coming soon!</p>;

  return (
    <div className={mosaic ? styles.mosaicGrid : styles.teaserGrid}>
      {visible.map((item, i) => (
        <MediaTile
          key={i}
          title={item.title}
          meta={item.date}
          href={item.link}
          image={item.image}
          wide={mosaic && i === 0}
        />
      ))}
    </div>
  );
}
