// Verify the live Link response headers on https://askmilo.pro/ — the same
// fetch the isitagentready scanner runs for checks.discoverability.linkHeaders
// (GET /, then look for a Link header on the response), evaluated against this
// issue's bar: at least one parseable RFC 8288 link carrying a registered
// discovery rel, and no drift from the canonical set in
// scripts/link-headers.mjs.
//
// Usage:
//   node scripts/verify-link-headers.mjs              # report, exit 1 on fail
//   node scripts/verify-link-headers.mjs --json       # machine-readable result
//   node scripts/verify-link-headers.mjs --url <url>  # check a different URL
//
// Pure functions are exported for tests (tests/link-headers.test.mjs);
// network only happens in main().

import { pathToFileURL } from 'node:url';

import {
  DOMAIN,
  HOME_URL,
  LINK_TARGETS,
  REGISTERED_RELS,
} from './link-headers.mjs';

// ---------------------------------------------------------------------------
// RFC 8288 Link header parsing
// ---------------------------------------------------------------------------

// Split a Link header field value into its link-values on top-level commas —
// a comma inside <...> or a "quoted-string" does not separate links.
export function splitLinkValues(value) {
  const parts = [];
  let depth = 0; // inside <...>
  let quoted = false;
  let start = 0;
  for (let i = 0; i < value.length; i += 1) {
    const c = value[i];
    if (quoted) {
      if (c === '"') quoted = false;
      else if (c === '\\') i += 1; // quoted-pair
    } else if (c === '"') {
      quoted = true;
    } else if (c === '<') {
      depth += 1;
    } else if (c === '>') {
      depth = Math.max(0, depth - 1);
    } else if (c === ',' && depth === 0) {
      parts.push(value.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(value.slice(start));
  return parts.map((p) => p.trim()).filter(Boolean);
}

// Parse one link-value: <target> *( ";" param ). Returns
// { target, params, rels[] } or null when the <target> form is absent.
export function parseLinkValue(linkValue) {
  const m = linkValue.match(/^\s*<([^>]*)>\s*(.*)$/);
  if (!m) return null;
  const [, target, rest] = m;
  const params = {};
  if (rest.trim()) {
    if (!rest.trimStart().startsWith(';')) return null;
    for (const seg of rest.split(';')) {
      const segTrim = seg.trim();
      if (!segTrim) continue;
      const eq = segTrim.indexOf('=');
      const name = (eq === -1 ? segTrim : segTrim.slice(0, eq)).trim();
      let val = eq === -1 ? '' : segTrim.slice(eq + 1).trim();
      if (val.startsWith('"') && val.endsWith('"') && val.length >= 2) {
        val = val.slice(1, -1).replace(/\\(.)/g, '$1');
      }
      params[name.toLowerCase()] = val;
    }
  }
  const rels = typeof params.rel === 'string'
    ? params.rel.split(/\s+/).filter(Boolean)
    : [];
  return { target, params, rels };
}

// Parse a whole Link header field value into link objects.
export function parseLinkHeader(value) {
  if (typeof value !== 'string' || !value.trim()) return [];
  return splitLinkValues(value)
    .map(parseLinkValue)
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Header-set evaluation
// ---------------------------------------------------------------------------

// values: the Link header field values seen on the response (one entry per
// Link header line, or one entry holding the comma-joined form — both are
// valid per the guide and both parse the same here).
// Returns the scanner-shaped result plus this issue's verdict fields.
export function evaluateLinkHeaders(values, expected = LINK_TARGETS) {
  const links = (values ?? []).flatMap(parseLinkHeader);
  const registered = [];
  for (const link of links) {
    for (const rel of link.rels) {
      if (REGISTERED_RELS.includes(rel)) {
        registered.push({ rel, target: link.target });
      }
    }
  }

  // Does the live header carry our published intent? Match each expected
  // target by path (relative target) or absolute URL, then require its rel.
  const drift = [];
  for (const want of expected) {
    const live = links.find(
      (l) => l.target === want.path || l.target === `${HOME_URL.replace(/\/$/, '')}${want.path}`,
    );
    if (!live || !live.rels.includes(want.rel)) {
      drift.push(`${want.rel} ${want.path}`);
    }
  }

  let status = 'fail';
  let message = 'No Link headers found on target page';
  if (links.length === 0) {
    // keep the not-found message
  } else if (registered.length === 0) {
    message = 'Link header(s) present but none carry a registered discovery rel';
  } else if (drift.length > 0) {
    message = `Link headers live but missing expected target(s): ${drift.join(', ')}`;
  } else {
    status = 'pass';
    message = 'Link headers present with registered discovery rels';
  }

  return {
    status,
    message,
    linkCount: links.length,
    registeredRelCount: registered.length,
    registered,
    links,
    drift,
  };
}

// ---------------------------------------------------------------------------
// Live fetch (network — main only)
// ---------------------------------------------------------------------------

async function main() {
  const argv = process.argv.slice(2);
  const asJson = argv.includes('--json');
  const urlFlag = argv.indexOf('--url');
  const url = urlFlag !== -1 ? argv[urlFlag + 1] : HOME_URL;
  if (!url) {
    console.error('✗ --url requires a value');
    process.exit(1);
  }

  let res;
  try {
    res = await fetch(url, { method: 'GET', redirect: 'follow' });
  } catch (err) {
    console.error(`✗ GET ${url} failed: ${err.message}`);
    process.exit(1);
  }

  // Collect every Link header field value. Undici coalesces repeat Link
  // headers into one comma-joined get('link') value — the same thing the
  // scanner sees — but iterate entries() too so nothing is dropped when a
  // proxy emits separate field lines.
  const values = [];
  for (const [name, value] of res.headers.entries()) {
    if (name.toLowerCase() === 'link') values.push(value);
  }
  const evaluation = evaluateLinkHeaders(values);
  const out = {
    url,
    httpStatus: res.status,
    ...evaluation,
  };

  if (asJson) {
    console.log(JSON.stringify(out, null, 2));
  } else {
    console.log(`Link-header verification for ${url} (HTTP ${res.status})`);
    for (const link of evaluation.links) {
      console.log(
        `  ○ <${link.target}> rel="${link.rels.join(' ')}"` +
          (link.params.type ? ` type="${link.params.type}"` : ''),
      );
    }
    if (evaluation.links.length === 0) {
      console.log('  ○ no Link header on the response');
    }
    console.log(`  registeredRelCount=${out.registeredRelCount} drift=${out.drift.length}`);
    console.log(`${out.status === 'pass' ? '✓' : '✗'} ${out.message}`);
  }
  process.exit(out.status === 'pass' ? 0 : 1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
