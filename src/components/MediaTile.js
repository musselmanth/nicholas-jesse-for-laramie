'use client';

import { useState } from 'react';
import styles from './MediaTile.module.css';

// The source sheets don't carry a "social share" column, so instead we give
// every tile its own share link (built from the article URL) so visitors
// can push individual pieces of coverage out to Facebook themselves.
function buildShareLinks(href) {
  const url = encodeURIComponent(href);
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  };
}

export default function MediaTile({ title, meta, href, image, logo, variant = 'card', wide }) {
  const { facebook } = buildShareLinks(href);
  const [imageFailed, setImageFailed] = useState(false);
  const isList = variant === 'list';

  const titleBlock = (
    <>
      <h3 className={styles.tileTitle}>
        <span>{title}</span>
        <svg
          className={styles.externalIcon}
          viewBox="0 0 24 24" width="15" height="15" fill="none"
          stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </h3>
      {meta && <p className={styles.tileMeta}>{meta}</p>}
    </>
  );

  return (
    <div className={`${styles.tile} ${wide ? styles.tileWide : ''} ${isList ? styles.tileList : ''}`}>
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles.tileLink}>
        {isList ? (
          <>
            {logo && !imageFailed && (
              <img
                src={logo}
                alt=""
                className={styles.tileLogo}
                loading="lazy"
                onError={() => setImageFailed(true)}
              />
            )}
            <div className={styles.listContent}>{titleBlock}</div>
          </>
        ) : (
          <>
            {image && !imageFailed && (
              <img
                src={image}
                alt=""
                className={styles.tileImage}
                loading="lazy"
                onError={() => setImageFailed(true)}
              />
            )}
            {titleBlock}
          </>
        )}
      </a>

      <div className={styles.shareRow}>
        <span className={styles.shareLabel}>Share</span>
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share "${title}" on Facebook`}
          className={styles.shareBtn}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
