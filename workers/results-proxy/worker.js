// Cloudflare Worker that watches the Albany County "Results of Election" page for
// the 2026 general election preliminary results, for the static /results page.
//
// GET /           → JSON: the matching report links (with a hash of each PDF) and
//                   when a report first changed from its first-seen version.
// GET /?pdf=<url> → our cached copy of one of those report PDFs, so the page can
//                   OCR it for vote totals without hitting the county site itself.
// Add ?demo to either to use the 2026 primary results, which are already posted.
//
// Every request goes through a single Durable Object that fetches the clerk page
// and each PDF at most once per 2 minutes, no matter how many people have
// /results open.
//
// Deploy (from this directory): npx wrangler login && npx wrangler deploy
// Then copy the *.workers.dev URL into PROXY_URL in src/app/results/page.js.

import { DurableObject } from 'cloudflare:workers';

const CLERK_URL = 'https://www.albanycountywy.gov/176/Results-of-Election';
const MAX_AGE = 2 * 60 * 1000;
const MAX_REPORTS = 4;
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (election-night results checker)' };

// Link text we're waiting for, e.g. "2026 General Election Preliminary Results".
const isResultsLink = (text) => /2026/.test(text) && /general/i.test(text) && /prelim|unofficial/i.test(text);
const isDemoLink = (text) => /2026/.test(text) && /primary/i.test(text);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

function findLinks(html, match) {
  const links = new Map();
  for (const [, attrs, inner] of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = attrs.match(/href="([^"]+)"/i)?.[1];
    const text = inner
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!href || !match(text)) continue;
    const url = new URL(href.replace(/&amp;/g, '&'), CLERK_URL).href;
    if (!links.has(url)) links.set(url, text);
  }
  return [...links].slice(0, MAX_REPORTS).map(([href, text]) => ({ href, text }));
}

async function fetchOk(url) {
  // Cache-busting query param so we never get a stale copy from the county's CDN.
  const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}_=${Date.now()}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`Clerk site returned ${res.status}`);
  return res;
}

async function sha256(buffer) {
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export class ClerkPage extends DurableObject {
  cached = null; // { at, ok, error?, reports, demoReports, changedAt }
  inflight = null;
  pdfs = new Map(); // href → { at, bytes } or { promise }

  async get() {
    this.cached ??= (await this.ctx.storage.get('state')) ?? null;
    if (this.cached && Date.now() - this.cached.at < MAX_AGE) return this.cached;
    // Requests that arrive while a refresh is in progress share it.
    this.inflight ??= this.refresh().finally(() => (this.inflight = null));
    return this.inflight;
  }

  async refresh() {
    let state;
    try {
      const html = await (await fetchOk(CLERK_URL)).text();
      const reports = findLinks(html, isResultsLink);
      for (const r of reports) {
        const bytes = await (await fetchOk(r.href)).arrayBuffer();
        this.pdfs.set(r.href, { at: Date.now(), bytes });
        r.hash = await sha256(bytes);
      }

      // Fallback for when the page can't OCR a report: the first reports we see
      // are assumed to be the empty report, so any later change (a report
      // re-uploaded, or a new one added) probably means results are in.
      let baseline = await this.ctx.storage.get('baseline');
      if (!baseline && reports.length) {
        baseline = Object.fromEntries(reports.map((r) => [r.href, r.hash]));
        await this.ctx.storage.put('baseline', baseline);
      }
      let changedAt = await this.ctx.storage.get('changedAt');
      if (!changedAt && baseline && reports.some((r) => baseline[r.href] !== r.hash)) {
        changedAt = Date.now();
        await this.ctx.storage.put('changedAt', changedAt);
      }

      state = {
        at: Date.now(),
        ok: true,
        reports,
        demoReports: findLinks(html, isDemoLink),
        changedAt: changedAt ?? null,
      };
    } catch (err) {
      // Cache failures too, so an outage doesn't turn into a retry storm.
      state = { ...this.cached, at: Date.now(), ok: false, error: String(err.message || err) };
    }
    this.cached = state;
    await this.ctx.storage.put('state', state);
    return state;
  }

  // Serve a report PDF, but only one currently linked from the clerk page.
  async pdf(href) {
    const state = await this.get();
    const known = [...(state.reports ?? []), ...(state.demoReports ?? [])].some((r) => r.href === href);
    if (!known) return null;
    let entry = this.pdfs.get(href);
    if (!entry || (entry.at && Date.now() - entry.at >= MAX_AGE)) {
      const promise = fetchOk(href)
        .then((res) => res.arrayBuffer())
        .then((bytes) => {
          this.pdfs.set(href, { at: Date.now(), bytes });
          return bytes;
        })
        .catch((err) => {
          this.pdfs.delete(href);
          throw err;
        });
      entry = { promise };
      this.pdfs.set(href, entry);
    }
    return entry.bytes ?? entry.promise;
  }

  async fetch(request) {
    const pdfHref = new URL(request.url).searchParams.get('pdf');
    if (pdfHref) {
      const bytes = await this.pdf(pdfHref);
      return bytes ? new Response(bytes, { headers: { 'Content-Type': 'application/pdf' } }) : new Response('Unknown report', { status: 404 });
    }
    return Response.json(await this.get());
  }
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }
    const url = new URL(request.url);
    const stub = env.CLERK_PAGE.get(env.CLERK_PAGE.idFromName('albany'));
    const pdfHref = url.searchParams.get('pdf');

    if (pdfHref) {
      try {
        const res = await stub.fetch(`https://clerk-page/?pdf=${encodeURIComponent(pdfHref)}`);
        return new Response(res.body, {
          status: res.status,
          headers: { ...CORS, 'Content-Type': res.headers.get('Content-Type'), 'Cache-Control': 'no-store' },
        });
      } catch (err) {
        return new Response(`Couldn't fetch report: ${err.message || err}`, { status: 502, headers: CORS });
      }
    }

    const state = await (await stub.fetch('https://clerk-page/')).json();
    const demo = url.searchParams.has('demo');
    const body = {
      ok: state.ok,
      error: state.error ?? null,
      ageMs: Date.now() - state.at,
      reports: (demo ? state.demoReports : state.reports) ?? [],
      changedAt: demo ? null : (state.changedAt ?? null),
    };
    return Response.json(body, { headers: { ...CORS, 'Cache-Control': 'no-store' } });
  },
};
