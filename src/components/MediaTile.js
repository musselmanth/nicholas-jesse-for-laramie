'use client';

import { useState } from 'react';
import styles from './MediaTile.module.css';

export default function MediaTile({ title, meta, href, image, logo, variant = 'card', wide }) {
  const [imageFailed, setImageFailed] = useState(false);
  const isList = variant === 'list';

  const externalIcon = (
    <svg
      className={isList ? styles.externalIconCorner : styles.externalIcon}
      viewBox="0 0 24 24" width="15" height="15" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  );

  const titleBlock = (
    <>
      <h3 className={styles.tileTitle}>
        <span>{title}</span>
        {!isList && externalIcon}
      </h3>
      {meta && <p className={styles.tileMeta}>{meta}</p>}
    </>
  );

  return (
    <div className={`${styles.tile} ${wide ? styles.tileWide : ''} ${isList ? styles.tileList : styles.tileCard}`}>
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
            {externalIcon}
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
            <div className={styles.cardContent}>{titleBlock}</div>
          </>
        )}
      </a>
    </div>
  );
}
