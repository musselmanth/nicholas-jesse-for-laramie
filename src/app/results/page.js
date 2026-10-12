'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import { readBallotsCast } from './readBallots';

// URL of the Cloudflare Worker in workers/results-proxy/worker.js. The county site
// doesn't send CORS headers, so the browser can't read it directly.
const PROXY_URL = 'https://albany-results-proxy.nicojesse93.workers.dev';

const CLERK_URL = 'https://www.albanycountywy.gov/176/Results-of-Election';
const POLLS_CLOSE = Date.parse('2026-11-03T19:00:00-07:00');
const FIRST_PING = Date.parse('2026-11-03T20:30:00-07:00');
const PING_INTERVAL = 2 * 60 * 1000;
const FETCH_TIMEOUT = 25 * 1000;

const mtTime = (t, withSeconds = true) =>
  new Date(t).toLocaleTimeString('en-US', {
    timeZone: 'America/Denver',
    hour: 'numeric',
    minute: '2-digit',
    ...(withSeconds && { second: '2-digit' }),
  });

function splitDuration(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

const pad = (n) => String(n).padStart(2, '0');

function Countdown({ ms }) {
  const { days, hours, minutes, seconds } = splitDuration(ms);
  const units = [
    ...(days > 0 ? [[days, days === 1 ? 'day' : 'days']] : []),
    [hours, 'hours'],
    [minutes, 'min'],
    [seconds, 'sec'],
  ];
  return (
    <div className={styles.countdown} role="timer">
      {units.map(([value, label], i) => (
        <div key={label} className={styles.unitWrap}>
          {i > 0 && <span className={styles.colon}>:</span>}
          <div className={styles.unit}>
            <span className={styles.digits}>{label.startsWith('day') ? value : pad(value)}</span>
            <span className={styles.unitLabel}>{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function PingRing({ remaining, checking }) {
  const r = 120;
  const circumference = 2 * Math.PI * r;
  const progress = checking ? 1 : 1 - remaining / PING_INTERVAL;
  const secs = Math.max(0, Math.ceil(remaining / 1000));
  return (
    <div className={`${styles.ring} ${checking ? styles.ringChecking : ''}`}>
      <svg viewBox="0 0 280 280" aria-hidden="true">
        <circle cx="140" cy="140" r={r} className={styles.ringTrack} />
        <circle
          cx="140"
          cy="140"
          r={r}
          className={styles.ringBar}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
        />
      </svg>
      <div className={styles.ringCenter}>
        {checking ? (
          <span className={styles.ringCheckingText}>Checking…</span>
        ) : (
          <>
            <span className={styles.ringDigits}>
              {Math.floor(secs / 60)}:{pad(secs % 60)}
            </span>
            <span className={styles.unitLabel}>next check</span>
          </>
        )}
      </div>
    </div>
  );
}

function CountyBadge() {
  return (
    <div className={styles.badge}>
      <span className={styles.badgeCounty}>Albany County</span>
      <span className={styles.badgeState}>Wyoming · General Election 2026</span>
    </div>
  );
}

// Deterministic confetti so render stays pure.
const CONFETTI = Array.from({ length: 60 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: ((i * 53) % 40) / 10,
  duration: 3 + ((i * 29) % 30) / 10,
  color: ['#ffd23f', '#ff3b5c', '#3bceff', '#ffffff', '#7cff6b'][i % 5],
  rotate: (i * 71) % 360,
}));

export default function ResultsPage() {
  const [now, setNow] = useState(null);
  const [demo, setDemo] = useState(false);
  const [checking, setChecking] = useState(false);
  const [nextPingAt, setNextPingAt] = useState(null);
  const [lastCheck, setLastCheck] = useState(null); // { at, ok, error }
  const [checkCount, setCheckCount] = useState(0);
  const [results, setResults] = useState(null);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const offsetRef = useRef(0);
  const demoRef = useRef(false);
  const checkingRef = useRef(false);
  const nextPingRef = useRef(0);
  const foundRef = useRef(false);

  useEffect(() => {
    // ?demo starts checking right away and matches the posted primary results.
    // ?at=2026-11-03T18:59:50-07:00 pretends the page was opened at that time.
    const params = new URLSearchParams(window.location.search);
    demoRef.current = params.has('demo');
    const at = Date.parse(params.get('at') || '');
    offsetRef.current = Number.isNaN(at) ? 0 : at - Date.now();
    const clock = () => Date.now() + offsetRef.current;
    const firstPing = demoRef.current ? -Infinity : FIRST_PING;

    // Ballots counted in each report version we've read, by PDF hash (or link in demo mode).
    const ballotsRead = new Map();

    async function readReport(report) {
      const key = report.hash ?? report.href;
      if (!ballotsRead.has(key)) {
        const params = `${demoRef.current ? 'demo&' : ''}pdf=${encodeURIComponent(report.href)}`;
        const res = await fetch(`${PROXY_URL}?${params}`, { cache: 'no-store', signal: AbortSignal.timeout(FETCH_TIMEOUT) });
        if (!res.ok) throw new Error(`Couldn't download the report (${res.status})`);
        ballotsRead.set(key, await readBallotsCast(new Uint8Array(await res.arrayBuffer())));
      }
      return ballotsRead.get(key);
    }

    async function check() {
      checkingRef.current = true;
      setChecking(true);
      // When the worker's shared view of the clerk site was fetched.
      let fetchedAt = clock();
      try {
        if (!PROXY_URL) throw new Error('Results proxy not configured');
        const res = await fetch(`${PROXY_URL}?${demoRef.current ? 'demo&' : ''}_=${Date.now()}`, {
          cache: 'no-store',
          signal: AbortSignal.timeout(FETCH_TIMEOUT),
        });
        if (!res.ok) throw new Error(`Results proxy returned ${res.status}`);
        const data = await res.json();
        fetchedAt = clock() - (data.ageMs || 0);
        if (!data.ok) throw new Error(data.error);

        // The county posts an empty report before there are votes in it, so OCR
        // each report for its ballot count. null means OCR couldn't find it.
        const ballots = await Promise.all(data.reports.map(readReport));
        const known = ballots.filter((b) => b !== null);
        const counted = known.length ? Math.max(...known) : null;
        // If OCR can't read a report, fall back to the worker noticing it changed.
        const changed = data.changedAt && !(ballots.length && ballots.every((b) => b === 0));
        if (counted > 0 || changed) {
          foundRef.current = true;
          setResults({
            links: data.reports,
            ballots: counted,
            at: counted > 0 ? fetchedAt : data.changedAt + offsetRef.current,
          });
        }
        setLastCheck({ at: fetchedAt, ok: true, posted: data.reports.length > 0, counted });
      } catch (err) {
        setLastCheck({ at: fetchedAt, ok: false, error: err.name === 'TimeoutError' ? 'Request timed out' : err.message });
      } finally {
        setCheckCount((c) => c + 1);
        // Check again just after the worker's copy expires, so every open page
        // picks up each fresh copy within seconds of the worker fetching it.
        nextPingRef.current = Math.max(fetchedAt + PING_INTERVAL + 3000, clock() + 10000);
        setNextPingAt(nextPingRef.current);
        checkingRef.current = false;
        setChecking(false);
      }
    }

    const tick = () => {
      const t = clock();
      setNow(t);
      setDemo(demoRef.current);
      if (t >= firstPing && !foundRef.current && !checkingRef.current && t >= nextPingRef.current) {
        check();
      }
    };

    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 250);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  // Keep the screen awake on the party TV.
  useEffect(() => {
    let lock;
    const request = async () => {
      try {
        if (document.visibilityState === 'visible') lock = await navigator.wakeLock?.request('screen');
      } catch {}
    };
    request();
    document.addEventListener('visibilitychange', request);
    return () => {
      document.removeEventListener('visibilitychange', request);
      lock?.release().catch(() => {});
    };
  }, []);

  // Flash the tab title once results are in.
  useEffect(() => {
    if (!results) return;
    let on = false;
    const id = setInterval(() => {
      on = !on;
      document.title = on ? '🚨 RESULTS ARE IN! 🚨' : 'Albany County, WY Results Watch';
    }, 1000);
    return () => clearInterval(id);
  }, [results]);

  // Track full screen state so the button label stays right when Esc exits it.
  useEffect(() => {
    const sync = () => {
      setCanFullscreen(document.fullscreenEnabled);
      setFullscreen(Boolean(document.fullscreenElement));
    };
    const first = setTimeout(sync, 0);
    document.addEventListener('fullscreenchange', sync);
    return () => {
      clearTimeout(first);
      document.removeEventListener('fullscreenchange', sync);
    };
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen().catch(() => {});
  };

  if (now === null) return <main className={styles.page} />;

  const polling = demo || now >= FIRST_PING;

  const header = (
    <header className={styles.topBar}>
      <span className={styles.live}>
        <span className={styles.liveDot} />
        Election Night 2026
      </span>
      {demo && <span className={styles.demoBadge}>Demo mode</span>}
      <span className={styles.topRight}>
        <span className={styles.clock}>{mtTime(now)} MT</span>
        {canFullscreen && (
          <button
            type="button"
            className={styles.fullscreenButton}
            onClick={toggleFullscreen}
            aria-label={fullscreen ? 'Exit full screen' : 'Enter full screen'}
            title={fullscreen ? 'Exit full screen' : 'Full screen'}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d={
                  fullscreen
                    ? 'M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6'
                    : 'M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6'
                }
              />
            </svg>
          </button>
        )}
      </span>
    </header>
  );

  if (results) {
    return (
      <main className={`${styles.page} ${styles.found}`}>
        <div className={styles.confetti} aria-hidden="true">
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              style={{
                left: `${c.left}%`,
                background: c.color,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`,
                rotate: `${c.rotate}deg`,
              }}
            />
          ))}
        </div>
        {header}
        <div className={styles.foundContent}>
          <CountyBadge />
          <p className={styles.kicker}>Posted {mtTime(results.at, false)} MT</p>
          <h1 className={styles.foundTitle}>Results are in!</h1>
          {results.ballots > 0 && (
            <p className={styles.ballots}>{results.ballots.toLocaleString('en-US')} ballots counted</p>
          )}
          <div className={styles.foundLinks}>
            {results.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={styles.resultButton}>
                {l.text}
                <span aria-hidden="true"> →</span>
              </a>
            ))}
          </div>
        </div>
      </main>
    );
  }

  let kicker, heading, body;
  if (polling) {
    kicker = 'Polls are closed';
    heading = 'Watching for results';
    body = (
      <>
        <PingRing remaining={nextPingAt === null ? 0 : nextPingAt - now} checking={checking} />
        <p className={styles.status} aria-live="polite">
          {lastCheck === null
            ? 'Starting first check…'
            : lastCheck.ok
              ? `${!lastCheck.posted ? 'No results yet' : lastCheck.counted === 0 ? 'Report posted · 0 ballots counted so far' : "Report posted but couldn't read it yet"} · last checked ${mtTime(lastCheck.at)} · check #${checkCount}`
              : `Couldn't reach the Albany County Clerk site (${lastCheck.error}) · retrying · check #${checkCount}`}
        </p>
      </>
    );
  } else if (now < POLLS_CLOSE) {
    kicker = 'Election Day · Tuesday, November 3';
    heading = 'Polls close in';
    body = (
      <>
        <Countdown ms={POLLS_CLOSE - now} />
        <p className={styles.status}>Polls close at 7:00 PM MT across Albany County</p>
      </>
    );
  } else {
    kicker = 'Polls are closed!';
    heading = 'Checking for results in';
    body = (
      <>
        <Countdown ms={FIRST_PING - now} />
        <p className={styles.status}>We&apos;ll start checking the Albany County Clerk&apos;s site every 2 minutes at 8:30 PM MT</p>
      </>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.glowA} aria-hidden="true" />
      <div className={styles.glowB} aria-hidden="true" />
      {header}
      <section className={styles.content}>
        <CountyBadge />
        <p className={styles.kicker}>{kicker}</p>
        <h1 className={styles.heading}>{heading}</h1>
        {body}
      </section>
      <footer className={styles.footer}>
        <a href={CLERK_URL} target="_blank" rel="noopener noreferrer">
          Albany County Clerk · Results of Election ↗
        </a>
      </footer>
    </main>
  );
}
