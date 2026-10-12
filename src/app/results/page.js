'use client';

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import { readReport } from './readReport';

// URL of the Cloudflare Worker in workers/results-proxy/worker.js. The county site
// doesn't send CORS headers, so the browser can't read it directly.
const PROXY_URL = 'https://albany-results-proxy.nicojesse93.workers.dev';

const CLERK_URL = 'https://www.albanycountywy.gov/176/Results-of-Election';
const POLLS_CLOSE = Date.parse('2026-11-03T19:00:00-07:00');
const FIRST_PING = Date.parse('2026-11-03T20:30:00-07:00');
const PING_INTERVAL = 2 * 60 * 1000;
const FETCH_TIMEOUT = 25 * 1000;
const CELEBRATE_MS = 10 * 1000;

// ?demo=sample shows the races from the county's 2024 general election-night report.
const SAMPLE_REPORT = { href: '/results-sample.pdf', text: '2024 General Election Results UNOFFICIAL (sample)' };

// Races to show: local races and the state legislature, grouped in this order.
// Federal, statewide (including statewide ballot initiatives), party precinct and
// judge retention races are left out.
const HIDDEN_RACES = /UNITED STATES|GOVERNOR|SECRETARY OF STATE|STATE AUDITOR|STATE TREASURER|SUPERINTENDENT OF PUBLIC INSTRUCTION|PRECINCT COMMITTEE|CONSTITUTIONAL AMENDMENT|INITIATIVE|REFERENDUM|JUDGE|JUSTICE|JUDICIAL/i;
const RACE_GROUPS = [
  ['Laramie City Council', /CITY COUNCIL|MAYOR|CITY OF/i],
  ['Albany County', /COUNTY|CLERK OF THE DISTRICT COURT/i],
  ['Local Districts', /SCHOOL|HOSPITAL|FIRE|CONSERVATION|DISTRICT NO|CEMETERY|SPECIAL DISTRICT/i],
  ['State Legislature', /STATE SENATOR|STATE REPRESENTATIVE/i],
  ['Other Local Races', /./],
];

function groupRaces(races) {
  const groups = RACE_GROUPS.map(([name]) => ({ name, races: [] }));
  for (const race of races) {
    if (HIDDEN_RACES.test(race.title)) continue;
    groups[RACE_GROUPS.findIndex(([, re]) => re.test(race.title))].races.push(race);
  }
  return groups.filter((g) => g.races.length);
}

// "08/18/2026 09:57PM" → "9:57 PM"
function reportTime(asOf) {
  const m = asOf?.match(/(\d\d?):(\d\d)\s?([AP]M)/i);
  return m ? `${Number(m[1])}:${m[2]} ${m[3].toUpperCase()}` : null;
}

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

// Small ring that fills up until the next check, and spins while checking.
function PingRing({ remaining, checking }) {
  const r = 9;
  const circumference = 2 * Math.PI * r;
  const progress = checking ? 0.25 : 1 - remaining / PING_INTERVAL;
  return (
    <svg viewBox="0 0 24 24" className={`${styles.ring} ${checking ? styles.ringChecking : ''}`} aria-hidden="true">
      <circle cx="12" cy="12" r={r} className={styles.ringTrack} />
      <circle
        cx="12"
        cy="12"
        r={r}
        className={styles.ringBar}
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - progress)}
      />
    </svg>
  );
}

// General election reports prefix some names with a party, e.g. "DEM KAMALA D. HARRIS".
const party = (name) => name.match(/^(DEM|REP|LIB|CON|CST|IND|GRN|LBT)\s+(.+)$/);

function RaceCard({ race }) {
  const fmt = (n) => n.toLocaleString('en-US');
  const ranked = [...race.candidates].sort((a, b) => b.votes - a.votes);
  const max = Math.max(1, ...ranked.map((c) => c.votes));
  const pct = (votes) => (race.totalVotes ? `${((votes / race.totalVotes) * 100).toFixed(1)}%` : '—');
  return (
    <article className={styles.raceCard}>
      <h3 className={styles.raceTitle}>{race.title}</h3>
      <p className={styles.raceMeta}>
        Vote for {race.voteFor}
        {race.totalVotes > 0 && ` · ${fmt(race.totalVotes)} votes`}
      </p>
      {!race.valid ? (
        <p className={styles.raceError}>These numbers didn&apos;t add up when read from the county&apos;s report. Check the PDF.</p>
      ) : (
        <ol className={styles.candidates}>
          {ranked.map((c, i) => {
            const leading = race.totalVotes > 0 && i < race.voteFor && c.votes > 0;
            return (
              <li key={c.name} className={`${styles.candidate} ${leading ? styles.leading : ''}`}>
                <div className={styles.candidateRow}>
                  <span className={styles.candidateName}>
                    {party(c.name) && <span className={styles.party}>{party(c.name)[1]}</span>}
                    {party(c.name)?.[2] ?? c.name}
                  </span>
                  <span className={styles.candidateVotes}>
                    {fmt(c.votes)} <span className={styles.candidatePct}>{pct(c.votes)}</span>
                  </span>
                </div>
                <div className={styles.bar}>
                  <span style={{ width: `${(c.votes / max) * 100}%` }} />
                </div>
              </li>
            );
          })}
          {(race.writeIn > 0 || !ranked.length) && (
            <li className={`${styles.candidate} ${styles.writeIn}`}>
              <div className={styles.candidateRow}>
                <span className={styles.candidateName}>{ranked.length ? 'Write-ins' : 'Write-ins only'}</span>
                <span className={styles.candidateVotes}>
                  {fmt(race.writeIn ?? 0)} <span className={styles.candidatePct}>{pct(race.writeIn ?? 0)}</span>
                </span>
              </div>
            </li>
          )}
        </ol>
      )}
    </article>
  );
}

// The race results. On big screens (e.g. projected at the party) the text is
// scaled to the largest size where every race fits without scrolling; on
// phones it's a normal scrolling page.
const FIT_MIN_WIDTH = 900;
const FIT_FONT_SIZES = [9, 30]; // px, the range to search

function RaceBoard({ results, groups, asOf, pdfLinks }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const fits = () => document.scrollingElement.scrollHeight <= window.innerHeight;
    const fit = () => {
      if (window.innerWidth < FIT_MIN_WIDTH) {
        el.style.fontSize = '';
        return;
      }
      let [lo, hi] = FIT_FONT_SIZES;
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2;
        el.style.fontSize = `${mid}px`;
        if (fits()) lo = mid;
        else hi = mid;
      }
      el.style.fontSize = `${lo}px`;
    };
    fit();
    // Refit once the display font has loaded, and whenever the window changes size.
    document.fonts?.ready.then(fit);
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [results]);

  return (
    <div ref={ref} className={styles.board}>
      <section className={styles.dashHead}>
        <div>
          <p className={styles.dashKicker}>
            {results.status === 'OFFICIAL' ? 'Official results' : 'Unofficial results'}
            {asOf && ` · as of ${asOf}`}
            {results.ballots > 0 && ` · ${results.ballots.toLocaleString('en-US')} ballots counted`}
          </p>
          <h1 className={styles.dashTitle}>
            <span className={styles.nowrap}>Local Election Results</span> ·{' '}
            <span className={styles.nowrap}>Albany County</span>
          </h1>
        </div>
        <div className={styles.dashLinks}>{pdfLinks}</div>
      </section>
      {/* Cards flow through newspaper-style columns so short and tall races pack together. */}
      <div className={styles.raceFlow}>
        {groups.map((g) =>
          // Keyed by position: some races share a title (e.g. a full and an unexpired term).
          g.races.map((r, i) =>
            i === 0 ? (
              <div key={`${g.name}-${i}`} className={styles.keepTogether}>
                <h2 className={styles.groupTitle}>{g.name}</h2>
                <RaceCard race={r} />
              </div>
            ) : (
              <RaceCard key={`${g.name}-${i}`} race={r} />
            ),
          ),
        )}
      </div>
    </div>
  );
}

function CountyBadge({ title = 'Albany County', subtitle = 'Wyoming · General Election 2026', large = false }) {
  return (
    <div className={`${styles.badge} ${large ? styles.badgeLarge : ''}`}>
      <span className={styles.badgeCounty}>{title}</span>
      <span className={styles.badgeState}>
        {/* Keep each part on one line so narrow screens break at the dot. */}
        {subtitle.split(' · ').map((part, i) => (
          <Fragment key={part}>
            {i > 0 && ' · '}
            <span className={styles.nowrap}>{part}</span>
          </Fragment>
        ))}
      </span>
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
  const [celebrateUntil, setCelebrateUntil] = useState(0);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const offsetRef = useRef(0);
  const demoRef = useRef(false);
  const checkingRef = useRef(false);
  const nextPingRef = useRef(0);
  const foundRef = useRef(false);
  // Whether a check has come back without results, i.e. we're watching them arrive live.
  const waitedRef = useRef(false);

  useEffect(() => {
    // ?demo=sample shows the 2024 sample report right away, without the county site.
    // ?at=2026-11-03T18:59:50-07:00 pretends the page was opened at that time.
    const params = new URLSearchParams(window.location.search);
    const sample = params.get('demo') === 'sample';
    demoRef.current = sample;
    const at = Date.parse(params.get('at') || '');
    offsetRef.current = Number.isNaN(at) ? 0 : at - Date.now();
    const clock = () => Date.now() + offsetRef.current;
    const firstPing = sample ? -Infinity : FIRST_PING;

    // Which election's report we're waiting for.
    const election = sample ? /\d{4} General/i : /2026 General/i;
    // For a scanned report we can't read the election name, so go by the link text.
    const scanLinkMatches = (text) => /2026/.test(text) && /general/i.test(text);

    // What we read from each report version, by PDF hash (or link when there's no hash).
    const reads = new Map();

    function read(report) {
      const key = report.hash ?? report.href;
      if (!reads.has(key)) {
        const url = sample ? report.href : `${PROXY_URL}?pdf=${encodeURIComponent(report.href)}`;
        const promise = fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(FETCH_TIMEOUT) })
          .then((res) => {
            if (!res.ok) throw new Error(`Couldn't download the report (${res.status})`);
            return res.arrayBuffer();
          })
          .then((bytes) => readReport(new Uint8Array(bytes)));
        // Retry failed downloads on the next check.
        promise.catch(() => reads.delete(key));
        reads.set(key, promise);
      }
      return reads.get(key);
    }

    async function check() {
      checkingRef.current = true;
      setChecking(true);
      // When the worker's shared view of the clerk site was fetched.
      let fetchedAt = clock();
      try {
        let data;
        if (sample) {
          data = { ok: true, ageMs: 0, reports: [SAMPLE_REPORT], changedAt: null };
        } else {
          if (!PROXY_URL) throw new Error('Results proxy not configured');
          const res = await fetch(`${PROXY_URL}?_=${Date.now()}`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(FETCH_TIMEOUT),
          });
          if (!res.ok) throw new Error(`Results proxy returned ${res.status}`);
          data = await res.json();
        }
        fetchedAt = clock() - (data.ageMs || 0);
        if (!data.ok) throw new Error(data.error);

        // The county posts an empty report before there are votes in it, so read
        // each report and only count it once it shows ballots cast.
        const reports = (await Promise.all(data.reports.map(async (r) => ({ ...r, ...(await read(r)) })))).filter((r) =>
          r.hasText ? election.test(r.election ?? '') : scanLinkMatches(r.text),
        );
        const counted = reports.filter((r) => r.ballotsCast > 0);
        // Prefer a report we could read in full, then the one with the most ballots.
        const best = counted.sort((a, b) => (b.races?.length ?? 0) - (a.races?.length ?? 0) || b.ballotsCast - a.ballotsCast)[0];
        // If a scanned report couldn't be read at all, fall back to the worker noticing it changed.
        const unreadable = reports.some((r) => !r.hasText && r.ballotsCast === null);
        const changed = !best && data.changedAt && unreadable;

        if (best || changed) {
          foundRef.current = true;
          // Only celebrate if we were here when the results arrived; someone opening
          // the page after they're posted goes straight to the races.
          if (waitedRef.current || sample) setCelebrateUntil(clock() + CELEBRATE_MS);
          setResults({
            links: reports.map(({ href, text }) => ({ href, text })),
            ballots: best?.ballotsCast ?? null,
            races: best?.races ?? [],
            status: best?.status ?? null,
            asOf: best?.asOf ?? null,
            at: best ? fetchedAt : data.changedAt + offsetRef.current,
          });
        }
        const known = reports.map((r) => r.ballotsCast).filter((b) => b !== null);
        if (!foundRef.current) waitedRef.current = true;
        setLastCheck({ at: fetchedAt, ok: true, posted: reports.length > 0, counted: known.length ? Math.max(...known) : null });
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
      // The county posts results once they're all counted, so stop checking once we have them.
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

  // Flash the tab title for 30 seconds when results come in or update.
  // Only for results that arrived while the page was open (the same ones that get the celebration).
  const resultsKey = results && celebrateUntil ? `${results.at}|${results.asOf}` : null;
  useEffect(() => {
    if (!resultsKey) return;
    const title = 'Albany County, WY Results Watch';
    let on = false;
    const id = setInterval(() => {
      on = !on;
      document.title = on ? '🚨 RESULTS ARE IN! 🚨' : title;
    }, 1000);
    const stop = setTimeout(() => {
      clearInterval(id);
      document.title = title;
    }, 30 * 1000);
    return () => {
      clearInterval(id);
      clearTimeout(stop);
      document.title = title;
    };
  }, [resultsKey]);

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
    const groups = groupRaces(results.races);
    const asOf = reportTime(results.asOf);
    const revealIn = Math.max(1, Math.ceil((celebrateUntil - now) / 1000));
    const pdfLinks = results.links.map((l) => (
      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={styles.resultButton}>
        {l.text}
        <span aria-hidden="true"> →</span>
      </a>
    ));

    if (now < celebrateUntil || !groups.length) {
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
            {groups.length > 0 ? (
              <div className={styles.reveal} role="timer">
                <span>Revealing the races in</span>
                {/* Keyed so the pop animation replays every second. */}
                <span key={revealIn} className={styles.revealNum}>
                  {revealIn}
                </span>
              </div>
            ) : (
              <div className={styles.foundLinks}>{pdfLinks}</div>
            )}
          </div>
        </main>
      );
    }

    return (
      <main className={styles.page}>
        <div className={styles.glowA} aria-hidden="true" />
        <div className={styles.glowB} aria-hidden="true" />
        {header}
        <RaceBoard results={results} groups={groups} asOf={asOf} pdfLinks={pdfLinks} />
      </main>
    );
  }

  let kicker, heading, body;
  if (polling) {
    kicker = 'Polls are closed · Watching for results';
    heading = null;
    const nextIn = Math.max(0, Math.ceil(((nextPingAt ?? now) - now) / 1000));
    let statusMain = 'Starting first check…';
    let statusSub = null;
    if (lastCheck?.ok) {
      statusMain = !lastCheck.posted
        ? 'No results yet'
        : lastCheck.counted === 0
          ? 'Empty report posted · 0 ballots counted'
          : "Report posted, but we couldn't read it yet";
      statusSub = `Last checked ${mtTime(lastCheck.at, false)} MT`;
    } else if (lastCheck) {
      statusMain = "Couldn't reach the clerk's site";
      statusSub = `${lastCheck.error} · will try again`;
    }
    body = (
      <>
        <div className={styles.statusBlock} aria-live="polite">
          <p className={styles.statusMain}>{statusMain}</p>
          {statusSub && <p className={styles.statusSub}>{statusSub}</p>}
        </div>
        <p className={styles.nextCheck}>
          <PingRing remaining={nextPingAt === null ? 0 : nextPingAt - now} checking={checking} />
          {checking ? 'Checking now…' : `Next check in ${Math.floor(nextIn / 60)}:${pad(nextIn % 60)}`}
          {checkCount > 0 && <span className={styles.checkCount}>· check #{checkCount}</span>}
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
        <CountyBadge title="Local Election Results" subtitle="Albany County, Wyoming · General Election 2026" large />
        <p className={styles.kicker}>{kicker}</p>
        {heading && <h1 className={styles.heading}>{heading}</h1>}
        {body}
      </section>
      <footer className={styles.footer}>
        <p className={styles.footerNote}>
          This page will display election results for local races as soon as they&apos;re uploaded to the{' '}
          <a href={CLERK_URL} target="_blank" rel="noopener noreferrer">
            Albany County Clerk website ↗
          </a>
        </p>
      </footer>
    </main>
  );
}
